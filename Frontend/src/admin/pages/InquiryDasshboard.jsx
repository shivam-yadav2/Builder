import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@admin/components/ui/alert";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { DataTable } from "@admin/utils/Datatable";

const statusStyles = {
  New: "text-blue-700",
  Contacted: "text-amber-700",
  Closed: "text-gray-500",
};

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

const authHeader = () => ({
  Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
});

const InquiryDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/enquiry/get-enquiry`,
        { headers: authHeader() }
      );
      const payload =
        response?.data?.data ?? response?.data?.message ?? [];
      const processed = (payload || []).map((enquiry) => ({
        ...enquiry,
        phone: enquiry.phone?.toString() ?? "",
      }));
      setEnquiries(processed);
      setError(null);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Unable to load enquiries. Please try again later.");
      toast.error("Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  // Move an enquiry through the New -> Contacted -> Closed workflow.
  const updateStatus = async (id, status) => {
    setEnquiries((prev) =>
      prev.map((e) => (e._id === id ? { ...e, status } : e))
    );
    try {
      await axios.post(
        `${API_BASE_URL}/enquiry/update-status`,
        { id, status },
        { headers: authHeader() }
      );
      toast.success(`Marked as ${status}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
      fetchEnquiries();
    }
  };

  const handleDelete = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        axios.post(
          `${API_BASE_URL}/enquiry/delete-enquiry`,
          { id: selectedEnquiryId },
          { headers: authHeader() }
        ),
        {
          loading: "Deleting enquiry...",
          success: "Enquiry deleted successfully",
          error: "Failed to delete enquiry",
        }
      );
      fetchEnquiries();
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      setSelectedEnquiryId(null);
    }
  };

  const columns = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "phone",
      header: "Mobile",
      cell: ({ row }) => row.original.phone || "—",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "—",
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <span className="block max-w-md break-words">
          {row.original.message || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const current = row.original.status || "New";
        return (
          <Select
            value={current}
            onValueChange={(value) => updateStatus(row.original._id, value)}
          >
            <SelectTrigger className={`h-8 w-32 font-medium ${statusStyles[current] || ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <h1 className="text-2xl sm:text-3xl font-bold">General Inquiries</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Inquiries ({enquiries.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <DataTable
            columns={columns}
            data={enquiries}
            filterColumnId="name"
            filterPlaceholder="Search by name..."
          />
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this enquiry? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InquiryDashboard;
