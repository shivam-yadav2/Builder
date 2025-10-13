// Profile.jsx
import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/layout/DashboardLayout";
import MyContext from "@/context/MyContext";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const context = useContext(MyContext);
  const { userData } = context;

  console.log(userData);

  // Sample user data (would come from your API)
  const [user, setUser] = useState({
    avatar: userData?.avatar ? `https://backend.rsusb2sbuildersconstructions.com/${userData?.avatar} ` : `https://cdn-icons-png.flaticon.com/512/9187/9187604.png`,
    name: userData?.name,
    phone: userData?.phone,
    email: userData?.email,
    location: userData?.location,
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="flex flex-col md:flex-row justify-between items-center">
            <CardTitle className="text-2xl mb-4 md:mb-0">
              User Profile
            </CardTitle>
            <Badge>Approved</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar} alt={user.name} />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {user.location || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
