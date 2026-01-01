import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Link } from "react-router";

// import Logo from "../../assets/images/logo.png";

// const navigationLinks = [
//   { href: "/", label: "Home", role: "PUBLIC" },
//   { href: "/about", label: "About", role: "PUBLIC" },
//   { href: "/feature", label: "Features", role: "PUBLIC" },
//   { href: "/pricing", label: "Pricing", role: "PUBLIC" },
//   { href: "/contact", label: "Contact", role: "PUBLIC" },
//   { href: "/faq", label: "FAQ", role: "PUBLIC" },
//   { href: "/admin", label: "Dashboard", role: role.ADMIN },
//   { href: "/user", label: "Dashboard", role: role.USER },
//   { href: "/agent", label: "Dashboard", role: role.AGENT },
// ];

export default function Navbar() {
  //   const location = useLocation();
  //   const navigate = useNavigate();

  //   const handleLogOut = async () => {
  //     const toastId: string | number | undefined =
  //       toast.loading("Logging out...");
  //     try {
  //       const result = await logOut(null).unwrap();
  //       if (result.success) {
  //         toast.success("Logged out successfully", { id: toastId });
  //         dispatch(authApi.util.resetApiState());
  //         navigate("/");
  //       }
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     } catch (error: any) {
  //       console.log(error);
  //       toast.error("Logout failed", { id: toastId });
  //     }
  //   };

  return (
    <>
      {/* Top announcement bar */}
      <div className="w-full bg-[#623283] text-white text-xs py-1 text-center">
        EMS · employee management system for modern businesses.
      </div>

      <header className="sticky top-0 z-50 w-full bg-white border-b">
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

                <PopoverContent
                  align="start"
                  className="w-56 md:hidden"
                ></PopoverContent>
              </Popover>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                {/* <img src={Logo} alt="Logo" className="w-8 h-8" /> */}
                <p>img</p>
                <span className="text-xl font-bold text-blue-700 uppercase">
                  EMS.Mordern
                </span>
              </Link>

              {/* Desktop Navigation */}
              <NavigationMenu className="hidden md:flex"></NavigationMenu>
            </div>

            {/* RIGHT */}
            {/* <div className="flex items-center gap-4">
       

              {!userData?.data?.email ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Log in
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full h-9 px-3 flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={userData?.data?.avatar} />
                        <AvatarFallback>
                          {userData?.data?.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm font-medium hidden sm:block">
                        {userData?.data?.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">
                        {userData?.data?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userData?.data?.email}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to={`/${userData?.data?.role.toLowerCase()}`}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogOut}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div> */}
          </div>
        </div>
      </header>
    </>
  );
}
