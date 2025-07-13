import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const UpdateModal = ({ open, onClose, onSubmit, initialData, propertyType }) => {
  const [form, setForm] = useState({})

  useEffect(() => {
    setForm(initialData || {})
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked })
    } else if (type === 'file') {
      setForm({ ...form, images: Array.from(files) })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Update {propertyType === 'home' ? 'Home' : 'Land'} Listing</h2>

          {/* Shared Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Title</Label><Input name="title" value={form.title || ''} onChange={handleChange} required /></div>
            <div><Label>Location</Label><Input name="location" value={form.location || ''} onChange={handleChange} required /></div>
            <div className="sm:col-span-2"><Label>Description</Label><Textarea name="description" value={form.description || ''} onChange={handleChange} /></div>
            <div><Label>Full Address</Label><Input name="fullAddress" value={form.fullAddress || ''} onChange={handleChange} required /></div>
            <div><Label>Pincode</Label><Input name="pincode" value={form.pincode || ''} onChange={handleChange} required /></div>
            <div><Label>State</Label><Input name="state" value={form.state || ''} onChange={handleChange} required /></div>
            <div><Label>City</Label><Input name="city" value={form.city || ''} onChange={handleChange} required /></div>
            <div><Label>Locality</Label><Input name="locality" value={form.locality || ''} onChange={handleChange} required /></div>
            <div><Label>Landmark</Label><Input name="landmark" value={form.landmark || ''} onChange={handleChange} /></div>
            <div><Label>Land Area</Label><Input name="landArea" value={form.landArea || ''} onChange={handleChange} required /></div>
            <div><Label>Unit Price</Label><Input name="unitPrice" value={form.unitPrice || ''} onChange={handleChange} required /></div>
            {propertyType === 'home' && (
              <div><Label>Total Price</Label><Input name="totalPrice" value={form.totalPrice || ''} onChange={handleChange} required /></div>
            )}
            <div><Label>Status</Label>
              <select name="status" value={form.status || 'Available'} onChange={handleChange} className="w-full border rounded h-10 px-2">
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div><Label>Property Type</Label>
              <select name="propertyType" value={form.propertyType || 'sale'} onChange={handleChange} className="w-full border rounded h-10 px-2">
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
                {propertyType === 'land' && <option value="both">Both</option>}
              </select>
            </div>
            {propertyType === 'land' && (
              <div><Label>Creator Type</Label><Input name="creatorType" value={form.creatorType || ''} onChange={handleChange} /></div>
            )}
          </div>

          {/* Home-Only Fields */}
          {propertyType === 'home' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div><Label>Rooms</Label><Input type="number" name="rooms" value={form.rooms || ''} onChange={handleChange} /></div>
              <div><Label>Bedrooms</Label><Input type="number" name="bedrooms" value={form.bedrooms || ''} onChange={handleChange} /></div>
              <div><Label>Kitchen</Label><Input type="number" name="kitchen" value={form.kitchen || ''} onChange={handleChange} /></div>
              <div><Label>Bathrooms</Label><Input type="number" name="bathrooms" value={form.bathrooms || ''} onChange={handleChange} /></div>
              <div><Label>Floor</Label><Input type="number" name="floor" value={form.floor || ''} onChange={handleChange} /></div>
              <div><Label>Area (Built-up)</Label><Input type="number" name="area" value={form.area || ''} onChange={handleChange} /></div>
              <div><Label>Build Year</Label><Input type="number" name="buildYear" value={form.buildYear || ''} onChange={handleChange} /></div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" name="park" checked={form.park || false} onChange={handleChange} />
                <Label>Parking Available</Label>
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <Label>Images</Label>
            <Input type="file" name="images" multiple onChange={handleChange} />
            {form.images && form.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.images.map((img, idx) => (
                  <div key={idx} className="w-24 h-20 rounded overflow-hidden">
                    <img
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Update Listing
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateModal
