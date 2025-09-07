import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Helper function to check if a URL is a video
const isVideo = (url) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    soldDate: '',
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
      fetchProperties();
    }
  }, []);

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/gallery/get-gallery');
      setProperties(response.data.data);
    } catch (err) {
      setError('Failed to fetch properties');
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

  // Create or Update property
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('location', formData.location);
    form.append('price', formData.price);
    form.append('soldDate', formData.soldDate);
    formData.images.forEach((file) => form.append('images', file));

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEditing) {
        form.append('id', selectedProperty._id);
        const response = await axios.post('http://localhost:4000/api/v1/gallery/update-gallery', form, config);
        setSuccess('Property updated successfully');
      } else {
        const response = await axios.post('http://localhost:4000/api/v1/gallery/add-gallery', form, config);
        setSuccess('Property created successfully');
      }

      setFormData({ title: '', location: '', price: '', soldDate: '', images: [] });
      setIsEditing(false);
      setSelectedProperty(null);
      fetchProperties();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Get property details
  const handleViewProperty = async (id) => {
    try {
      const response = await axios.post('http://localhost:4000/api/v1/gallery/gallery-detail', { id });
      setSelectedProperty(response.data.data);
    } catch (err) {
      setError('Failed to fetch property details');
    }
  };

  // Delete property
  const handleDelete = async (id) => {
    try {
      await axios.post(
        'http://localhost:4000/api/v1/gallery/delete-gallery',
        { id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}` },
        }
      );
      setSuccess('Property deleted successfully');
      fetchProperties();
    } catch (err) {
      setError('Failed to delete property');
    }
  };

  // Edit property
  const handleEdit = (property) => {
    setFormData({
      title: property.title,
      location: property.location,
      price: property.price,
      soldDate: property.soldDate.toISOString().split('T')[0],
      images: [], // Reset file input for editing
    });
    setSelectedProperty(property);
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
      <h1 className="text-3xl font-bold mb-6">Property Management</h1>

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
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Property' : 'Add New Property'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              name="soldDate"
              value={formData.soldDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              multiple
              accept="image/*,video/*" // Allow both image and video files
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? 'Update Property' : 'Add Property'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold">{property.title}</h3>
            <p>Location: {property.location}</p>
            <p>Price: {property.price}</p>
            <p>Sold Date: {new Date(property.soldDate).toLocaleDateString()}</p>
            <div className="mt-2">
              {property.images.map((media, index) => renderMedia(media, property.title, index))}
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleViewProperty(property._id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                View
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
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

      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">{selectedProperty.title}</h2>
            <p>Location: {selectedProperty.location}</p>
            <p>Price: {selectedProperty.price}</p>
            <p>Sold Date: {new Date(selectedProperty.soldDate).toLocaleDateString()}</p>
            <p>Creator: {selectedProperty.creator?.email}</p>
            <div className="mt-2">
              {selectedProperty.images.map((media, index) => (
                renderMedia(media, selectedProperty.title, index)
              ))}
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
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

export default PropertyManagement;