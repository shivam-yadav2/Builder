import { AppSidebar } from "@admin/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@admin/components/ui/sidebar";
import { Toaster } from "@admin/components/ui/sonner";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

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
                <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur px-3 sm:px-4">
                    <SidebarTrigger className="size-9 sm:size-8" aria-label="Toggle navigation" />
                    <span className="font-semibold text-base sm:text-lg truncate">Admin</span>
                </header>
                <div className="p-3 sm:p-5">
                    <Outlet />
                    <Toaster />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
