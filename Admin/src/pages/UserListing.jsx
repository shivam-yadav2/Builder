import React, { useEffect, useState } from "react";
import Layout from "@/layout/Layout";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/utils/Datatable";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "https://backend.rsusb2sbuildersconstructions.com/api/v1/users/all-users",
          headers: {
            Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
          },
        };
        const response = await fetch(config.url, {
          method: config.method,
          headers: config.headers,
        });
        const data = await response.json();
        setUsers(data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      console.log(`Deleting user with ID: ${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleStatusUpdate = async (user, status) => {
    try {
      const data = JSON.stringify({
        id: user._id,
        message:
          status === "approved"
            ? "Your Account Has Been Approved"
            : "Your Account Has Been Denied",
        status: status,
      });
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://backend.rsusb2sbuildersconstructions.com/api/v1/users/update-status",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
        },

        body: data,
      };
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body,
      });
      const result = await response.json();
      console.log("Status updated:", result);
      setUsers(
        users.map((u) =>
          u._id === user._id
            ? {
              ...u,
              approvalStatus: status,
              adminMessage: config.body.message,
            }
            : u
        )
      );
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <img
          src={`https://backend.rsusb2sbuildersconstructions.com/${row.original.avatar}`}
          alt={row.original.name}
          className="w-12 h-12 object-cover rounded-full cursor-pointer"
          onClick={() => {
            setSelectedUser(row.original);
            setIsViewDialogOpen(true);
          }}
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "approvalStatus",
      header: "Approval Status",
      cell: ({ row }) => {
        const status = row.original.approvalStatus;
        return (
          <Badge
            variant={
              status === "approved"
                ? "success"
                : status === "pending"
                  ? "warning"
                  : "destructive"
            }
            className={
              status === "approved"
                ? "bg-green-100 text-green-700 capitalize"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-700 capitalize"
                  : "bg-red-100 text-red-700 capitalize"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsViewDialogOpen(true);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <DataTable columns={columns} data={users} />
        )}

        {/* View/Approve/Deny Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Review and update the user's account status.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone}
                </p>
                <p>
                  <strong>Location:</strong> {selectedUser.location}
                </p>
                <p>
                  <strong>Approval Status:</strong>{" "}
                  {selectedUser.approvalStatus}
                </p>
                <p>
                  <strong>Admin Message:</strong>{" "}
                  {selectedUser.adminMessage || "None"}
                </p>
                <img
                  src={`https://backend.rsusb2sbuildersconstructions.com/${selectedUser.avatar}`}
                  alt="Avatar"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            )}
            <DialogFooter>
              {selectedUser?.approvalStatus !== "approved" && (
                <Button
                  onClick={() => handleStatusUpdate(selectedUser, "approved")}
                >
                  Approve
                </Button>
              )}
              {selectedUser?.approvalStatus !== "denied" && (
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate(selectedUser, "denied")}
                >
                  Deny
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate(selectedUser, "denied")}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UserListing;
