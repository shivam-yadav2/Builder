import { useState, useEffect } from "react";
import axios from "axios";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// // API URL (Replace with your actual API endpoint)
// const API_URL = "https://adminfashioncadamy.traficoanalytica.com/api/v1/course/get-course";
// const Update_URL = "https://adminfashioncadamy.traficoanalytica.com/api/v1/course/update-course";
// const DELETE_URL = "https://adminfashioncadamy.traficoanalytica.com/api/v1/course/delete-course";

// Fetch products from API
export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return fetched data
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Update product by ID - passing ID in the body instead of URL parameter
export const updateProduct = async (id, updatedData) => {
  try {
    // Including the ID in the request body
    const response = await axios.put(Update_URL, {
      id: id,
      ...updatedData
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

// Delete product by ID - passing ID in the body instead of URL parameter
export const deleteProduct = async (id) => {
  try {
    // Send ID in the request body using axios.delete with data option
    await axios.delete(DELETE_URL, {
      data: { id: id }
    });
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

// Columns for the table
export const columns = [
  {
    accessorKey: "id",
    header: "Product Id",
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "wash_and_fold_price", header: "W & F Price" },
  { accessorKey: "wash_and_iron_price", header: "W & I Price" },
  { accessorKey: "premium_laundry_price", header: "Premium Price" },
  { accessorKey: "dry_clean_price", header: "Dry Clean Price" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [formData, setFormData] = useState(row.original);

      // Handle edit (opens dialog)
      const handleEdit = () => {
        setFormData(row.original);
        setIsDialogOpen(true);
      };

      // Handle update submission
      const handleUpdate = async () => {
        await updateProduct(row.original.id, formData);
        setIsDialogOpen(false);
        alert("Product updated successfully!");
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger className="cursor-pointer" onClick={handleEdit}>
                    Update Product
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Product</DialogTitle>
                      <DialogDescription>
                        <Card className="w-full mx-auto p-4">
                          <CardHeader>
                            <CardTitle className="text-xl">Update Product</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <label className="block mb-2">Product Name:</label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                              }
                              className="w-full border p-2 rounded"
                            />
                            <Button
                              className="mt-4"
                              onClick={handleUpdate}
                            >
                              Save Changes
                            </Button>
                          </CardContent>
                        </Card>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <h2
                  className="cursor-pointer text-red-500"
                  onClick={() => deleteProduct(row.original.id)}
                >
                  Delete
                </h2>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];