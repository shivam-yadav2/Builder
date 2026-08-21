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
import { Trash2, Phone, MessageCircle, Download } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState("All");

  const cleanPhone = (p) => String(p || "").replace(/\D/g, "").slice(-10);

  const filteredEnquiries =
    statusFilter === "All"
      ? enquiries
      : enquiries.filter((e) => (e.status || "New") === statusFilter);

  const statusCounts = {
    All: enquiries.length,
    New: enquiries.filter((e) => (e.status || "New") === "New").length,
    Contacted: enquiries.filter((e) => e.status === "Contacted").length,
    Closed: enquiries.filter((e) => e.status === "Closed").length,
  };

  // Export the current (filtered) list to a CSV file.
  const exportCsv = () => {
    const rows = filteredEnquiries.map((e) => ({
      Name: e.name || "",
      Mobile: e.phone || "",
      Email: e.email || "",
      Message: (e.message || "").replace(/\n/g, " "),
      Status: e.status || "New",
      Date: e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "",
    }));
    const headers = Object.keys(rows[0] || { Name: "", Mobile: "", Email: "", Message: "", Status: "", Date: "" });
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      cell: ({ row }) => {
        const phone = cleanPhone(row.original.phone);
        return (
          <div className="flex items-center gap-1.5">
            {phone && (
              <>
                <a
                  href={`tel:${phone}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                  title="Call"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/91${phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">General Inquiries</h1>
        <Button variant="outline" onClick={exportCsv} disabled={filteredEnquiries.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "New", "Contacted", "Closed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === s
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
            <span
              className={`rounded-full px-1.5 text-xs ${
                statusFilter === s ? "bg-white/20" : "bg-gray-100 text-gray-500"
              }`}
            >
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>
            {statusFilter === "All" ? "All Inquiries" : `${statusFilter} Inquiries`} ({filteredEnquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <DataTable
            columns={columns}
            data={filteredEnquiries}
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
