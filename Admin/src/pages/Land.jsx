import React, { useState } from 'react'
import Layout from '../layout/Layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const AddLand = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    fullAddress: '',
    pincode: '',
    state: '',
    city: '',
    locality: '',
    landmark: '',
    landArea: '',
    unitPrice: '',
    status: 'Available',
    propertyType: 'sale',
    creatorType: 'Admin',
    images: []
  })

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
    console.log(form)
    // TODO: Post to backend API
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Land</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <Label>Location</Label>
                <Input name="location" value={form.location} onChange={handleChange} required />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Textarea name="description" value={form.description} onChange={handleChange} />
              </div>
            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Address</Label>
                <Input name="fullAddress" value={form.fullAddress} onChange={handleChange} required />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input name="pincode" value={form.pincode} onChange={handleChange} required />
              </div>
              <div>
                <Label>State</Label>
                <Input name="state" value={form.state} onChange={handleChange} required />
              </div>
              <div>
                <Label>City</Label>
                <Input name="city" value={form.city} onChange={handleChange} required />
              </div>
              <div>
                <Label>Locality</Label>
                <Input name="locality" value={form.locality} onChange={handleChange} required />
              </div>
              <div>
                <Label>Landmark</Label>
                <Input name="landmark" value={form.landmark} onChange={handleChange} />
              </div>
            </div>

            {/* Land Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Land Area (sqft)</Label>
                <Input name="landArea" value={form.landArea} onChange={handleChange} required />
              </div>
              <div>
                <Label>Unit Price</Label>
                <Input name="unitPrice" value={form.unitPrice} onChange={handleChange} required />
              </div>
              <div>
                <Label>Status</Label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded h-10 px-2">
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <Label>Property Type</Label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full border rounded h-10 px-2">
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label>Images</Label>
              <Input type="file" name="images" multiple onChange={handleChange} />
              {form.images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="w-24 h-20 rounded overflow-hidden">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button type="submit" className=" cursor-pointer">
                Submit Land Listing
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </Layout>
  )
}

export default AddLand
