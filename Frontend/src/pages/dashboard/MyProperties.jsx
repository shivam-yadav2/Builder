
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Trash2 } from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyContext from "@/context/MyContext";

const MyPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({
    id: null,
    type: null,
    status: null,
  });

  const context = useContext(MyContext);
  const { userData } = context;

  const fetchProperties = async () => {
    try {
      const data = JSON.stringify({
        creatorType: "User",
        userId: userData._id,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4000/api/v1/users/user-properties",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      setProperties(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch properties. Please try again later.");
      setLoading(false);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const property = properties.find((p) => p._id === selectedPropertyId);
      const type = property.propertyType === "rent" || property.propertyType === "sale" ? "Home" : "Land";
      const data = JSON.stringify({
        id: selectedPropertyId,
        type,
        userId: userData._id,
      });

      const config = {
        method: "post",
        url: "http://localhost:4000/api/v1/users/user-property-delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        data: data,
      };

      await axios.request(config);
      setProperties(
        properties.filter((property) => property._id !== selectedPropertyId)
      );
      setDeleteModalOpen(false);
      setSelectedPropertyId(null);
    } catch (error) {
      console.error("Failed to delete property:", error);
      setError("Failed to delete property. Please try again.");
      setDeleteModalOpen(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const data = JSON.stringify({
        id: pendingStatusUpdate.id,
        type: pendingStatusUpdate.type,
        status: pendingStatusUpdate.status,
        userId: userData._id,
      });

      const config = {
        method: "post",
        url: "http://localhost:4000/api/v1/users/update-property-availability",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      setProperties(
        properties.map((property) =>
          property._id === pendingStatusUpdate.id
            ? { ...property, status: response.data.data.status }
            : property
        )
      );
      setStatusModalOpen(false);
      setPendingStatusUpdate({ id: null, type: null, status: null });
    } catch (error) {
      console.error("Failed to update property status:", error);
      setError("Failed to update property status. Please try again.");
      setStatusModalOpen(false);
    }
  };

  const openDeleteModal = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setDeleteModalOpen(true);
  };

  const openStatusModal = (propertyId, type, status) => {
    setPendingStatusUpdate({ id: propertyId, type, status });
    setStatusModalOpen(true);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-8">
          <h1 className="text-2xl font-bold mb-4">My Properties</h1>
          <Separator className="mb-6" />
          <p>Loading properties...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-8">
          <h1 className="text-2xl font-bold mb-4">My Properties</h1>
          <Separator className="mb-6" />
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-4">My Properties</h1>
        <Separator className="mb-6" />
        {properties.some(
          (property) => property.approvalStatus === "pending"
        ) && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Pending Properties</AlertTitle>
              <AlertDescription>
                Properties awaiting admin approval are displayed with lower
                opacity. You can still update status or delete them.
              </AlertDescription>
            </Alert>
          )}
        {properties.length === 0 ? (
          <Alert>
            <AlertTitle>No Properties Found</AlertTitle>
            <AlertDescription>
              You don't have any properties listed yet.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property._id}
                className="shadow-md hover:shadow-lg transition py-0 pb-4 flex flex-col gap-2"
              >
                <div
                  className={`flex-1 ${property.approvalStatus === "pending"
                      ? "opacity-60"
                      : "opacity-100"
                    }`}
                >
                  <img
                    src={`http://localhost:4000/${property.images[0]}`}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-2">
                      {property.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {property.location}
                    </p>
                    <p className="text-lg font-medium text-gray-800 mb-3">
                      {`₹${parseInt(property.unitPrice).toLocaleString(
                        "en-IN"
                      )} / sq.ft`}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          property.status === "Available"
                            ? "default"
                            : property.status === "Sold"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          property.status === "Available"
                            ? "bg-green-500 text-white"
                            : property.status === "Sold"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                        }
                      >
                        {property.status}
                      </Badge>
                      <Badge
                        variant={
                          property.approvalStatus === "pending"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {property.approvalStatus}
                      </Badge>
                    </div>
                    {property.adminMessage && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        <span className="font-semibold">Admin Message:</span>{" "}
                        {property.adminMessage}
                      </p>
                    )}
                  </CardContent>
                </div>
                <CardFooter className="p-4 bg-gray-50 flex justify-between items-center">
                  <Select
                    value={property.status}
                    onValueChange={(value) =>
                      openStatusModal(
                        property._id,
                        property.propertyType === "rent" ||
                          property.propertyType === "sale"
                          ? "Home"
                          : "Land",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openDeleteModal(property._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Confirmation Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the property status to{" "}
              <span className="font-semibold">
                {pendingStatusUpdate.status}
              </span>
              ? This action will update the property's availability.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusModalOpen(false);
                setPendingStatusUpdate({ id: null, type: null, status: null });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyPropertiesPage;
