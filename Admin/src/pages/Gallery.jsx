import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Helper function to check if a URL is a video
const isVideo = (url) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

const GalleryManagement = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    sold_price: '',
    sold_date: '',
    tags: '',
    images: [], // This will hold File objects for uploads
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check admin authentication
  useEffect(() => {
    const token = Cookies.get("accessTokenAdmin");
    if (token) {
      setIsAdmin(true);
      fetchGalleryItems();
    }
  }, []);

  // Fetch all gallery items
  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/gallery/get-all');
      setGalleryItems(response.data.data);
    } catch (err) {
      setError('Failed to fetch gallery items');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input (images and videos)
  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  // Create or Update gallery item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('location', formData.location);
    form.append('sold_price', formData.sold_price);
    form.append('sold_date', formData.sold_date);
    form.append('tags', formData.tags);
    formData.images.forEach((file) => form.append('images', file));

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEditing) {
        form.append('id', selectedItem._id);
        const response = await axios.post('http://localhost:4000/api/v1/gallery/update', form, config);
        setSuccess('Gallery item updated successfully');
      } else {
        const response = await axios.post('http://localhost:4000/api/v1/gallery/add', form, config);
        setSuccess('Gallery item created successfully');
      }

      setFormData({ name: '', location: '', sold_price: '', sold_date: '', tags: '', images: [] });
      setIsEditing(false);
      setSelectedItem(null);
      fetchGalleryItems();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Get gallery item details
  const handleViewItem = async (id) => {
    try {
      const response = await axios.post('http://localhost:4000/api/v1/gallery/get-by-id', { id });
      setSelectedItem(response.data.data);
    } catch (err) {
      setError('Failed to fetch gallery item details');
    }
  };

  // Delete gallery item
  const handleDelete = async (id) => {
    try {
      await axios.post(
        'http://localhost:4000/api/v1/gallery/delete',
        { id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}` },
        }
      );
      setSuccess('Gallery item deleted successfully');
      fetchGalleryItems();
    } catch (err) {
      setError('Failed to delete gallery item');
    }
  };

  // Edit gallery item
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      location: item.location,
      sold_price: item.sold_price,
      sold_date: item.sold_date.toISOString().split('T')[0],
      tags: item.tags ? item.tags.join(', ') : '',
      images: [], // Reset file input for editing
    });
    setSelectedItem(item);
    setIsEditing(true);
  };

  // Render media (image or video)
  const renderMedia = (url, alt, index) => {
    if (isVideo(url)) {
      return (
        <video
          key={index}
          src={`http://localhost:4000/${url}`}
          alt={alt}
          className="w-full h-40 object-cover rounded mb-2"
          controls
        />
      );
    }
    return (
      <img
        key={index}
        src={`http://localhost:4000/${url}`}
        alt={alt}
        className="w-full h-40 object-cover rounded mb-2"
      />
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gallery Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {isAdmin && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="sold_price"
              value={formData.sold_price}
              onChange={handleInputChange}
              placeholder="Sold Price"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              name="sold_date"
              value={formData.sold_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Tags (comma separated)"
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              multiple
              accept="image/*,video/*" // Allow both image and video files
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              required={!isEditing}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? 'Update Gallery Item' : 'Add Gallery Item'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p>Location: {item.location}</p>
            <p>Sold Price: {item.sold_price}</p>
            <p>Sold Date: {new Date(item.sold_date).toLocaleDateString()}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Tags: </span>
                <span className="text-sm">{item.tags.join(', ')}</span>
              </div>
            )}
            <div className="mt-2">
              {item.images.map((media, index) => renderMedia(media, item.name, index))}
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleViewItem(item._id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                View
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">{selectedItem.name}</h2>
            <p>Location: {selectedItem.location}</p>
            <p>Sold Price: {selectedItem.sold_price}</p>
            <p>Sold Date: {new Date(selectedItem.sold_date).toLocaleDateString()}</p>
            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <p>Tags: {selectedItem.tags.join(', ')}</p>
            )}
            <div className="mt-2">
              {selectedItem.images.map((media, index) => (
                renderMedia(media, selectedItem.name, index)
              ))}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;