import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Building2,
  CheckCircle2,
  Inbox,
  IndianRupee,
  Plus,
  Image as ImageIcon,
  Quote,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";

const API = import.meta.env.VITE_API_BASE_URL;
const auth = () => ({ Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}` });

// Compact Indian currency (₹1.25 Cr / ₹85 L / ₹45,000).
const formatINR = (value) => {
  const n = Number(value);
  if (!n || Number.isNaN(n)) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2).replace(/\.?0+$/, "")} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
const isThisMonth = (s) => {
  const d = new Date(s);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
};
const isLastMonth = (s) => {
  const d = new Date(s);
  const n = new Date();
  const lm = new Date(n.getFullYear(), n.getMonth() - 1, 1);
  return d.getFullYear() === lm.getFullYear() && d.getMonth() === lm.getMonth();
};

const STATUS_COLORS = { Available: "#10b981", Pending: "#f59e0b", Sold: "#ef4444" };

const StatCard = ({ icon: Icon, label, value, sub, delta, accent }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta != null && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium">
          {delta >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={delta >= 0 ? "text-emerald-600" : "text-red-500"}>
            {delta >= 0 ? "+" : ""}
            {delta}
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      axios.get(`${API}/api/v1/admin/get-all-properties`, { headers: auth() }),
      axios.get(`${API}/api/v1/gallery/get-all`),
      axios.get(`${API}/api/v1/enquiry/get-enquiry`, { headers: auth() }),
    ])
      .then(([p, g, e]) => {
        if (p.status === "fulfilled") setProperties(p.value.data?.data || []);
        if (g.status === "fulfilled") setGallery(g.value.data?.data || []);
        if (e.status === "fulfilled")
          setEnquiries(e.value.data?.data || e.value.data?.message || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---- Metrics ----
  const totalProperties = properties.length;
  const available = properties.filter((p) => p.status === "Available").length;
  const newEnquiries = enquiries.filter((e) => (e.status || "New") === "New").length;
  const portfolioValue = properties.reduce((sum, p) => {
    const total =
      Number(p.totalPrice) ||
      (Number(p.unitPrice) && Number(p.landArea)
        ? Number(p.unitPrice) * Number(p.landArea)
        : Number(p.unitPrice)) ||
      0;
    return sum + total;
  }, 0);

  const propsThisMonth = properties.filter((p) => isThisMonth(p.createdAt)).length;
  const propsLastMonth = properties.filter((p) => isLastMonth(p.createdAt)).length;
  const enqThisMonth = enquiries.filter((e) => isThisMonth(e.createdAt)).length;
  const enqLastMonth = enquiries.filter((e) => isLastMonth(e.createdAt)).length;

  const soldItems = gallery.filter((g) => g.category !== "construction");
  const constructionItems = gallery.filter((g) => g.category === "construction");

  // Enquiries per month (last 6)
  const now = new Date();
  const monthBuckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthBuckets.push({
      key: monthKey(d),
      label: d.toLocaleString("en", { month: "short" }),
      Enquiries: 0,
    });
  }
  enquiries.forEach((e) => {
    const b = monthBuckets.find((m) => m.key === monthKey(new Date(e.createdAt)));
    if (b) b.Enquiries += 1;
  });

  // Properties by status (pie)
  const statusData = ["Available", "Pending", "Sold"]
    .map((s) => ({ name: s, value: properties.filter((p) => p.status === s).length }))
    .filter((d) => d.value > 0);

  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const quickActions = [
    { to: "/dashboard/add_property", label: "Add Property", icon: Plus, accent: "bg-blue-600" },
    { to: "/dashboard/gallery", label: "Add Showcase", icon: ImageIcon, accent: "bg-emerald-600" },
    { to: "/dashboard/testimonials", label: "Add Testimonial", icon: Quote, accent: "bg-amber-500" },
    { to: "/dashboard/general_inquiry", label: "View Enquiries", icon: Inbox, accent: "bg-purple-600" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
        <p className="text-sm text-gray-500">Here's what's happening across your business.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group flex items-center gap-3 rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${a.accent}`}>
              <a.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-gray-800">{a.label}</span>
            <ArrowUpRight className="ml-auto h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-500" />
          </Link>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Total Properties"
          value={totalProperties}
          sub={`${available} available`}
          delta={propsThisMonth - propsLastMonth}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Inbox}
          label="New Enquiries"
          value={newEnquiries}
          sub={`${enquiries.length} total leads`}
          delta={enqThisMonth - enqLastMonth}
          accent="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={IndianRupee}
          label="Portfolio Value"
          value={formatINR(portfolioValue)}
          sub="Across all listings"
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Showcase Items"
          value={soldItems.length + constructionItems.length}
          sub={`${soldItems.length} sold · ${constructionItems.length} built`}
          accent="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Enquiries — last 6 months</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthBuckets} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="Enquiries" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Properties by status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="py-16 text-center text-sm text-gray-400">No properties yet</p>
            ) : (
              <>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {statusData.map((entry) => (
                          <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1">
                  {statusData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: STATUS_COLORS[s.name] }}
                        />
                        {s.name}
                      </span>
                      <span className="font-semibold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent enquiries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Enquiries</CardTitle>
          <Link to="/dashboard/general_inquiry" className="text-sm font-medium text-emerald-600 hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentEnquiries.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Inbox className="h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-400">No enquiries yet</p>
            </div>
          ) : (
            <ul className="divide-y">
              {recentEnquiries.map((e) => (
                <li key={e._id} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                    {e.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{e.name}</p>
                    <p className="truncate text-xs text-gray-500">{e.message || e.email || e.phone}</p>
                  </div>
                  <Badge
                    className={
                      (e.status || "New") === "New"
                        ? "bg-blue-100 text-blue-700"
                        : e.status === "Contacted"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                    }
                  >
                    {e.status || "New"}
                  </Badge>
                  {e.phone && (
                    <div className="hidden items-center gap-1.5 sm:flex">
                      <a
                        href={`tel:${e.phone}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://wa.me/91${String(e.phone).replace(/\D/g, "").slice(-10)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
