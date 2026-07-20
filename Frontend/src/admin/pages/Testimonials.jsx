import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@admin/components/ui/card';
import { Button } from '@admin/components/ui/button';
import { Input } from '@admin/components/ui/input';
import { Label } from '@admin/components/ui/label';
import { Textarea } from '@admin/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@admin/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@admin/components/ui/dialog';

const API = import.meta.env.VITE_API_BASE_URL;

const FieldLabel = ({ children, required, hint }) => (
  <div className="mb-1">
    <Label className="text-sm font-medium text-gray-800">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </Label>
    {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
  </div>
);

const emptyForm = { name: '', role: 'Customer', rating: 5, text: '' };

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/testimonial/get-all`);
      setItems(res.data.data || []);
    } catch {
      toast.error('Failed to fetch testimonials');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setAvatar(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || '',
      role: item.role || 'Customer',
      rating: item.rating || 5,
      text: item.text || '',
    });
    setAvatar(null);
    setIsEditing(true);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) {
      toast.error('Name and testimonial text are required');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('role', formData.role);
    form.append('rating', formData.rating);
    form.append('text', formData.text);
    if (avatar) form.append('avatar', avatar);

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
        await axios.post(`${API}/api/v1/testimonial/update`, form, config);
        toast.success('Testimonial updated');
      } else {
        await axios.post(`${API}/api/v1/testimonial/add`, form, config);
        toast.success('Testimonial added');
      }
      resetForm();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteItem._id;
    setDeleteItem(null);
    await toast.promise(
      axios.post(
        `${API}/api/v1/testimonial/delete`,
        { id },
        { headers: { Authorization: `Bearer ${Cookies.get('accessTokenAdmin')}` } }
      ),
      {
        loading: 'Deleting...',
        success: () => {
          fetchItems();
          return 'Testimonial deleted';
        },
        error: 'Failed to delete',
      }
    );
  };

  const avatarUrl = (a, name) =>
    a
      ? /^https?:\/\//.test(a)
        ? a
        : `${API}/${a}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'C')}`;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
        <p className="text-sm text-gray-500">
          Real client reviews shown on the public homepage — strong trust signal.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEditing ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isEditing ? 'Edit Testimonial' : 'Add Testimonial'}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required hint="Client's full name">Name</FieldLabel>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Rahul Sharma" />
              </div>
              <div>
                <FieldLabel hint="Role or city (optional)">Role</FieldLabel>
                <Input name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Home Buyer, Pune" />
              </div>
              <div>
                <FieldLabel hint="1 to 5 stars">Rating</FieldLabel>
                <Input
                  type="number"
                  name="rating"
                  min={1}
                  max={5}
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
              <div>
                <FieldLabel hint="Optional client photo">Avatar</FieldLabel>
                <Input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
              </div>
              <div className="md:col-span-2">
                <FieldLabel required hint="The review in the client's words">Testimonial</FieldLabel>
                <Textarea
                  name="text"
                  rows={4}
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Write the client's feedback..."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : isEditing ? (
                  'Update Testimonial'
                ) : (
                  'Add Testimonial'
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

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">All Testimonials ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">No testimonials yet. Add your first client review above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item._id}>
                <CardContent className="space-y-3 pt-6">
                  <p className="text-sm italic text-gray-700">"{item.text}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatarUrl(item.avatar, item.name)} alt={item.name} />
                      <AvatarFallback>{item.name?.[0] || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.role}</p>
                      <div className="flex">
                        {[...Array(item.rating || 0)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
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

      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Delete the testimonial from "{deleteItem?.name}"? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Testimonials;
