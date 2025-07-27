import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { Pencil, Trash2, Home as HomeIcon, Mountain, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/utils/Datatable';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const AllProperty = () => {
  const [properties, setProperties] = useState([]);
  const [viewProperty, setViewProperty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]); // For image previews

  const fetchProperties = async () => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:4000/api/v1/admin/get-all-properties',
        headers: {
          'Authorization': `Bearer ${Cookies.get('accessTokenAdmin')}`,
        },
      };
      const response = await axios.request(config);
      setProperties(response.data.data || []);
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
      images: property.images || [], // Initialize with existing images
      rooms: property.rooms || '',
      bedrooms: property.bedrooms || '',
      kitchen: property.kitchen || '',
      bathrooms: property.bathrooms || '',
      floor: property.floor || '',
      park: property.park || false,
      buildYear: property.buildYear || '',
    });
    setImagePreviews(
      property.images?.map((img) => `http://localhost:4000/${img}`) || []
    );
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
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
        ? 'http://localhost:4000/api/v1/land/update-land'
        : 'http://localhost:4000/api/v1/home/update-home';

      const formDataToSend = new FormData();
      formDataToSend.append('id', selectedProperty._id);
      Object.keys(formData).forEach((key) => {
        if (key === 'images') {

          console.log(formData.images)

          if (formData.images?.length) {
            Array.from(formData.images).forEach((file, index) => {
              formDataToSend.append("images", file);
            });
          }


        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log(formDataToSend?.images)
      await toast.promise(
        axios.post(updateUrl, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('accessTokenAdmin')}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }),
        {
          loading: 'Updating property...',
          success: () => {
            setIsEditModalOpen(false);
            setSelectedProperty(null);
            setFormData({});
            setImagePreviews([]);
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
        ? 'http://localhost:4000/api/v1/land/delete-land'
        : 'http://localhost:4000/api/v1/home/delete-home';

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
            setProperties(properties.filter(p => p._id !== selectedProperty._id));
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

  const columns = [
    {
      accessorKey: 'serial',
      header: 'S.No',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge
          className={
            row.original.type === 'Land'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-purple-100 text-purple-700'
          }
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => truncateAddress(row.original.fullAddress),
    },
    {
      accessorKey: 'unitPrice',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `₹${parseFloat(row.original.unitPrice || row.original.totalPrice || 0).toLocaleString()}`,
    },
    {
      accessorKey: 'landArea',
      header: 'Size',
      cell: ({ row }) => row.original.landArea || 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === 'Available'
              ? 'bg-green-100 text-green-700'
              : row.original.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'approvalStatus',
      header: 'Approval Status',
      cell: ({ row }) => (
        <Badge
          className={
            row.original.approvalStatus === 'approved'
              ? 'bg-blue-100 text-blue-700'
              : row.original.approvalStatus === 'pending'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700'
          }
        >
          {row.original.approvalStatus || 'N/A'}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(property)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(property)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(property)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">All Properties</h1>
        <div className="flex gap-3">
          <Link to="/dashboard/add_property">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-1" /> Add Property
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={properties} />

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
                  <Label className={'mb-2'}>Type</Label>
                  <p>{viewProperty.type}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Location</Label>
                  <p>{viewProperty.location}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Full Address</Label>
                  <p>{viewProperty.fullAddress}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Pincode</Label>
                  <p>{viewProperty.pincode}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>State</Label>
                  <p>{viewProperty.state}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>City</Label>
                  <p>{viewProperty.city}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Locality</Label>
                  <p>{viewProperty.locality}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Landmark</Label>
                  <p>{viewProperty.landmark}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Land Area</Label>
                  <p>{viewProperty.landArea}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Price</Label>
                  <p>₹{viewProperty.unitPrice || viewProperty.totalPrice}</p>
                </div>
                {viewProperty.type === 'Home' && (
                  <>
                    <div>
                      <Label className={'mb-2'}>Rooms</Label>
                      <p>{viewProperty.rooms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className={'mb-2'}>Bedrooms</Label>
                      <p>{viewProperty.bedrooms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className={'mb-2'}>Kitchen</Label>
                      <p>{viewProperty.kitchen || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className={'mb-2'}>Bathrooms</Label>
                      <p>{viewProperty.bathrooms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className={'mb-2'}>Floor</Label>
                      <p>{viewProperty.floor || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className={'mb-2'}>Park</Label>
                      <p>{viewProperty.park ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label className={'mb-2'}>Build Year</Label>
                      <p>{viewProperty.buildYear || 'N/A'}</p>
                    </div>
                  </>
                )}
                <div>
                  <Label className={'mb-2'}>Status</Label>
                  <Badge
                    className={
                      viewProperty.status === 'Available'
                        ? 'bg-green-100 text-green-700'
                        : viewProperty.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }
                  >
                    {viewProperty.status}
                  </Badge>
                </div>
                <div>
                  <Label className={'mb-2'}>Approval Status</Label>
                  <Badge
                    className={
                      viewProperty.approvalStatus === 'approved'
                        ? 'bg-blue-100 text-blue-700'
                        : viewProperty.approvalStatus === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {viewProperty.approvalStatus || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <Label className={'mb-2'}>Property Type</Label>
                  <p>{viewProperty.propertyType}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Description</Label>
                  <p>{viewProperty.description}</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Creator</Label>
                  <p>{viewProperty.creator?.name} ({viewProperty.creator?.email})</p>
                </div>
                <div>
                  <Label className={'mb-2'}>Admin Message</Label>
                  <p>{viewProperty.adminMessage || 'N/A'}</p>
                </div>
              </div>
              <div>
                <Label className={'mb-2'}>Images</Label>
                <div className="flex gap-2 overflow-x-auto">
                  {viewProperty.images?.length > 0 ? (
                    viewProperty.images.map((img, index) => (
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
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
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
                {/* Common Fields for Both Home and Land */}
                <div>
                  <Label className={'mb-2'}>Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter property title"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>Full Address</Label>
                  <Input
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleFormChange}
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>Pincode</Label>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleFormChange}
                    placeholder="Enter pincode"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>State</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>City</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>Locality</Label>
                  <Input
                    name="locality"
                    value={formData.locality}
                    onChange={handleFormChange}
                    placeholder="Enter locality"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>Landmark</Label>
                  <Input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleFormChange}
                    placeholder="Enter landmark"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>Land Area</Label>
                  <Input
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleFormChange}
                    placeholder="Enter land area"
                    type="number"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>Price</Label>
                  <Input
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleFormChange}
                    placeholder="Enter price"
                    type="number"
                  />
                </div>
                <div>
                  <Label className={'mb-2'}>Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange('propertyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={'mb-2'}>Status</Label>
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
                  <Label className={'mb-2'}>Approval Status</Label>
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
                  <Label className={'mb-2'}>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter description"
                  />
                </div>
                {/* Image Upload Field */}
                <div className="col-span-1 sm:col-span-2">
                  <Label className={'mb-2'}>Images (Max 5)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500 mb-2">
                    {formData.images?.length || 0}/5 images selected
                  </p>
                  <div className="flex gap-2 overflow-x-auto">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Home-Specific Fields */}
                {selectedProperty.type === 'Home' && (
                  <>
                    <div>
                      <Label className={'mb-2'}>Rooms</Label>
                      <Input
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of rooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label className={'mb-2'}>Bedrooms</Label>
                      <Input
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of bedrooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label className={'mb-2'}>Kitchen</Label>
                      <Input
                        name="kitchen"
                        value={formData.kitchen}
                        onChange={handleFormChange}
                        placeholder="Enter number of kitchens"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label className={'mb-2'}>Bathrooms</Label>
                      <Input
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of bathrooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label className={'mb-2'}>Floor</Label>
                      <Input
                        name="floor"
                        value={formData.floor}
                        onChange={handleFormChange}
                        placeholder="Enter floor number"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label className={'mb-2'}>Build Year</Label>
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
                      <Label className={'mb-2'}>Parking Available</Label>
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
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the property "{selectedProperty?.title}"? This action cannot be undone.</p>
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

export default AllProperty;