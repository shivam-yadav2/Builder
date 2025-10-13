import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

// Mock dashboard data (replace with API-derived data)
const initialDashboardData = {
  totalProperties: 0,
  availableProperties: 0,
  totalValue: 0,
  pendingApprovals: 0,
  recentProperties: [],
  priceTrendData: [],
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [viewProperty, setViewProperty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchProperties = async () => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://backend.rsusb2sbuildersconstructions.com/api/v1/admin/get-all-properties',
        headers: {
          'Authorization': `Bearer ${Cookies.get('accessTokenAdmin')}`,
        },
      };
      const response = await axios.request(config);
      const properties = response.data.data || [];

      // Calculate dashboard metrics
      const totalProperties = properties.length;
      const availableProperties = properties.filter(p => p.status === 'Available').length;
      const totalValue = properties.reduce((sum, p) => sum + (parseFloat(p.unitPrice || p.totalPrice || 0)), 0);
      const pendingApprovals = properties.filter(p => p.approvalStatus === 'pending').length;

      // Mock price trend data (replace with actual data if available)
      const priceTrendData = [
        { month: 'Jan', price: 1000000 },
        { month: 'Feb', price: 1200000 },
        { month: 'Mar', price: 1500000 },
      ];

      setDashboardData({
        totalProperties,
        availableProperties,
        totalValue,
        pendingApprovals,
        recentProperties: properties.slice(0, 5), // Show up to 5 recent properties
        priceTrendData,
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties', {
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleView = (property) => {
    setViewProperty(property);
    setIsViewModalOpen(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title || '',
      type: property.type || '',
      fullAddress: property.fullAddress || '',
      pincode: property.pincode || '',
      state: property.state || '',
      city: property.city || '',
      locality: property.locality || '',
      landmark: property.landmark || '',
      landArea: property.landArea || '',
      unitPrice: property.unitPrice || property.totalPrice || '',
      propertyType: property.propertyType || '',
      description: property.description || '',
      status: property.status || 'Available',
      approvalStatus: property.approvalStatus || 'pending',
      rooms: property.rooms || '',
      bedrooms: property.bedrooms || '',
      kitchen: property.kitchen || '',
      bathrooms: property.bathrooms || '',
      floor: property.floor || '',
      park: property.park || false,
      buildYear: property.buildYear || '',
    });
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmEdit = async () => {
    try {
      const updateUrl = selectedProperty.type === 'Land'
        ? 'https://backend.rsusb2sbuildersconstructions.com/api/v1/land/update-land'
        : 'https://backend.rsusb2sbuildersconstructions.com/api/v1/home/update-home';

      const payload = {
        id: selectedProperty._id,
        ...formData,
      };

      await toast.promise(
        axios.post(updateUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('accessTokenAdmin')}`,
          },
        }),
        {
          loading: 'Updating property...',
          success: () => {
            setIsEditModalOpen(false);
            setSelectedProperty(null);
            setFormData({});
            fetchProperties();
            return `Property "${selectedProperty?.title}" updated successfully`;
          },
          error: (error) => {
            return error.response?.data?.message || 'Failed to update property';
          },
        }
      );
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property', {
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleDelete = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteUrl = selectedProperty.type === 'Land'
        ? 'https://backend.rsusb2sbuildersconstructions.com/api/v1/land/delete-land'
        : 'https://backend.rsusb2sbuildersconstructions.com/api/v1/home/delete-home';

      await toast.promise(
        axios.post(
          deleteUrl,
          { id: selectedProperty._id },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('accessTokenAdmin')}`,
            },
          }
        ),
        {
          loading: 'Deleting property...',
          success: () => {
            setIsDeleteModalOpen(false);
            setSelectedProperty(null);
            fetchProperties();
            return `Property "${selectedProperty?.title}" deleted successfully`;
          },
          error: (error) => {
            return error.response?.data?.message || 'Failed to delete property';
          },
        }
      );
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const truncateAddress = (address) => {
    const words = address?.split(' ') || [];
    return words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Rsusb2sbuilders Groups Property Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardData.totalProperties}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardData.availableProperties}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Value (₹)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardData.totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardData.pendingApprovals}</p>
          </CardContent>
        </Card>
      </div>

      {/* Price Trend Chart */}


      {/* Recent Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Recent Properties</span>
            <Link to="/dashboard/add_property">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Property
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>
                  <Button variant="ghost">
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <Button variant="ghost">
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.recentProperties.map((property, index) => (
                <TableRow key={property._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{property.title}</TableCell>
                  <TableCell>
                    <Badge variant={property.type === 'Land' ? 'default' : 'secondary'}>
                      {property.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{truncateAddress(property.fullAddress)}</TableCell>
                  <TableCell>₹{(property.unitPrice || property.totalPrice)?.toLocaleString()}</TableCell>
                  <TableCell>{property.landArea || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        property.status === 'Available' ? 'default' :
                          property.status === 'Pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        property.approvalStatus === 'approved' ? 'default' :
                          property.approvalStatus === 'pending' ? 'secondary' : 'outline'
                      }
                    >
                      {property.approvalStatus || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleView(property)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(property)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(property)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Property Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewProperty?.title}</DialogTitle>
          </DialogHeader>
          {viewProperty && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <p>{viewProperty.type}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p>{viewProperty.location}</p>
                </div>
                <div>
                  <Label>Full Address</Label>
                  <p>{viewProperty.fullAddress}</p>
                </div>
                <div>
                  <Label>Pincode</Label>
                  <p>{viewProperty.pincode}</p>
                </div>
                <div>
                  <Label>State</Label>
                  <p>{viewProperty.state}</p>
                </div>
                <div>
                  <Label>City</Label>
                  <p>{viewProperty.city}</p>
                </div>
                <div>
                  <Label>Locality</Label>
                  <p>{viewProperty.locality}</p>
                </div>
                <div>
                  <Label>Landmark</Label>
                  <p>{viewProperty.landmark}</p>
                </div>
                <div>
                  <Label>Land Area</Label>
                  <p>{viewProperty.landArea}</p>
                </div>
                <div>
                  <Label>Price</Label>
                  <p>₹{(viewProperty.unitPrice || viewProperty.totalPrice)?.toLocaleString()}</p>
                </div>
                {viewProperty.type === 'Home' && (
                  <>
                    <div>
                      <Label>Rooms</Label>
                      <p>{viewProperty.rooms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Bedrooms</Label>
                      <p>{viewProperty.bedrooms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Kitchen</Label>
                      <p>{viewProperty.kitchen || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <p>{viewProperty.bathrooms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Floor</Label>
                      <p>{viewProperty.floor || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Park</Label>
                      <p>{viewProperty.park ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label>Build Year</Label>
                      <p>{viewProperty.buildYear || 'N/A'}</p>
                    </div>
                  </>
                )}
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={
                      viewProperty.status === 'Available' ? 'default' :
                        viewProperty.status === 'Pending' ? 'secondary' : 'destructive'
                    }
                  >
                    {viewProperty.status}
                  </Badge>
                </div>
                <div>
                  <Label>Approval Status</Label>
                  <Badge
                    variant={
                      viewProperty.approvalStatus === 'approved' ? 'default' :
                        viewProperty.approvalStatus === 'pending' ? 'secondary' : 'outline'
                    }
                  >
                    {viewProperty.approvalStatus || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <Label>Property Type</Label>
                  <p>{viewProperty.propertyType}</p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p>{viewProperty.description}</p>
                </div>
                <div>
                  <Label>Creator</Label>
                  <p>{viewProperty.creator?.name} ({viewProperty.creator?.email})</p>
                </div>
                <div>
                  <Label>Admin Message</Label>
                  <p>{viewProperty.adminMessage || 'N/A'}</p>
                </div>
              </div>
              <div>
                <Label>Images</Label>
                <div className="flex gap-2 overflow-x-auto">
                  {viewProperty.images?.length > 0 ? (
                    viewProperty.images.map((img, index) => (
                      <img
                        key={index}
                        src={`https://backend.rsusb2sbuildersconstructions.com/${img}`}
                        alt={`Property ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Property Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property: {selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter property title"
                  />
                </div>
                <div>
                  <Label>Full Address</Label>
                  <Input
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleFormChange}
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleFormChange}
                    placeholder="Enter pincode"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label>Locality</Label>
                  <Input
                    name="locality"
                    value={formData.locality}
                    onChange={handleFormChange}
                    placeholder="Enter locality"
                  />
                </div>
                <div>
                  <Label>Landmark</Label>
                  <Input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleFormChange}
                    placeholder="Enter landmark"
                  />
                </div>
                <div>
                  <Label>Land Area</Label>
                  <Input
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleFormChange}
                    placeholder="Enter land area"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleFormChange}
                    placeholder="Enter price"
                    type="number"
                  />
                </div>
                <div>
                  <Label>Property Type</Label>
                  <Input
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleFormChange}
                    placeholder="Enter property type"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Approval Status</Label>
                  <Select
                    value={formData.approvalStatus}
                    onValueChange={(value) => handleSelectChange('approvalStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select approval status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter description"
                  />
                </div>
                {selectedProperty.type === 'Home' && (
                  <>
                    <div>
                      <Label>Rooms</Label>
                      <Input
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of rooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>Bedrooms</Label>
                      <Input
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of bedrooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>Kitchen</Label>
                      <Input
                        name="kitchen"
                        value={formData.kitchen}
                        onChange={handleFormChange}
                        placeholder="Enter number of kitchens"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of bathrooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>Floor</Label>
                      <Input
                        name="floor"
                        value={formData.floor}
                        onChange={handleFormChange}
                        placeholder="Enter floor number"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>Build Year</Label>
                      <Input
                        name="buildYear"
                        value={formData.buildYear}
                        onChange={handleFormChange}
                        placeholder="Enter build year"
                        type="number"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="park"
                        checked={formData.park}
                        onChange={handleFormChange}
                        className="h-4 w-4"
                      />
                      <Label>Parking Available</Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={confirmEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the property "{selectedProperty?.title}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;