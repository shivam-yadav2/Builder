import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AdminApprovalPage = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/get-all-properties",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
          },
        }
      );

      const pendingProperties = response.data.data?.filter(
        (prop) => prop.approvalStatus === "pending"
      ) || [];

      setProperties(pendingProperties);
    } catch (error) {
      toast.error("Failed to fetch properties", {
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleStatusUpdate = async (propertyId, status, propertyType) => {
    if (!propertyId || !status || !propertyType) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/admin/update-property-status",
        {
          id: propertyId,
          status,
          message,
          type: propertyType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
          },
        }
      );

      toast.success("Property status updated", {
        description: `Status changed to ${status}`,
      });

      setMessage("");
      setSelectedProperty(null);
      await fetchProperties();
      navigate("/dashboard/all_property");
    } catch (error) {
      toast.error("Failed to update status", {
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {!loading && properties.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No properties pending approval at this time.
              </p>
            </div>
          )}
          {!loading && properties.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Approval Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>{property.title || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          property.type === "Land"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-purple-100 text-purple-700"
                        }
                      >
                        {property.type || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.location || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className="bg-orange-100 text-orange-700">
                        {property.approvalStatus || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedProperty(property)}
                            disabled={loading}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Property: {selectedProperty?.title || "N/A"}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedProperty && (
                            <div className="space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Property Details
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Type:</h4>
                                    <p>{selectedProperty.type || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Location:</h4>
                                    <p>{selectedProperty.location || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Full Address:</h4>
                                    <p>{selectedProperty.fullAddress || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Pincode:</h4>
                                    <p>{selectedProperty.pincode || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">State:</h4>
                                    <p>{selectedProperty.state || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">City:</h4>
                                    <p>{selectedProperty.city || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Locality:</h4>
                                    <p>{selectedProperty.locality || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Landmark:</h4>
                                    <p>{selectedProperty.landmark || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Land Area:</h4>
                                    <p>{selectedProperty.landArea || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Price:</h4>
                                    <p>
                                      ₹
                                      {selectedProperty.unitPrice ||
                                        selectedProperty.totalPrice ||
                                        "N/A"}
                                    </p>
                                  </div>
                                  {selectedProperty.type === "Home" && (
                                    <>
                                      <div>
                                        <h4 className="font-semibold">Rooms:</h4>
                                        <p>{selectedProperty.rooms || "N/A"}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Bedrooms:</h4>
                                        <p>{selectedProperty.bedrooms || "N/A"}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Kitchen:</h4>
                                        <p>{selectedProperty.kitchen || "N/A"}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Bathrooms:</h4>
                                        <p>{selectedProperty.bathrooms || "N/A"}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Floor:</h4>
                                        <p>{selectedProperty.floor || "N/A"}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Park:</h4>
                                        <p>{selectedProperty.park ? "Yes" : "No"}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Build Year:</h4>
                                        <p>{selectedProperty.buildYear || "N/A"}</p>
                                      </div>
                                    </>
                                  )}
                                  <div>
                                    <h4 className="font-semibold">Property Type:</h4>
                                    <p>{selectedProperty.propertyType || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Description:</h4>
                                    <p>{selectedProperty.description || "N/A"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Creator:</h4>
                                    <p>
                                      {selectedProperty.creator?.name || "N/A"} (
                                      {selectedProperty.creator?.email || "N/A"})
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                              <div>
                                <h4 className="font-semibold">Images:</h4>
                                <div className="flex gap-2 overflow-x-auto">
                                  {selectedProperty.images?.length > 0 ? (
                                    selectedProperty.images.map((img, index) => (
                                      <img
                                        key={index}
                                        src={`http://localhost:4000/${img}`}
                                        alt={`Property ${index}`}
                                        className="w-24 h-24 object-cover rounded"
                                      />
                                    ))
                                  ) : (
                                    <p>No images available</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold">Message to User:</h4>
                                <Textarea
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Enter notification message"
                                  disabled={loading}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      selectedProperty._id,
                                      "approved",
                                      selectedProperty.type
                                    )
                                  }
                                  disabled={loading}
                                  className="flex items-center gap-2"
                                >
                                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      selectedProperty._id,
                                      "denied",
                                      selectedProperty.type
                                    )
                                  }
                                  disabled={loading}
                                  className="flex items-center gap-2"
                                >
                                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                  Deny
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApprovalPage;