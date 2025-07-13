'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert"

const SalonCategory = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const API_BASE = "https://adminfashioncadamy.traficoanalytica.com/api/v1/service";
  const IMAGE_BASE_URL = "https://adminfashioncadamy.traficoanalytica.com";

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If the image path already starts with http, return as is
    if (imagePath.startsWith("http")) return imagePath;
    // Otherwise, join with the base URL
    // Remove leading slash if present to avoid double slashes
    const path = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    return `${IMAGE_BASE_URL}/${path}`;
  };

  // GET: Fetch all categories
  const fetchCategories = async () => {
    console.log("📡 Fetching categories...");
    try {
      const res = await axios.get(`${API_BASE}/get-service`);
      console.log("✅ API Raw Response:", res.data);

      const categories = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      console.log("✅ Parsed Categories:", categories);

      setCategory(categories);
      setFilteredCategories(categories);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // POST: Add new category
  const handleAddCategory = async () => {
    console.log("📝 Adding new category...", { title, image });

    if (!title.trim()) {
      console.warn("⚠️ Category title is empty");
      return toast.error("Category name is required");
    }

    if (!image) {
      console.warn("⚠️ No image selected");
      return toast.error("Please upload an image");
    }

    const toastId = toast.loading("Adding Category...");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      console.log("📦 FormData contents:", {
        title,
        image,
      });

      await axios.post(`${API_BASE}/add-service`, formData);
      await fetchCategories();

      toast.success("Category added successfully", { id: toastId });
      setTitle("");
      setImage(null);
      setImagePreview(null);
      console.log("✅ Category added successfully");
    } catch (error) {
      console.error("❌ Error adding category:", error);
      toast.error("Failed to add category", { id: toastId });
    }
  };

  // Show delete confirmation dialog
  const handleDeleteConfirmation = (service) => {
    setServiceToDelete(service);
    setShowDeleteDialog(true);
  };

  // DELETE: Remove category by ID after confirmation
  const confirmDelete = () => {
    const id = serviceToDelete?._id;
    if (!id) return;

    const toastId = toast.loading("Deleting Service...");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/service/delete-service",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        id: id,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setTimeout(() => {
          toast.success("Service deleted successfully", { id: toastId });
          fetchCategories();
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong, please try again", { id: toastId });
      })
      .finally(() => {
        setShowDeleteDialog(false);
        setServiceToDelete(null);
      });
  };

  // SEARCH: Filter categories
  const handleSearch = (term, categories = category) => {
    console.log("🔍 Searching with term:", term);
    setSearchTerm(term);

    if (!term.trim()) {
      console.log("🔁 Resetting filtered categories");
      return setFilteredCategories(categories);
    }

    const filtered = categories.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
    console.log("🔎 Filtered Categories:", filtered);
    setFilteredCategories(filtered);
  };

  // Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("🖼️ Image selected:", file);
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      console.log("📸 Image Preview URL:", previewUrl);
      setImagePreview(previewUrl);
    }
  };

  // Initial Fetch
  useEffect(() => {
    console.log("🚀 Component mounted, fetching initial data...");
    fetchCategories();
  }, []);

  return (
    <>
      <div className="grid grid-cols-5 gap-10">
        {/* Left Column - List */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Salon Services</CardTitle>
              <CardDescription>View or delete existing Services</CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">#</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(filteredCategories) && filteredCategories.length > 0 ? (
                    filteredCategories.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {item.image ? (
                            <img
                              src={getFullImageUrl(item.image)}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="text-gray-400 italic">N/A</div>
                          )}
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => handleDeleteConfirmation(item)}
                            className="text-red-500 hover:bg-red-100 p-1 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                        {searchTerm ? "No results found." : "No services available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Form */}
        <div className="col-span-2 flex items-start gap-5">
          <Separator orientation="vertical" />
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      console.log("✍️ Category title input:", e.target.value);
                    }}
                    placeholder="e.g. Haircut, Massage..."
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2">
                    <Label>Preview</Label>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-md border mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddCategory}
              >
                Add Service
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the service "{serviceToDelete?.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SalonCategory;