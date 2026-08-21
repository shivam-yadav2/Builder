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
  Film,
  Building2,
  BadgeCheck,
  Ruler,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@admin/components/ui/card';
import { Button } from '@admin/components/ui/button';
import { Input } from '@admin/components/ui/input';
import { Label } from '@admin/components/ui/label';
import { Textarea } from '@admin/components/ui/textarea';
import { Badge } from '@admin/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@admin/components/ui/dialog';

const API = import.meta.env.VITE_API_BASE_URL;

const isVideo = (url) => ['.mp4', '.webm', '.ogg'].some((ext) => url?.toLowerCase().endsWith(ext));

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
  description: '',
  tags: '',
  // sold
  sold_price: '',
  sold_date: '',
  // construction
  project_type: '',
  area: '',
  completed_date: '',
};

const TABS = [
  { key: 'sold', label: 'Sold Properties', icon: BadgeCheck },
  { key: 'construction', label: 'Constructed Projects', icon: Building2 },
];

const GalleryManagement = () => {
  const [category, setCategory] = useState('sold');
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const isConstruction = category === 'construction';

  // Managed object URLs for new selections — created once, revoked on cleanup.
  useEffect(() => {
    const urls = newImages.map((file) => ({
      url: URL.createObjectURL(file),
      isVideo: (file.type || '').startsWith('video'),
    }));
    setPreviews(urls);
    return () => urls.forEach((p) => URL.revokeObjectURL(p.url));
  }, [newImages]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/gallery/get-all`);
      setItems(res.data.data || []);
    } catch {
      toast.error('Failed to fetch items');
    }
  };

  // Legacy items (no category) are treated as "sold".
  const visibleItems = items.filter((it) =>
    isConstruction ? it.category === 'construction' : it.category !== 'construction'
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setNewImages((prev) => [...prev, ...Array.from(files)]);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setExistingImages([]);
    setNewImages([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const switchTab = (key) => {
    setCategory(key);
    resetForm();
  };

  const handleEdit = (item) => {
    setCategory(item.category === 'construction' ? 'construction' : 'sold');
    setFormData({
      name: item.name || '',
      location: item.location || '',
      description: item.description || '',
      tags: item.tags ? item.tags.join(', ') : '',
      sold_price: item.sold_price || '',
      sold_date: item.sold_date ? new Date(item.sold_date).toISOString().split('T')[0] : '',
      project_type: item.project_type || '',
      area: item.area || '',
      completed_date: item.completed_date
        ? new Date(item.completed_date).toISOString().split('T')[0]
        : '',
    });
    setExistingImages(item.images || []);
    setNewImages([]);
    setIsEditing(true);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.location.trim()) {
      toast.error('Name and location are required');
      return;
    }
    if (!isConstruction && (!formData.sold_price.trim() || !formData.sold_date.trim())) {
      toast.error('Sold price and sold date are required');
      return;
    }
    if (existingImages.length + newImages.length === 0) {
      toast.error('Please add at least one image or video');
      return;
    }

    const form = new FormData();
    form.append('category', category);
    form.append('name', formData.name);
    form.append('location', formData.location);
    form.append('description', formData.description);
    form.append('tags', formData.tags);
    if (isConstruction) {
      form.append('project_type', formData.project_type);
      form.append('area', formData.area);
      form.append('completed_date', formData.completed_date);
    } else {
      form.append('sold_price', formData.sold_price);
      form.append('sold_date', formData.sold_date);
    }
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
        toast.success('Item updated successfully');
      } else {
        await axios.post(`${API}/api/v1/gallery/add`, form, config);
        toast.success('Item added successfully');
      }
      resetForm();
      fetchItems();
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
          fetchItems();
          return 'Item deleted';
        },
        error: 'Failed to delete',
      }
    );
  };

  const renderMedia = (url, alt, key, className) => {
    const src = `${API}/${url}`;
    return isVideo(url) ? (
      <video key={key} src={src} className={className} muted />
    ) : (
      <img key={key} src={src} alt={alt} className={className} />
    );
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Showcase</h1>
        <p className="text-sm text-gray-500">
          Manage your public portfolio — sold properties and completed construction projects.
        </p>
      </div>

      {/* Category tabs */}
      <div className="inline-flex rounded-xl border bg-gray-50 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = category === tab.key;
          const count = items.filter((it) =>
            tab.key === 'construction'
              ? it.category === 'construction'
              : it.category !== 'construction'
          ).length;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => switchTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                active ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`rounded-full px-1.5 text-xs ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add / Edit form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEditing ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isEditing ? 'Edit' : 'Add'} {isConstruction ? 'Construction Project' : 'Sold Property'}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required hint={isConstruction ? 'Project name' : 'Property name'}>
                  Name
                </FieldLabel>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Green Valley Villa" />
              </div>
              <div>
                <FieldLabel required hint="City / area">
                  Location
                </FieldLabel>
                <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Pune, Maharashtra" />
              </div>

              {/* Category-specific fields */}
              {isConstruction ? (
                <>
                  <div>
                    <FieldLabel hint="e.g. Residential, Commercial, Villa">Project Type</FieldLabel>
                    <Input name="project_type" value={formData.project_type} onChange={handleInputChange} placeholder="e.g., Residential" />
                  </div>
                  <div>
                    <FieldLabel hint="Built-up area">Area</FieldLabel>
                    <Input name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g., 2400 sq.ft" />
                  </div>
                  <div>
                    <FieldLabel hint="When the project was completed">Completed Date</FieldLabel>
                    <Input type="date" name="completed_date" value={formData.completed_date} onChange={handleInputChange} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <FieldLabel required hint="Final deal price">Sold Price</FieldLabel>
                    <Input name="sold_price" value={formData.sold_price} onChange={handleInputChange} placeholder="e.g., ₹85,00,000" />
                  </div>
                  <div>
                    <FieldLabel required hint="When the deal closed">Sold Date</FieldLabel>
                    <Input type="date" name="sold_date" value={formData.sold_date} onChange={handleInputChange} />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <FieldLabel hint="Short description shown on the public page (optional)">Description</FieldLabel>
                <Textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} placeholder="Highlight the key details..." />
              </div>
              <div className="md:col-span-2">
                <FieldLabel hint="Comma separated, e.g. Villa, 3BHK, Gated (optional)">Tags</FieldLabel>
                <Input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Villa, 3BHK, Gated Community" />
              </div>
            </div>

            {/* Media */}
            <div>
              {isEditing && (
                <div className="mb-3 flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Existing media is kept. Remove what you don't want and add new files — they're merged.</span>
                </div>
              )}
              <FieldLabel required={!isEditing} hint="Up to 15 images or videos. The first one is the cover.">
                Media
              </FieldLabel>
              {/* Native file input — styled only with a border/padding on the
                  element itself (no wrapper / no accept filter, which broke
                  selection on mobile). */}
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-700"
              />

              {totalImages > 0 && (
                <>
                  <p className="mt-2 text-sm text-gray-500">{totalImages} file(s) selected</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative">
                        {renderMedia(url, 'media', `existing-${index}`, 'h-24 w-24 rounded object-cover')}
                        <span className="absolute bottom-0 left-0 rounded-tr bg-black/60 px-1 text-[10px] text-white">Saved</span>
                        <button
                          type="button"
                          onClick={() => setExistingImages((p) => p.filter((_, i) => i !== index))}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {newImages.map((file, index) => {
                      const preview = previews[index];
                      return (
                        <div key={`new-${index}`} className="relative">
                          {preview?.isVideo ? (
                            <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded bg-gray-800 text-white">
                              <Film className="h-6 w-6" />
                              <span className="max-w-full truncate px-1 text-[9px]">{file.name || 'Video'}</span>
                            </div>
                          ) : (
                            <img src={preview?.url} alt="new" className="h-24 w-24 rounded object-cover" />
                          )}
                          <span className="absolute bottom-0 left-0 rounded-tr bg-green-600/80 px-1 text-[10px] text-white">New</span>
                          <button
                            type="button"
                            onClick={() => setNewImages((p) => p.filter((_, i) => i !== index))}
                            className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
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
                  'Update'
                ) : (
                  'Add'
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

      {/* List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {isConstruction ? 'Constructed Projects' : 'Sold Properties'} ({visibleItems.length})
        </h2>
        {visibleItems.length === 0 ? (
          <p className="text-gray-500">Nothing here yet. Add your first {isConstruction ? 'project' : 'sold property'} above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <Card key={item._id} className="overflow-hidden pt-0">
                {item.images?.[0] &&
                  renderMedia(item.images[0], item.name, item._id, 'h-44 w-full object-cover')}
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <Badge className={isConstruction ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}>
                      {isConstruction ? 'Built' : 'Sold'}
                    </Badge>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5" /> {item.location}
                  </p>
                  {isConstruction ? (
                    <>
                      {item.project_type && (
                        <p className="flex items-center gap-1 text-sm text-gray-600">
                          <Building2 className="h-3.5 w-3.5" /> {item.project_type}
                        </p>
                      )}
                      {item.area && (
                        <p className="flex items-center gap-1 text-sm text-gray-600">
                          <Ruler className="h-3.5 w-3.5" /> {item.area}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="flex items-center gap-1 text-sm text-gray-600">
                        <IndianRupee className="h-3.5 w-3.5" /> {item.sold_price}
                      </p>
                      {item.sold_date && (
                        <p className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5" /> {new Date(item.sold_date).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
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

      {/* View dialog */}
      <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewItem?.name}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Location: {viewItem.location}</p>
              {viewItem.category === 'construction' ? (
                <>
                  {viewItem.project_type && <p className="text-sm text-gray-600">Type: {viewItem.project_type}</p>}
                  {viewItem.area && <p className="text-sm text-gray-600">Area: {viewItem.area}</p>}
                  {viewItem.completed_date && (
                    <p className="text-sm text-gray-600">Completed: {new Date(viewItem.completed_date).toLocaleDateString()}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">Sold Price: {viewItem.sold_price}</p>
                  {viewItem.sold_date && (
                    <p className="text-sm text-gray-600">Sold Date: {new Date(viewItem.sold_date).toLocaleDateString()}</p>
                  )}
                </>
              )}
              {viewItem.description && <p className="text-sm text-gray-700">{viewItem.description}</p>}
              {viewItem.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {viewItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
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

      {/* Delete confirmation */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Delete "{deleteItem?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagement;
