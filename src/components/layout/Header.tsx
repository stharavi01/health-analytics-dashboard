import { Menu } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Header component with mobile menu toggle
 */
export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <h1 className="text-xl font-bold text-foreground hidden sm:block">
            Health Analytics Dashboard
          </h1>
          <h1 className="text-xl font-bold text-foreground sm:hidden">
            Health Analytics
          </h1>
        </div>

        {/* Right side - theme toggle and user menu */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-medium text-secondary-foreground">
              U
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
