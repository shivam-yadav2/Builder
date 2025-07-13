// components/SalonServicesDashboard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"; // Using Recharts for pie chart

const salonData = {
  totalAppointments: 45,
  revenue: 3200, // in dollars
  pendingAppointments: 5,
  topServices: [
    { name: "Haircut", bookings: 20, revenue: 1000 },
    { name: "Manicure", bookings: 15, revenue: 750 },
    { name: "Hair Coloring", bookings: 10, revenue: 1450 },
  ],
  recentAppointments: [
    { id: 1, customer: "Alice Brown", service: "Haircut", date: "2025-03-27", status: "Completed" },
    { id: 2, customer: "Sarah Lee", service: "Manicure", date: "2025-03-27", status: "Pending" },
    { id: 3, customer: "Tom Clark", service: "Hair Coloring", date: "2025-03-26", status: "Completed" },
  ],
  serviceDistribution: [
    { name: "Haircut", value: 20 },
    { name: "Manicure", value: 15 },
    { name: "Hair Coloring", value: 10 },
    { name: "Others", value: 5 },
  ],
};

// Colors for Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const SalonServicesDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Salon Services Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{salonData.totalAppointments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${salonData.revenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{salonData.pendingAppointments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{salonData.topServices[0].name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Distribution Pie Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salonData.serviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {salonData.serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Appointments Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salonData.recentAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.customer}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={appointment.status === "Completed" ? "default" : "secondary"}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salonData.topServices.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.bookings}</TableCell>
                  <TableCell>${service.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalonServicesDashboard;