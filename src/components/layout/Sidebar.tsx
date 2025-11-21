import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/countries",
    icon: Globe,
    label: "Countries Data",
  },
];

/**
 * Sidebar navigation component with collapse and mobile support
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-card border-r border-border transition-all duration-200 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div
            className={cn(
              "flex items-center gap-2 transition-opacity duration-300",
              isCollapsed && "lg:opacity-0 lg:hidden"
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                H
              </span>
            </div>
            <span className="font-semibold text-foreground whitespace-nowrap">
              Health Analytics
            </span>
          </div>

          {isCollapsed && (
            <div className="hidden lg:flex h-8 w-8 rounded-lg bg-primary items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-lg">
                H
              </span>
            </div>
          )}

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 pb-24">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg transition-colors relative group",
                  isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "font-medium transition-opacity duration-300",
                  isCollapsed && "lg:opacity-0 lg:hidden"
                )}
              >
                {item.label}
              </span>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block shadow-lg">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle button (desktop only) */}
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <button
            onClick={toggleCollapse}
            className={cn(
              "w-full flex items-center justify-center gap-2 p-2 hover:bg-accent rounded-md transition-all duration-200",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
