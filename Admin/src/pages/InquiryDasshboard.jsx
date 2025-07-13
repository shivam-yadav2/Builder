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
import { Button } from "@/components/ui/button";
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
import { Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// API URL as a constant
const API_BASE_URL = "https://admin.samadhaangroups.co.in/api/v1";

const InquiryDashboardAcadmey = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
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
      const authData = {
        email: "shiv2@gmail.com",
        password: "123456",
      };

      const config = {
        method: "get",
        url: `${API_BASE_URL}/mainEnquiry/getAll`,
        headers: {
          "Content-Type": "text/plain",
        },
        data: authData,
      };

      const response = await axios.request(config);
      const processedEnquiries = (response.data.data || []).map((enquiry) =>
        convertBudgetToNumber({
          ...enquiry,
          phone: enquiry.phone.toString(), // Ensure phone is string
        })
      );

      setEnquiries(processedEnquiries);
      setError(null);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Unable to load enquiries. Please try again later.");
      toast.error("Failed to load enquiries");
    } finally {
      setIsLoading(false);
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
        axios.delete(`${API_BASE_URL}/mainEnquiry/delete/${selectedEnquiryId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            email: "shiv2@gmail.com",
            password: "123456",
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
      setSelectedEnquiryId(null);
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
        <h1 className="text-3xl font-bold">Inquiry Dashboard</h1>
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
          {error}
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Main Inquiries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {enquiries.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No inquiries found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry._id}>
                    <TableCell>{enquiry.name}</TableCell>
                    <TableCell>{enquiry.phone}</TableCell>
                    <TableCell>{enquiry.email}</TableCell>
                    <TableCell>{enquiry.message || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(enquiry._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this enquiry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InquiryDashboardAcadmey;