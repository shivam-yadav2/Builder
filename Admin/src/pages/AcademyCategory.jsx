import Layout from "@/layout/Layout";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
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
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const AcademyCategory = () => {
  const [title, setTitle] = useState();
  const [category, setCategory] = useState();

  const getCategory = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/category/get-category",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setCategory(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addCategory = () => {
    const id = toast.loading("Adding Category ...");
    console.log(title);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/category/add-category",
      headers: {},
      data: {
        title: title,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setTimeout(() => {
          toast.success("Category added Successfully", { id });
          getCategory();
        }, 1000);
        setTitle("");
      })
      .catch((error) => {
        console.log(error);
      });
  }; 

  useEffect(() => {
    getCategory();
    console.log(category);
  }, []);

  const deleteCategory = ({ id }) => {
    const id2 = toast.loading("Deleting Category ...");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/category/delete-category",
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
          toast.success("Category deleted Successfully", { id: id2 });
          getCategory();
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong , please try again", { id: id2 });
      });
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle> Academy Course Category</CardTitle>
              <CardDescription>Add a New Category Here</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">S .No</TableHead>
                    <TableHead>Category Title</TableHead>
                    <TableHead>Category Url</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category?.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{item?.title}</TableCell>
                        <TableCell>{item?.category_url}</TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => deleteCategory({ id: item?._id })}
                            className="text-red-500 hover:bg-red-100 p-1 rounded cursor-pointer active:scale-90 transition"
                          >
                            <Trash2 />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 flex items-start gap-5">
          <Separator orientation="vertical" />

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create Academy Course Category</CardTitle>
              {/* <CardDescription className="text-red-400">
                Only Concerned Developer can add Categories
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Name of your category"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {/* <Button variant="outline">Cancel</Button> */}
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={addCategory}
              >
                Add
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AcademyCategory;