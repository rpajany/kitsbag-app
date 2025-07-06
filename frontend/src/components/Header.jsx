import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { POST_Api } from "@/services/ApiService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, MoonIcon, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import user_logo from "@/assets/default-user.png";

export const Header = () => {
  const { setTheme, theme } = useTheme();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // console.log("user :", user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const logout = async () => {
    // console.log("logout called !!");
    await POST_Api("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="w-full flex justify-between p-2 px-4  border-2 z-50 bg-blue-300">
      <div className="flex items-center gap-2">
        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Logo</AvatarFallback>
        </Avatar> */}
        <img src={logo} className="w-40"/>
        {/* <h5>Rithul Industries</h5> */}
      </div>

      <div>
        {/* <DropdownMenu className="">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            {/* <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
            <img src={user_logo} className="w-10 h-10 rounded-full"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem> */}
            <DropdownMenuItem variant="destructive">
              <button onClick={logout} className="flex items-center">
                <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
