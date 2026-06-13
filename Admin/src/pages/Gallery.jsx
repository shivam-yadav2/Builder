import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Info,
  Loader2,
  ImagePlus,
  MapPin,
  Calendar,
  IndianRupee,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const API = import.meta.env.VITE_API_BASE_URL;

// Helper to detect videos so we render <video> instead of <img>.
const isVideo = (url) => ['.mp4', '.webm', '.ogg'].some((ext) => url?.toLowerCase().endsWith(ext));

// Label with optional required (*) marker and a grey hint line.
const FieldLabel = ({ children, required, hint }) => (
  <div className="mb-1">
    <Label className="text-sm font-medium text-gray-800">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </Label>
    {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
  </div>
);

const emptyForm = {
  name: '',
  location: '',
  sold_price: '',
  sold_date: '',
  tags: '',
};

const GalleryManagement = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]); // paths kept on edit
  const [newImages, setNewImages] = useState([]); // File objects
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get(`${API}/api/v1/gallery/get-all`);
      setGalleryItems(response.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch gallery items');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = '';
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setExistingImages([]);
    setNewImages([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || '',
      location: item.location || '',
      sold_price: item.sold_price || '',
      sold_date: item.sold_date ? new Date(item.sold_date).toISOString().split('T')[0] : '',
      tags: item.tags ? item.tags.join(', ') : '',
    });
    setExistingImages(item.images || []);
    setNewImages([]);
    setIsEditing(true);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length + newImages.length === 0) {
      toast.error('Please add at least one image or video');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('location', formData.location);
    form.append('sold_price', formData.sold_price);
    form.append('sold_date', formData.sold_date);
    form.append('tags', formData.tags);
    newImages.forEach((file) => form.append('images', file));

    const config = {
      headers: {
        Authorization: `Bearer ${Cookies.get('accessTokenAdmin')}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        form.append('id', editingId);
        form.append('keepImages', JSON.stringify(existingImages));
        await axios.post(`${API}/api/v1/gallery/update`, form, config);
        toast.success('Gallery item updated successfully');
      } else {
        await axios.post(`${API}/api/v1/gallery/add`, form, config);
        toast.success('Gallery item created successfully');
      }
      resetForm();
      fetchGalleryItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteItem._id;
    setDeleteItem(null);
    await toast.promise(
      axios.post(
        `${API}/api/v1/gallery/delete`,
        { id },
        { headers: { Authorization: `Bearer ${Cookies.get('accessTokenAdmin')}` } }
      ),
      {
        loading: 'Deleting...',
        success: () => {
          fetchGalleryItems();
          return 'Gallery item deleted';
        },
        error: 'Failed to delete gallery item',
      }
    );
  };

  const renderMedia = (url, alt, key, className) => {
    const src = `${API}/${url}`;
    return isVideo(url) ? (
      <video key={key} src={src} className={className} controls />
    ) : (
      <img key={key} src={src} alt={alt} className={className} />
    );
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
        <p className="text-sm text-gray-500">
          Showcase your sold &amp; completed deals — this builds trust with new buyers.
        </p>
      </div>

      {/* ---- Add / Edit form ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="h-5 w-5" /> Edit Gallery Item
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" /> Add New Gallery Item
              </>
            )}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required hint="Project or property name">
                  Name
                </FieldLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Green Valley Villa"
                />
              </div>
              <div>
                <FieldLabel required hint="City / area where it was sold">
                  Location
                </FieldLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Pune, Maharashtra"
                />
              </div>
              <div>
                <FieldLabel required hint="Final deal price">
                  Sold Price
                </FieldLabel>
                <Input
                  name="sold_price"
                  value={formData.sold_price}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹85,00,000"
                />
              </div>
              <div>
                <FieldLabel required hint="When the deal closed">
                  Sold Date
                </FieldLabel>
                <Input
                  type="date"
                  name="sold_date"
                  value={formData.sold_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel hint="Comma separated, e.g. Villa, 3BHK, Gated (optional)">
                  Tags
                </FieldLabel>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Villa, 3BHK, Gated Community"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              {isEditing && (
                <div className="mb-3 flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Existing media is kept. Remove what you don't want and add new
                    files — they're merged together.
                  </span>
                </div>
              )}
              <FieldLabel required={!isEditing} hint="Images or videos. The first one is the cover.">
                Media
              </FieldLabel>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-50">
                <ImagePlus className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-600">Click to add images / videos</span>
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {totalImages > 0 && (
                <>
                  <p className="mt-2 text-sm text-gray-500">{totalImages} file(s) selected</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative">
                        {renderMedia(url, 'media', `existing-${index}`, 'h-24 w-24 rounded object-cover')}
                        <span className="absolute bottom-0 left-0 rounded-tr bg-black/60 px-1 text-[10px] text-white">
                          Saved
                        </span>
                        <button
                          type="button"
                          onClick={() => setExistingImages((p) => p.filter((_, i) => i !== index))}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {newImages.map((file, index) => (
                      <div key={`new-${index}`} className="relative">
                        {file.type?.startsWith('video') ? (
                          <video src={URL.createObjectURL(file)} className="h-24 w-24 rounded object-cover" />
                        ) : (
                          <img src={URL.createObjectURL(file)} alt="new" className="h-24 w-24 rounded object-cover" />
                        )}
                        <span className="absolute bottom-0 left-0 rounded-tr bg-green-600/80 px-1 text-[10px] text-white">
                          New
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewImages((p) => p.filter((_, i) => i !== index))}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : isEditing ? (
                  'Update Gallery Item'
                ) : (
                  'Add Gallery Item'
                )}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ---- Gallery grid ---- */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          All Items ({galleryItems.length})
        </h2>
        {galleryItems.length === 0 ? (
          <p className="text-gray-500">No gallery items yet. Add your first sold deal above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                {item.images?.[0] &&
                  renderMedia(item.images[0], item.name, item._id, 'h-44 w-full object-cover')}
                <CardContent className="space-y-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <Badge className="bg-green-100 text-green-700">Sold</Badge>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5" /> {item.location}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <IndianRupee className="h-3.5 w-3.5" /> {item.sold_price}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3.5 w-3.5" />{' '}
                    {new Date(item.sold_date).toLocaleDateString()}
                  </p>
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => setViewItem(item)}>
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteItem(item)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ---- View dialog ---- */}
      <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewItem?.name}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Location: {viewItem.location}</p>
              <p className="text-sm text-gray-600">Sold Price: {viewItem.sold_price}</p>
              <p className="text-sm text-gray-600">
                Sold Date: {new Date(viewItem.sold_date).toLocaleDateString()}
              </p>
              {viewItem.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {viewItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {viewItem.images?.map((media, index) =>
                  renderMedia(media, viewItem.name, index, 'h-32 w-full rounded object-cover')
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Delete confirmation ---- */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Delete "{deleteItem?.name}" from the gallery? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>
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

export default GalleryManagement;
