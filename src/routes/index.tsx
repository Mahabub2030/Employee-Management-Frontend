import App from "@/App";
import AboutPage from "@/pages/About";
import Login from "@/pages/Login";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: AboutPage,
        path: "about",
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },

  // {
  //   path: "*",
  //   Component: NotFound,
  // },
]);
