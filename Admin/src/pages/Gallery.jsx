"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Upload,
  Plus,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const GalleryPanel = () => {
  const [images, setImages] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [multipleImages, setMultipleImages] = useState([]);
  const [imageTitle, setImageTitle] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Maximum allowed images
  const MAX_IMAGES = 3;

  // API base endpoint
  const API_URL =
    "https://adminfashioncadamy.traficoanalytica.com/api/v1/gallery";
  const BASE_URL = "https://adminfashioncadamy.traficoanalytica.com";

  // Fetch images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-gallery`);
      const fetchedImages = res.data.data || [];
      setImages(fetchedImages);
      console.log("Fetched images:", res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
      setImages([]);
    }
  };

  const handleAddMultipleImages = async () => {
    if (multipleImages.length > MAX_IMAGES) {
      toast.error(`You can only upload a maximum of ${MAX_IMAGES} images`);
      return;
    }

    try {
      const formData = new FormData();
      multipleImages.forEach((file) => {
        formData.append("images", file);
      });

      console.log( "Multiple ",multipleImages)
      console.log( formData , "FormData")
      

      const response = await axios.post(
        "http://localhost:4000/api/v1/gallery/add-gallery",
        {image:multipleImages}
      );

      console.log( formData , "FormData")


      console.log("API response:", response.data);
      const newImagesFromServer = response.data.data || [];
      setImages((prevImages) => [...prevImages, ...newImagesFromServer]);
      toast.success("Images uploaded successfully");
      setMultipleImages([]);
      setImageTitle("");
      setImagePreviews([]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding images:", error);
      toast.error("Failed to add images");
      
    }
    
  };

  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setImages(images.filter((img) => img.id !== id));
      toast.success("Image deleted");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files).slice(0, MAX_IMAGES);
    setMultipleImages(filesArray);
    const previews = filesArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setMultipleImages([]);
    setImagePreviews([]);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Updated getImageUrl with type checking
  const getImageUrl = (imagePath) => {
    // Handle null, undefined, or non-string cases
    if (!imagePath || typeof imagePath !== "string") {
      // If imagePath is an array, use the first element if it exists
      if (
        Array.isArray(imagePath) &&
        imagePath.length > 0 &&
        typeof imagePath[0] === "string"
      ) {
        return getImageUrl(imagePath[0]); // Recursively handle the first string
      }
      console.warn("Invalid image path:", imagePath);
      return "/fallback-image.jpg"; // Fallback image path
    }

    if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) {
      return imagePath;
    }
    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;
    return `${BASE_URL}${normalizedPath}`;
  };

  const safeImages = Array.isArray(images) ? images : [];
  const totalPages = Math.max(1, Math.ceil(safeImages.length / itemsPerPage));

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginatedImages = safeImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Card className="shadow-md">
        <CardHeader className="bg-white border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-medium">
                Image Gallery
              </CardTitle>
              <CardDescription>
                Manage your gallery images (Maximum 3 images allowed)
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Images
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader className="space-y-1 pb-2">
                  <DialogTitle>Add Images</DialogTitle>
                  <DialogDescription className="text-xs">
                    Upload up to 3 images to your gallery
                  </DialogDescription>
                </DialogHeader>

                <div className="py-2 flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Maximum {MAX_IMAGES} images allowed</span>
                </div>

                <div className="space-y-3 py-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="title" className="min-w-20 text-sm">
                      Common Title:
                    </Label>
                    <input
                      id="title"
                      className="flex-1 border p-1 rounded text-sm"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      placeholder="Leave blank to use filenames"
                    />
                  </div>

                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center py-2">
                        <Upload className="h-6 w-6 text-gray-500" />
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Upload</span> (Max{" "}
                          {MAX_IMAGES} PNG, JPG or GIF)
                        </p>
                      </div>
                      <input
                        id="images"
                        type="file"
                        ref={fileInputRef}
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/gif"
                      />
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs font-medium mb-1">Preview:</p>
                      <div className="border rounded-lg p-2 bg-gray-50">
                        <div className="grid grid-cols-3 gap-2">
                          {imagePreviews.map((preview, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${i + 1}`}
                                className="h-16 w-full object-cover rounded-md border"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newPreviews = [...imagePreviews];
                                    const newImages = [...multipleImages];
                                    newPreviews.splice(i, 1);
                                    newImages.splice(i, 1);
                                    setImagePreviews(newPreviews);
                                    setMultipleImages(newImages);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 text-xs text-gray-600">
                          {multipleImages.map((file, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center text-xs"
                            >
                              <span className="truncate max-w-40">
                                {file.name}
                              </span>
                              <span>
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                            </div>
                          ))}
                        </div>

                        {multipleImages.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-7 text-xs w-full"
                            onClick={clearFileInput}
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      clearFileInput();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddMultipleImages}
                    disabled={multipleImages.length === 0}
                  >
                    Upload {Math.min(multipleImages.length, MAX_IMAGES)}{" "}
                    {multipleImages.length === 1 ? "Image" : "Images"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {paginatedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ImageIcon className="h-16 w-16 text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg">No images in gallery</p>
              <p className="text-gray-400 text-sm mt-1">
                Add images to display them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {paginatedImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-12 w-full">
                    <img
                      src={getImageUrl(image.image)}
                      // alt={image.title || "Gallery image"}
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between py-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {paginatedImages.length} of {safeImages.length} images
          </div>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GalleryPanel;
