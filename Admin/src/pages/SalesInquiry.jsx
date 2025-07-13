import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Calendar,
  CheckCircle,
  Clock,
  LogOut,
  AlertTriangle,
  XCircle,
  FileUser,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// API URL as a constant
const API_BASE_URL = "https://admin.samadhaangroups.co.in/api/v1";

// Status mapping
const STATUS_MAP = {
  new: {
    displayName: "New Lead",
    badge: {
      variant: "secondary",
      className: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      icon: <Clock className="h-4 w-4 mr-1" />,
    },
  },
  contacted: {
    displayName: "Contacted",
    badge: {
      variant: "default",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      icon: <Users className="h-4 w-4 mr-1" />,
    },
  },
  interested: {
    displayName: "Interested",
    badge: {
      variant: "default",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      icon: <Calendar className="h-4 w-4 mr-1" />,
    },
  },
  converted: {
    displayName: "Converted",
    badge: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
    },
  },
  lost: {
    displayName: "Lost",
    badge: {
      variant: "default",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
      icon: <XCircle className="h-4 w-4 mr-1" />,
    },
  },
  fake: {
    displayName: "Fake",
    badge: {
      variant: "default",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      icon: <AlertTriangle className="h-4 w-4 mr-1" />,
    },
  },
};

const InquiryDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'status' or 'delete'
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Convert budget string to number
  const convertBudgetToNumber = (enquiry) => {
    if (enquiry.budget && typeof enquiry.budget === "string") {
      return {
        ...enquiry,
        budget: parseInt(enquiry.budget, 10),
      };
    }
    return enquiry;
  };

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const config = {
        method: "get",
        url: `${API_BASE_URL}/sellFilter/getAll`,
        headers: {},
        data: "",
      };

      const response = await axios.request(config);
      const processedEnquiries = response?.data?.message

      console.log(processedEnquiries)

      // Filter for sales inquiries (optional, since API is specific)
      const salesEnquiries = processedEnquiries?.filter((item) =>
        item.type?.toLowerCase().includes("home") || item.type?.toLowerCase().includes("land")
      );
      setFilteredEnquiries(salesEnquiries);
      setError(null);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Unable to load sales inquiries. Please try again later.");
      toast.error("Failed to load sales inquiries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
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

  const getStatusDisplayName = (status) => {
    return STATUS_MAP[status]?.displayName || status;
  };

  const getApiStatusValue = (action) => {
    const actionMap = {
      "lead-converted": "converted",
      "lead-lost": "lost",
      "lead-interested": "interested",
      "lead-contacted": "contacted",
      "lead-fake": "fake",
    };
    return actionMap[action] || "new";
  };

  const confirmStatusChange = () => {
    setIsSubmitting(true);
    const newStatus = getApiStatusValue(selectedAction);

    const updated = filteredEnquiries.map((item) =>
      item._id === selectedEnrollment
        ? { ...item, status: newStatus }
        : item
    );

    setTimeout(() => {
      toast.success(`Status updated to ${getStatusDisplayName(newStatus)}`);
      setFilteredEnquiries(updated);
      setIsDialogOpen(false);
      setSelectedEnrollment(null);
      setSelectedAction(null);
      setDialogType(null);
      setIsSubmitting(false);
    }, 800); // Simulate delay
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        axios.delete(`${API_BASE_URL}/sellFilter/delete/${selectedEnrollment}`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
        {
          loading: "Deleting enquiry...",
          success: "Enquiry deleted successfully",
          error: "Failed to delete enquiry",
        }
      );

      // Refresh enquiries after deletion
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Inquiry Dashboard</h1>
          <Badge variant="outline" className="flex items-center gap-1 py-1">
            <FileUser className="h-3 w-3" />
            Sales Inquiries Only
          </Badge>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Sales Inquiries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEnquiries.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No sales inquiries found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Area (sq ft)</TableHead>
                  <TableHead>Budget (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.map((enquiry) => {
                  const statusInfo = STATUS_MAP[enquiry.status] || STATUS_MAP.new;
                  return (
                    <TableRow key={enquiry._id}>
                      <TableCell>{enquiry.name}</TableCell>
                      <TableCell>{enquiry.number}</TableCell>
                      <TableCell>{enquiry.type}</TableCell>
                      <TableCell>{enquiry.location}</TableCell>
                      <TableCell>{enquiry.area}</TableCell>
                      <TableCell>{enquiry.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={statusInfo.badge.variant}
                          className={statusInfo.badge.className}
                        >
                          <div className="flex items-center">
                            {statusInfo.badge.icon}
                            {statusInfo.displayName}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                                  handleStatusChange(enquiry._id, "lead-interested")
                                }
                              >
                                Mark as Interested
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Alert Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogType === "delete" ? "Confirm Deletion" : "Confirm Status Change"}
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
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={dialogType === "delete" ? confirmDelete : confirmStatusChange}
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

export default InquiryDashboard;