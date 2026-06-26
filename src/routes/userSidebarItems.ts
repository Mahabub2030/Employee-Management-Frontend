import UserPage from "@/pages/User/Userpage";
import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "UserPage",
        url: "/user/UserPage",
        component: UserPage,
      },
    ],
    url: "",
  },
];
