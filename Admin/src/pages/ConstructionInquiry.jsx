import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert";
import {
  MoreVertical,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileUser,
  Trash2,
} from "lucide-react";
import { DataTable } from "@/utils/Datatable";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

const STATUS_MAP = {
  new: {
    displayName: "New Lead",
    className: "bg-amber-100 text-amber-800",
    icon: <Clock className="h-4 w-4 mr-1" />,
  },
  contacted: {
    displayName: "Contacted",
    className: "bg-purple-100 text-purple-800",
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  converted: {
    displayName: "Converted",
    className: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
  },
  lost: {
    displayName: "Lost",
    className: "bg-red-100 text-red-800",
    icon: <XCircle className="h-4 w-4 mr-1" />,
  },
  fake: {
    displayName: "Fake",
    className: "bg-gray-100 text-gray-800",
    icon: <AlertTriangle className="h-4 w-4 mr-1" />,
  },
};

const ACTION_TO_STATUS = {
  "lead-converted": "converted",
  "lead-lost": "lost",
  "lead-contacted": "contacted",
  "lead-fake": "fake",
};

const authHeader = () => ({
  Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
});

const convertBudgetToNumber = (enquiry) => {
  if (enquiry.budget && typeof enquiry.budget === "string") {
    return { ...enquiry, budget: parseInt(enquiry.budget, 10) };
  }
  return enquiry;
};

const ConstructionInquiry = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/constructionFilter/getAll`,
        { headers: authHeader() }
      );
      const payload =
        response?.data?.message ?? response?.data?.data ?? [];
      const processed = (payload || []).map((enquiry) =>
        convertBudgetToNumber({
          ...enquiry,
          _id: enquiry._id || Date.now().toString(),
          number: enquiry.number?.toString() ?? "",
          status: enquiry.status || "new",
        })
      );
      const constructionEnquiries = processed.filter(
        (item) => item.plotArea || item.constructionArea
      );
      setFilteredEnquiries(constructionEnquiries);
      setError(null);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError(
        "Unable to load construction inquiries. Please try again later."
      );
      toast.error("Failed to load construction inquiries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (enrollmentId, newStatus) => {
    setSelectedEnrollment(enrollmentId);
    setSelectedAction(newStatus);
    setDialogType("status");
    setIsDialogOpen(true);
  };

  const handleDelete = (enrollmentId) => {
    setSelectedEnrollment(enrollmentId);
    setDialogType("delete");
    setIsDialogOpen(true);
  };

  const getStatusDisplayName = (status) =>
    STATUS_MAP[status]?.displayName || status;
  const getApiStatusValue = (action) => ACTION_TO_STATUS[action] || "new";

  const confirmStatusChange = () => {
    setIsSubmitting(true);
    const newStatus = getApiStatusValue(selectedAction);

    const updated = filteredEnquiries.map((item) =>
      item._id === selectedEnrollment ? { ...item, status: newStatus } : item
    );

    setTimeout(() => {
      toast.success(`Status updated to ${getStatusDisplayName(newStatus)}`);
      setFilteredEnquiries(updated);
      setIsDialogOpen(false);
      setSelectedEnrollment(null);
      setSelectedAction(null);
      setDialogType(null);
      setIsSubmitting(false);
    }, 800);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        axios.post(
          `${API_BASE_URL}/constructionFilter/deleteById`,
          { id: selectedEnrollment },
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
      setSelectedEnrollment(null);
      setDialogType(null);
    }
  };

  const columns = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "number",
      header: "Mobile",
      cell: ({ row }) => row.original.number || "—",
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.original.location || "—",
    },
    {
      accessorKey: "plotArea",
      header: "Plot Area (sq ft)",
      cell: ({ row }) =>
        row.original.plotArea
          ? Number(row.original.plotArea).toLocaleString()
          : "—",
    },
    {
      accessorKey: "constructionArea",
      header: "Construction Area (sq ft)",
      cell: ({ row }) =>
        row.original.constructionArea
          ? Number(row.original.constructionArea).toLocaleString()
          : "—",
    },
    {
      accessorKey: "budget",
      header: "Budget (₹)",
      cell: ({ row }) => {
        const b = Number(row.original.budget) || 0;
        return b.toLocaleString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusInfo = STATUS_MAP[row.original.status] || STATUS_MAP.new;
        return (
          <Badge className={statusInfo.className}>
            <div className="flex items-center">
              {statusInfo.icon}
              {statusInfo.displayName}
            </div>
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const enquiry = row.original;
        return (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusChange(enquiry._id, "lead-contacted")
                  }
                >
                  Mark as Contacted
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusChange(enquiry._id, "lead-converted")
                  }
                >
                  Mark as Converted
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusChange(enquiry._id, "lead-lost")
                  }
                >
                  Mark as Lost
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusChange(enquiry._id, "lead-fake")
                  }
                >
                  Mark as Fake
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(enquiry._id)}
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Construction Inquiries
          </h1>
          <Badge variant="outline" className="flex items-center gap-1 py-1">
            <FileUser className="h-3 w-3" />
            Construction
          </Badge>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Inquiries ({filteredEnquiries.length})</CardTitle>
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
            <AlertDialogTitle>
              {dialogType === "delete"
                ? "Confirm Deletion"
                : "Confirm Status Change"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogType === "delete" ? (
                "Are you sure you want to delete this enquiry? This action cannot be undone."
              ) : (
                <>
                  Are you sure you want to mark this lead as{" "}
                  <strong>
                    {getStatusDisplayName(getApiStatusValue(selectedAction))}
                  </strong>
                  ?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={
                dialogType === "delete" ? confirmDelete : confirmStatusChange
              }
              disabled={isSubmitting}
            >
              {isSubmitting
                ? dialogType === "delete"
                  ? "Deleting..."
                  : "Updating..."
                : dialogType === "delete"
                  ? "Yes, Delete"
                  : "Yes, Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConstructionInquiry;
