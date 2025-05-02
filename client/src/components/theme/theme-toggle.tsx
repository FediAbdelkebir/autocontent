import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  // Force theme change with console output to debug
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    console.log(`Changing theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
    
    // Immediately log the theme state and DOM updates
    setTimeout(() => {
      console.log("Current theme:", document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      console.log("HTML classes:", document.documentElement.className);
      console.log("data-theme:", document.documentElement.getAttribute('data-theme'));
    }, 50);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 min-w-[100px] justify-between"
          >
            {theme === "light" && (
              <>
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
                <span>Light</span>
              </>
            )}
            {theme === "dark" && (
              <>
                <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-400" />
                <span>Dark</span>
              </>
            )}
            {theme === "system" && (
              <>
                <Laptop className="h-[1.2rem] w-[1.2rem]" />
                <span>System</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")} className="cursor-pointer">
            <Sun className="mr-2 h-4 w-4 text-amber-500" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4 text-indigo-400" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")} className="cursor-pointer">
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}