import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constants/role";
import AboutPage from "@/pages/About";
import Employees from "@/pages/Employees";
import EmployeesDetails from "@/pages/EmployeesDetails";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/register";
import Verify from "@/pages/Verify";
import type { TRole } from "@/types";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "about",
        Component: AboutPage,
      },

      {
        path: "employees",
        Component: Employees,
      },
      {
        path: "employees/:id",
        Component: EmployeesDetails,
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.superAdmin as TRole),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.user as TRole),
    path: "/user",
    children: [
      { index: true, element: <Navigate to="/user" /> },
      ...generateRoutes(userSidebarItems),
    ],
  },

  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/verify",
    Component: Verify,
  },

  {
    path: "*",
    Component: NotFound,
  },
]);
