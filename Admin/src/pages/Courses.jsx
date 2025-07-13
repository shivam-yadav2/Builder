import MyContext from "@/context/MyContext";
import { DataTable } from "@/myComponent/CourseTable/data-table";
import React, { useContext, useState } from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { Pencil, Trash2, Eye, Upload, Plus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";

// LightGallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Courses = () => {
  const { categoryCourse, courses, getCourses, updateCourse } = useContext(MyContext);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    seats: "",
    duration: "",
    description: "",
    images: [],
    features: [],
    content: [],
    isPublished: false,
  });
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleView = (id) => {
    const course = courses.find((course) => course._id === id);
    if (course) {
      setSelectedCourse(course);
      setViewDialogOpen(true);
    } else {
      toast.error("Course not found");
    }
  };

  const handleEdit = (id) => {
    const course = courses.find((course) => course._id === id);
    if (course) {
      setSelectedCourse(course);
      setFormData({
        title: course.title || "",
        category: course.category?._id || "",
        price: course.price || "",
        seats: course.seats || "",
        duration: course.duration || "",
        description: course.description || "",
        images: course.images || [],
        features: course.features || [],
        content: course.content || [],
        isPublished: course.isPublished || false,
      });
      setEditDialogOpen(true);
    } else {
      toast.error("Course not found");
    }
  };
  
  const handleDeleteClick = (id) => {
    setCourseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    
    await deleteCategory({ id: courseToDelete });
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const fetchCategories = async () => {
    // Implementation would go here
    // This function is referenced but not implemented in the original code
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrors((prev) => ({
        ...prev,
        newCategory: "Category name is required",
      }));
      return;
    }

    setCategoryLoading(true);
    try {
      const response = await axios.post(
        "https://adminfashioncadamy.traficoanalytica.com/api/v1/category/add-category",
        { name: newCategoryName },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Add if required
          },
        }
      );

      if (response.data && response.data.success) {
        // Refresh categories
        await fetchCategories();
        // Set the newly created category as selected
        if (response.data.category && response.data.category.id) {
          setFormData((prev) => ({
            ...prev,
            category: response.data.category.id,
          }));
        }
        // Reset new category form
        setNewCategoryName("");
        setShowAddCategory(false);
        setErrors((prev) => ({ ...prev, newCategory: null }));
      } else {
        setErrors((prev) => ({
          ...prev,
          newCategory: response.data?.message || "Failed to add category",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        newCategory: error.response?.data?.message || "Failed to add category",
      }));
      console.error("Error adding category:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      id: selectedCourse._id,
      ...formData,
      newImages,
      imagesToRemove,
    };
    updateCourse(updatedData);
    setEditDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
    
    // Create image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const handleArrayChange = (index, value, field) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeArrayItem = (index, field) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = formData.images[index];
    setImagesToRemove([...imagesToRemove, imageToRemove]);
    
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleRemoveNewImage = (index) => {
    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);
    
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const deleteCategory = async ({ id }) => {
    const toastId = toast.loading("Deleting Course...");

    const config = {
      method: "post",
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/course/delete-course",
      headers: {
        "Content-Type": "application/json",
      },
      data: { id },
    };

    try {
      const response = await axios.request(config);
      toast.success("Course deleted successfully", { id: toastId });
      await getCourses(); // Refresh after deletion
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const courseColumns = [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const image = row.original.images?.[0];
        const fullImageUrl = image
          ? `https://adminfashioncadamy.traficoanalytica.com/${image}`
          : null;

        return fullImageUrl ? (
          <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
            <a href={fullImageUrl}>
              <img
                src={fullImageUrl}
                alt="course"
                className="w-16 h-16 object-cover rounded cursor-pointer"
              />
            </a>
          </LightGallery>
        ) : (
          "—"
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category.title",
      header: "Category",
      cell: ({ row }) => row.original.category?.title || "—",
    },
    {
      accessorKey: "price",
      header: "Price (₹)",
    },
    {
      accessorKey: "seats",
      header: "Seats",
    },
    {
      accessorKey: "duration",
      header: "Duration (hrs)",
    },
    {
      accessorKey: "isPublished",
      header: "Published",
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const courseId = row.original._id;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleView(courseId)}
              className="text-blue-500 hover:text-blue-700"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleEdit(courseId)}
              className="text-green-500 hover:text-green-700"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(courseId)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={courseColumns} data={courses} />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>Full info about this course</DialogDescription>
          </DialogHeader>
          {selectedCourse ? (
            <div className="space-y-4">
              {/* Image preview */}
              {selectedCourse.images?.length > 0 && (
                <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCourse.images.map((img, index) => (
                      <a
                        key={index}
                        href={`https://adminfashioncadamy.traficoanalytica.com/${img}`}
                      >
                        <img
                          src={`https://adminfashioncadamy.traficoanalytica.com/${img}`}
                          alt={`Course ${index + 1}`}
                          className="w-full h-40 object-cover rounded"
                        />
                      </a>
                    ))}
                  </div>
                </LightGallery>
              )}

              <div className="space-y-1">
                <p><strong>Title:</strong> {selectedCourse.title}</p>
                <p><strong>Category:</strong> {selectedCourse.category?.title}</p>
                <p><strong>Price:</strong> ₹{selectedCourse.price}</p>
                <p><strong>Seats:</strong> {selectedCourse.seats}</p>
                <p><strong>Duration:</strong> {selectedCourse.duration} hrs</p>
                <p><strong>Published:</strong> {selectedCourse.isPublished ? "Yes" : "No"}</p>
                <p><strong>Description:</strong> {selectedCourse.description}</p>
                <p><strong>Features:</strong> {selectedCourse.features?.join(", ") || "—"}</p>
                <p><strong>Content:</strong> {selectedCourse.content?.join(", ") || "—"}</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              handleEdit(selectedCourse._id);
            }}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-5">
            {/* Title */}
            <div className="w-full col-span-2">
              <Label className="mb-2" htmlFor="title">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="w-full col-span-2">
              <Label className="mb-2" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
                className="min-h-24"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Seats */}
            <div className="w-full">
              <Label className="mb-2" htmlFor="seats">
                Seats
              </Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                value={formData.seats}
                onChange={handleChange}
                placeholder="Enter number of seats"
                min="1"
              />
              {errors.seats && (
                <p className="text-red-500 text-sm">{errors.seats}</p>
              )}
            </div>

            {/* Category */}
            <div className="w-full">
              <Label className="mb-2" htmlFor="category">
                Category
              </Label>
              <div className="space-y-2">
                <Select
                  name="category"
                  value={formData?.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryCourse?.map((cat) => {
                      // console.log(cat, "cat");
                      return (
                        <SelectItem key={cat?._id} value={cat?._id}>
                          {cat?.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            {/* Price */}
            <div className="w-full">
              <Label className="mb-2" htmlFor="price">
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter course price"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            {/* Features */}
            <div className="w-full">
              <Label className="mb-2">Features</Label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "features")
                    }
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem(index, "features")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("features")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
              {errors.features && (
                <p className="text-red-500 text-sm mt-1">{errors.features}</p>
              )}
            </div>

            {/* Duration */}
            <div className="w-full">
              <Label className="mb-2" htmlFor="duration">
                Duration (hours)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration in hours"
                min="1"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">{errors.duration}</p>
              )}
            </div>

            {/* Is Published */}
            <div className="w-full">
              <Label className="mb-2" htmlFor="isPublished">
                Publish Course
              </Label>
              <Select
                name="isPublished"
                value={formData.isPublished.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublished: value === "true",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Images */}
            <div className="w-full">
              <Label className="mb-2" htmlFor="images">
                Images
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />
              {imagePreviews.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
            </div>

            {/* Content */}
            <div className="w-full">
              <Label className="mb-2">Content</Label>
              {formData.content.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "content")
                    }
                    placeholder={`Content ${index + 1}`}
                  />
                  {formData.content.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem(index, "content")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("content")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Content
              </Button>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="col-span-2 mt-3 cursor-pointer">
              Add Course
            </Button>
            {errors.submit && (
              <p className="text-red-500 text-sm col-span-2 mt-1 text-center">
                {errors.submit}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel onClick={() => setCourseToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Courses;