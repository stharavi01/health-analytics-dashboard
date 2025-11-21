import { NavLink } from "react-router-dom";
import { LayoutDashboard, Globe, BarChart3, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Home",
  },
  {
    to: "/countries",
    icon: Globe,
    label: "Data",
  },
  {
    to: "/charts",
    icon: BarChart3,
    label: "Charts",
  },
  {
    to: "/about",
    icon: Info,
    label: "About",
  },
];

/**
 * Mobile-only bottom navigation bar
 * Hidden on desktop (≥768px)
 */
export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-border md:hidden">
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[100px]",
                isActive
                  ? "text-primary scale-110"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
