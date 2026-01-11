import App from "@/App";
import AboutPage from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/register";
import Verify from "@/pages/Verify";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "about",
        Component: AboutPage,
      },
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

  // {
  //   path: "*",
  //   Component: NotFound,
  // },
]);
