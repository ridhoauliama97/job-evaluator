import { Moon, Sun, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-foreground truncate">
                PSI Decision Support
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                Job Alternative Evaluator
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/criteria">
              <Button variant="ghost" size="sm" className="h-8 sm:h-9">
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Manage Criteria</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
