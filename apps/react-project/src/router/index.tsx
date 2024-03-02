import App from "../pages/App";
import Other from "../pages/Other";
import Params from "../pages/Params";
import Layout from "../pages/Layout/Index";
import Left from "../pages/Layout/Left";
import Right from "../pages/Layout/Right";
import NotFound from "../pages/NotFound";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/other",
    element: <Other />,
  },
  {
    path: "/params/:id/:name",
    element: <Params />,
  },
  {
    path: "/layout",
    element: <Layout />,
    children: [
      {
        index: true, // 设置默认二级路由
        element: <Left />,
      },
      {
        path: "right",
        element: <Right />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
