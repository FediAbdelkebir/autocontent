import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useTheme();

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
                <span>System ({isDarkMode ? 'Dark' : 'Light'})</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
            <Sun className="mr-2 h-4 w-4 text-amber-500" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4 text-indigo-400" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}