import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@admin/components/ui/sidebar"
import { NavLink } from "react-router-dom";

export function NavProjects({
  projects, title
}) {
  const { isMobile, setOpenMobile } = useSidebar()

  // On mobile, collapse the sidebar after a menu item is tapped.
  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup className="">

      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild>
              <NavLink to={item.url} onClick={handleNavClick}>
                <item.icon />
                <span>{item.title}</span>
                {item.badge > 0 && (
                  <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        
      </SidebarMenu>
    </SidebarGroup>
  );
}
