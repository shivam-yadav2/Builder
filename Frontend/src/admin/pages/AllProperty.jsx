import React, { useEffect, useState } from 'react';
import { Button } from '@admin/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@admin/components/ui/dialog';
import { Input } from '@admin/components/ui/input';
import { Label } from '@admin/components/ui/label';
import { Textarea } from '@admin/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@admin/components/ui/select';
import axios from 'axios';
import {
  Pencil, Trash2, Home as HomeIcon, Mountain, Plus, Star,
  MapPin, Bed, Bath, Square, Layers, Car, CalendarDays, Building2,
  User, IndianRupee, ImageOff,
} from 'lucide-react';
import { Card } from '@admin/components/ui/card';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@admin/components/ui/dropdown-menu';
import { DataTable } from '@admin/utils/Datatable';
import { Link } from 'react-router-dom';
import { Badge } from '@admin/components/ui/badge';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

// Label with optional required (*) marker and a small grey hint line.
const FieldLabel = ({ children, required, hint }) => (
  <div className="mb-1">
    <Label className="text-sm font-medium text-gray-800">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </Label>
    {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
  </div>
);

// Section heading used to group the long edit form.
const SectionHeading = ({ children }) => (
  <h3 className="col-span-1 mb-1 mt-2 border-b pb-2 text-base font-semibold text-gray-900 sm:col-span-2">
    {children}
  </h3>
);

// --- View modal helpers ---
const statusBadgeClass = (status) =>
  status === 'Available'
    ? 'bg-green-100 text-green-700'
    : status === 'Pending'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';

const approvalBadgeClass = (status) =>
  status === 'approved'
    ? 'bg-blue-100 text-blue-700'
    : status === 'pending'
      ? 'bg-orange-100 text-orange-700'
      : 'bg-gray-100 text-gray-700';

// A compact icon stat card (e.g. bedrooms, bathrooms).
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border bg-gray-50 p-3 text-center">
    <Icon className="h-5 w-5 text-emerald-600" />
    <span className="text-base font-semibold text-gray-900">{value ?? '—'}</span>
    <span className="text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
  </div>
);

// A labelled detail row used inside the View modal sections.
const DetailRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-800 break-words">{value || '—'}</span>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="rounded-lg border p-4">
    <h4 className="mb-3 text-sm font-semibold text-gray-900">{title}</h4>
    {children}
  </div>
);

const AllProperty = () => {
  const [properties, setProperties] = useState([]);
  const [viewProperty, setViewProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({});
  const [existingImages, setExistingImages] = useState([]); // existing image paths to keep
  const [newImages, setNewImages] = useState([]); // newly added File objects
  const [isSaving, setIsSaving] = useState(false);

  const MAX_IMAGES = 15;

  const fetchProperties = async () => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/get-all-properties`,
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
    setActiveImage(0);
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
    setExistingImages(property.images || []);
    setNewImages([]);
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
    if (existingImages.length + newImages.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = ''; // allow re-selecting the same file
  };

  // Remove one of the already-saved images (won't be sent in keepImages).
  const handleRemoveExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove a not-yet-uploaded image.
  const handleRemoveNew = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmEdit = async () => {
    if (existingImages.length + newImages.length === 0) {
      toast.error('A property must have at least one image');
      return;
    }

    const updateUrl = selectedProperty.type === 'Land'
      ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/land/update-land`
      : `${import.meta.env.VITE_API_BASE_URL}/api/v1/home/update-home`;

    const formDataToSend = new FormData();
    formDataToSend.append('id', selectedProperty._id);
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    // Tell the backend which existing photos to keep, then attach new uploads.
    formDataToSend.append('keepImages', JSON.stringify(existingImages));
    newImages.forEach((file) => formDataToSend.append('images', file));

    setIsSaving(true);
    try {
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
            setExistingImages([]);
            setNewImages([]);
            fetchProperties();
            return `Property "${selectedProperty?.title}" updated successfully`;
          },
          error: (error) => {
            return error.response?.data?.message || 'Failed to update property';
          },
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteUrl = selectedProperty.type === 'Land'
        ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/land/delete-land`
        : `${import.meta.env.VITE_API_BASE_URL}/api/v1/home/delete-home`;

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

  // Toggle whether a property is featured on the public homepage.
  const toggleFeatured = async (property) => {
    const updateUrl = property.type === 'Land'
      ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/land/update-land`
      : `${import.meta.env.VITE_API_BASE_URL}/api/v1/home/update-home`;
    const next = !property.isFeatured;
    // Optimistic update for snappy UI.
    setProperties((prev) =>
      prev.map((p) => (p._id === property._id ? { ...p, isFeatured: next } : p))
    );
    try {
      await axios.post(
        updateUrl,
        { id: property._id, isFeatured: next },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('accessTokenAdmin')}`,
          },
        }
      );
      toast.success(next ? 'Marked as featured' : 'Removed from featured');
    } catch (error) {
      // Roll back on failure.
      setProperties((prev) =>
        prev.map((p) => (p._id === property._id ? { ...p, isFeatured: !next } : p))
      );
      toast.error(error.response?.data?.message || 'Failed to update featured status');
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
      accessorKey: 'isFeatured',
      header: 'Featured',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            title={property.isFeatured ? 'Featured — click to remove' : 'Click to feature'}
            onClick={() => toggleFeatured(property)}
          >
            <Star
              className={
                property.isFeatured
                  ? 'h-5 w-5 fill-amber-400 text-amber-400'
                  : 'h-5 w-5 text-gray-300'
              }
            />
          </Button>
        );
      },
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
        <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">{viewProperty?.title}</DialogTitle>
          </DialogHeader>
          {viewProperty && (
            <div className="space-y-5">
              {/* Image gallery */}
              <div>
                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-gray-100 sm:h-72">
                  {viewProperty.images?.length > 0 ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${viewProperty.images[activeImage] || viewProperty.images[0]}`}
                      alt={viewProperty.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                      <ImageOff className="h-8 w-8" />
                      <span className="text-sm">No images available</span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <Badge className="bg-black/70 text-white hover:bg-black/70">
                      {viewProperty.type}
                    </Badge>
                    {viewProperty.isFeatured && (
                      <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400">
                        <Star className="mr-1 h-3 w-3 fill-current" /> Featured
                      </Badge>
                    )}
                  </div>
                </div>
                {viewProperty.images?.length > 1 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {viewProperty.images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                          activeImage === index ? 'border-emerald-500' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${img}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title, location & price */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{viewProperty.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {viewProperty.location || viewProperty.fullAddress}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className={statusBadgeClass(viewProperty.status)}>
                      {viewProperty.status}
                    </Badge>
                    <Badge className={approvalBadgeClass(viewProperty.approvalStatus)}>
                      {viewProperty.approvalStatus || 'N/A'}
                    </Badge>
                    {viewProperty.propertyType && (
                      <Badge variant="secondary" className="capitalize">
                        For {viewProperty.propertyType}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-0.5 text-2xl font-bold text-emerald-600">
                    <IndianRupee className="h-5 w-5" />
                    {Number(viewProperty.unitPrice || viewProperty.totalPrice || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {viewProperty.type === 'Home' ? 'Total price' : 'Per unit price'}
                  </p>
                </div>
              </div>

              {/* Key stats (Home only) */}
              {viewProperty.type === 'Home' && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  <StatCard icon={Bed} label="Beds" value={viewProperty.bedrooms} />
                  <StatCard icon={Bath} label="Baths" value={viewProperty.bathrooms} />
                  <StatCard icon={HomeIcon} label="Rooms" value={viewProperty.rooms} />
                  <StatCard icon={Layers} label="Floors" value={viewProperty.floor} />
                  <StatCard icon={Car} label="Parking" value={viewProperty.park ? 'Yes' : 'No'} />
                  <StatCard icon={CalendarDays} label="Built" value={viewProperty.buildYear} />
                </div>
              )}

              {/* Location & area sections */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SectionCard title="Location">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <DetailRow label="Full Address" value={viewProperty.fullAddress} />
                    <DetailRow label="Landmark" value={viewProperty.landmark} />
                    <DetailRow label="City" value={viewProperty.city} />
                    <DetailRow label="State" value={viewProperty.state} />
                    <DetailRow label="Locality" value={viewProperty.locality} />
                    <DetailRow label="Pincode" value={viewProperty.pincode} />
                  </div>
                </SectionCard>
                <SectionCard title="Property Info">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <DetailRow
                      label="Land Area"
                      value={viewProperty.landArea ? `${viewProperty.landArea} sq.ft` : null}
                    />
                    {viewProperty.type === 'Home' && (
                      <DetailRow label="Kitchen" value={viewProperty.kitchen} />
                    )}
                    <DetailRow label="Listing Type" value={viewProperty.type} />
                    <DetailRow label="Intent" value={viewProperty.propertyType} />
                  </div>
                </SectionCard>
              </div>

              {/* Description */}
              {viewProperty.description && (
                <SectionCard title="Description">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {viewProperty.description}
                  </p>
                </SectionCard>
              )}

              {/* Meta */}
              {(viewProperty.creator || viewProperty.adminMessage) && (
                <SectionCard title="Other Details">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {viewProperty.creator && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="h-4 w-4 text-gray-400" />
                        {viewProperty.creator?.name}
                        {viewProperty.creator?.email ? ` (${viewProperty.creator.email})` : ''}
                      </div>
                    )}
                    <DetailRow label="Admin Message" value={viewProperty.adminMessage} />
                  </div>
                </SectionCard>
              )}
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
              <p className="text-sm text-gray-500">
                Fields marked <span className="text-red-500">*</span> are
                required. Changes go live as soon as you save.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ---- Basic Information ---- */}
                <SectionHeading>Basic Information</SectionHeading>
                <div>
                  <FieldLabel required hint="Public title buyers will see">
                    Title
                  </FieldLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter property title"
                  />
                </div>
                <div>
                  <FieldLabel hint="How the listing appears on the site">
                    Property Type
                  </FieldLabel>
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
                <div className="col-span-1 sm:col-span-2">
                  <FieldLabel hint="Describe condition, view, connectivity and highlights">
                    Description
                  </FieldLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    placeholder="Enter description"
                  />
                </div>

                {/* ---- Address ---- */}
                <SectionHeading>Address</SectionHeading>
                <div>
                  <FieldLabel required>Full Address</FieldLabel>
                  <Input
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleFormChange}
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <FieldLabel required hint="6-digit pincode">
                    Pincode
                  </FieldLabel>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleFormChange}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter pincode"
                  />
                </div>
                <div>
                  <FieldLabel required>State</FieldLabel>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <FieldLabel required>City</FieldLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <FieldLabel required>Locality</FieldLabel>
                  <Input
                    name="locality"
                    value={formData.locality}
                    onChange={handleFormChange}
                    placeholder="Enter locality"
                  />
                </div>
                <div>
                  <FieldLabel hint="A nearby well-known point (optional)">
                    Landmark
                  </FieldLabel>
                  <Input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleFormChange}
                    placeholder="Enter landmark"
                  />
                </div>

                {/* ---- Area, Pricing & Status ---- */}
                <SectionHeading>Area, Pricing &amp; Status</SectionHeading>
                <div>
                  <FieldLabel required hint="Plot size in sq.ft">
                    Land Area
                  </FieldLabel>
                  <Input
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleFormChange}
                    placeholder="Enter land area"
                    type="number"
                  />
                </div>
                <div>
                  <FieldLabel required hint="Amount in ₹">
                    Price
                  </FieldLabel>
                  <Input
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleFormChange}
                    placeholder="Enter price"
                    type="number"
                  />
                </div>
                <div>
                  <FieldLabel hint="Availability shown to buyers">
                    Status
                  </FieldLabel>
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
                  <FieldLabel hint="Controls if it appears publicly">
                    Approval Status
                  </FieldLabel>
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

                {/* ---- Home-Specific Fields ---- */}
                {selectedProperty.type === 'Home' && (
                  <>
                    <SectionHeading>House Details</SectionHeading>
                    <div>
                      <FieldLabel required>Rooms</FieldLabel>
                      <Input
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of rooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <FieldLabel required>Bedrooms</FieldLabel>
                      <Input
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of bedrooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <FieldLabel>Kitchen</FieldLabel>
                      <Input
                        name="kitchen"
                        value={formData.kitchen}
                        onChange={handleFormChange}
                        placeholder="Enter number of kitchens"
                        type="number"
                      />
                    </div>
                    <div>
                      <FieldLabel required>Bathrooms</FieldLabel>
                      <Input
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleFormChange}
                        placeholder="Enter number of bathrooms"
                        type="number"
                      />
                    </div>
                    <div>
                      <FieldLabel required>Floor</FieldLabel>
                      <Input
                        name="floor"
                        value={formData.floor}
                        onChange={handleFormChange}
                        placeholder="Enter floor number"
                        type="number"
                      />
                    </div>
                    <div>
                      <FieldLabel required hint="Year of construction">
                        Build Year
                      </FieldLabel>
                      <Input
                        name="buildYear"
                        value={formData.buildYear}
                        onChange={handleFormChange}
                        placeholder="Enter build year"
                        type="number"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
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

                {/* ---- Images ---- */}
                <SectionHeading>Photos</SectionHeading>
                <div className="col-span-1 sm:col-span-2">
                  <div className="mb-3 flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Existing photos are kept. Remove the ones you don't want
                      with the trash icon, and add new ones below — they're
                      merged together. The first photo is used as the cover.
                    </span>
                  </div>
                  <FieldLabel hint={`Up to ${MAX_IMAGES} images total (existing + new).`}>
                    Add Images
                  </FieldLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500 mb-2">
                    {existingImages.length + newImages.length}/{MAX_IMAGES} images
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* Existing (saved) images */}
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${img}`}
                          alt={`Saved ${index}`}
                          className="h-24 w-24 rounded object-cover"
                        />
                        <span className="absolute bottom-0 left-0 rounded-tr bg-black/60 px-1 text-[10px] text-white">
                          Saved
                        </span>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -right-1 -top-1 h-6 w-6"
                          onClick={() => handleRemoveExisting(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {/* Newly added images */}
                    {newImages.map((file, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index}`}
                          className="h-24 w-24 rounded object-cover"
                        />
                        <span className="absolute bottom-0 left-0 rounded-tr bg-green-600/80 px-1 text-[10px] text-white">
                          New
                        </span>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -right-1 -top-1 h-6 w-6"
                          onClick={() => handleRemoveNew(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={confirmEdit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
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