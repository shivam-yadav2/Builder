import { AppSidebar } from "@admin/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@admin/components/ui/sidebar";
import { Toaster } from "@admin/components/ui/sonner";
import AdminBottomDock from "@admin/components/AdminBottomDock";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

// Pull a display name/email out of the admin JWT, if present.
const getAdminProfile = (token) => {
    try {
        const p = jwtDecode(token);
        return {
            name: p.name || p.fullName || p.username || "Administrator",
            email: p.email || "RSUS B2S Builders",
        };
    } catch {
        return { name: "Administrator", email: "RSUS B2S Builders" };
    }
};

export default function Layout() {
    const token = Cookies.get('accessTokenAdmin');
    const navigate = useNavigate();
    const profile = getAdminProfile(token);

    useEffect(() => {
        if (!token) {
            navigate("/admin");
        }
    }, [token]);

    const logout = () => {
        Cookies.remove("accessTokenAdmin");
        Cookies.remove("refreshToken");
        toast.success("Logged out");
        navigate("/admin");
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-white/90 px-3 shadow-sm backdrop-blur sm:px-5">
                    <SidebarTrigger className="size-9 text-gray-600 sm:size-8" aria-label="Toggle navigation" />

                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="RSUS B2S"
                            className="h-9 w-auto object-contain sm:h-10"
                        />
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                            Admin
                        </span>
                    </div>

                    {/* Account menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="ml-auto flex items-center gap-2 rounded-full outline-none ring-emerald-500 focus-visible:ring-2">
                            <div className="hidden text-right leading-tight sm:block">
                                <p className="max-w-[160px] truncate text-sm font-medium text-gray-800">{profile.name}</p>
                                <p className="max-w-[160px] truncate text-xs text-gray-400">{profile.email}</p>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                                <User className="h-5 w-5" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <p className="truncate font-medium">{profile.name}</p>
                                <p className="truncate text-xs font-normal text-gray-400">{profile.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                {/* Extra bottom padding on mobile so content clears the dock */}
                <div className="p-3 pb-24 sm:p-5 lg:pb-5">
                    <Outlet />
                    <Toaster />
                </div>
            </SidebarInset>
            {/* App-style bottom navigation (mobile only) */}
            <AdminBottomDock />
        </SidebarProvider>
    );
}
