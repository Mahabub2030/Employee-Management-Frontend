import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navigationLinks = [
  { href: "/", label: "Home", role: "PUBLIC" },
  { href: "/about", label: "About", role: "PUBLIC" },
  { href: "/feature", label: "Features", role: "PUBLIC" },
];

export default function Navbar() {
  const isLoggedIn = false; // Replace with your actual auth state

  return (
    <>
      {/* Top announcement bar */}
      <div className="w-full bg-[#623283] text-white text-xs py-1 text-center">
        EMS · Employee management system for modern businesses.
      </div>

      <header className="sticky top-0 z-50 w-full bg-white border-b text-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-8">
              {/* Mobile Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-56 md:hidden">
                  {/* Add mobile menu items here */}
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block py-2 px-4"
                    >
                      {link.label}
                    </Link>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <p>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.0964 20.3536L17.6262 22.4473L17.046 27.6527L8.94876 36.8282C4.2486 33.8023 0.898178 28.8615 0 23.108L13.0964 20.3536Z"
                      fill="#15E3FF"
                    ></path>
                    <path
                      d="M25.183 25.94L31.2414 36.3789C27.992 38.6605 24.0331 40 19.7612 40C18.3744 40 17.0206 39.8587 15.7133 39.59L17.046 27.6527L20.4765 23.7656L25.183 25.94Z"
                      fill="#348DFC"
                    ></path>
                    <path
                      d="M39.1022 14.881C39.5332 16.5143 39.763 18.2294 39.763 19.9982C39.763 24.1145 38.5192 27.9403 36.3874 31.1207L25.184 25.9405L22.5551 21.4123L25.8574 17.6692L39.1022 14.881Z"
                      fill="#FD4873"
                    ></path>
                    <path
                      d="M17.046 27.6524L17.0458 27.6527L17.1686 26.552L17.046 27.6524Z"
                      fill="#FFC700"
                    ></path>
                    <path
                      d="M20.132 0C26.1505 0.109415 31.5194 2.877 35.1148 7.17842L25.8561 17.6694L20.9792 18.6959L18.519 14.4574L20.132 0Z"
                      fill="#FFC700"
                    ></path>
                    <path
                      d="M18.519 14.4574L17.9745 19.3269L13.0991 20.353L0.514709 14.5347C2.09964 8.94044 6.05794 4.3436 11.2327 1.9007L18.519 14.4574Z"
                      fill="#00E7B9"
                    ></path>
                  </svg>
                </p>
                <span className="text-xl font-bold text-blue-700 uppercase">
                  EMS.Modern
                </span>
              </Link>

              {/* Desktop Navigation */}
              <NavigationMenu className="hidden md:flex">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </NavigationMenu>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Log in
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full h-9 px-3 flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>

                      <span className="text-sm font-medium hidden sm:block">
                        User Name
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">User Name</p>
                      <p className="text-xs text-muted-foreground">
                        email@example.com
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
