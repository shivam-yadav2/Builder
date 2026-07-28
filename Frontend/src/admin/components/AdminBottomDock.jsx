import { NavLink } from "react-router-dom";
import { LayoutGrid, Building2, Plus, Image as ImageIcon, Inbox } from "lucide-react";

// Mobile app-style bottom dock for the admin. Hidden on large screens
// (the sidebar takes over there). The center "Add" is an elevated FAB.
const items = [
  { to: "/dashboard", icon: LayoutGrid, label: "Home", end: true },
  { to: "/dashboard/all_property", icon: Building2, label: "Properties" },
  { to: "/dashboard/add_property", icon: Plus, label: "Add", center: true },
  { to: "/dashboard/gallery", icon: ImageIcon, label: "Showcase" },
  { to: "/dashboard/general_inquiry", icon: Inbox, label: "Enquiries" },
];

export default function AdminBottomDock() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-end justify-around px-2 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.center) {
            return (
              <li key={item.to} className="flex-1">
                <NavLink to={item.to} className="flex flex-col items-center">
                  {({ isActive }) => (
                    <>
                      <span
                        className={`-mt-6 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white transition-transform active:scale-95 ${
                          isActive ? "bg-emerald-700" : "bg-emerald-600"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="mt-0.5 text-[10px] font-medium text-gray-500">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          }

          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors ${
                    isActive ? "text-emerald-600" : "text-gray-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
