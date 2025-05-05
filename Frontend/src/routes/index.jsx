import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import useAuth from "../provider/auth/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Profile from "../pages/Profile";
import SearchBooks from "../pages/Search";
import Readings from "../pages/Readings";
import Layout from "../layout";
import Home from "../pages/Home";

const Routes = () => {
  // const { token } = useAuth();

  // Non-authenticated routes
  const routesForPublic = [
    {
      path: "/",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: (
        <Layout>
          <ProtectedRoute />
        </Layout>
      ),
      children: [
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/Readings",
          element: <Readings />,
        },
        {
          path: "/Search",
          element: <SearchBooks />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  // Conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
