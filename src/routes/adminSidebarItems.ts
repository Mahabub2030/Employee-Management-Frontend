// import Analytics from "@/pages/Admin/Analytics";

import AddEmployee from "@/pages/Admin/AddEmployee";
import analytics from "@/pages/Admin/analytics";
import ManageEmployee from "@/pages/Admin/ManageEmployee";
import UserManagmnets from "@/pages/Admin/UserManagmnets";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: analytics,
      },
    ],
    url: "",
  },
  {
    title: "Emolyee Management",
    items: [
      {
        title: "Add Emplyee",
        url: "/admin/addEmolyee",
        component: AddEmployee,
      },
    ],
    url: "",
  },
  {
    title: "Emolyee Management",
    items: [
      {
        title: "Manageme Emplyee",
        url: "/admin/ManageEmployee",
        component: ManageEmployee,
      },
    ],
    url: "",
  },
  {
    title: "User Management",
    items: [
      {
        title: "User Management",
        url: "/admin/ManageUsers",
        component: UserManagmnets,
      },
    ],
    url: "",
  },
];
