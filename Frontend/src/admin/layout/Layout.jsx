import { AppSidebar } from "@admin/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@admin/components/ui/sidebar";
import { Toaster } from "@admin/components/ui/sonner";
import AdminBottomDock from "@admin/components/AdminBottomDock";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Layout() {
    const token = Cookies.get('accessTokenAdmin');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/admin");
        }
    }, [token]);

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

                    {/* Account chip */}
                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden text-right leading-tight sm:block">
                            <p className="text-sm font-medium text-gray-800">Administrator</p>
                            <p className="text-xs text-gray-400">RSUS B2S Builders</p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
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
