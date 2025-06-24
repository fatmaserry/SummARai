import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import useAuth from "../provider/auth/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import SearchBooks from "../pages/Search";
import Readings from "../pages/Readings";
import Layout from "../layout";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Summary from "../pages/Summary";
import EditProfile from "../pages/EditProfile";
import ForgotPassword from "../pages/ForgetPassword";
import VerifyOtp from "../pages/VerifyOTP";
import ResetPassword from "../pages/ResetPassword";
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
    {
      path: "/register",
      element: <Signup />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/verify-otp",
      element: <VerifyOtp />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
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
          path: "/summary",
          element: <Summary />,
        },
        {
          path: "/edit-profile",
          element: <EditProfile />, 
        }
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
