import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Runs from "./pages/Runs.jsx";
import Gallery from "./pages/Gallery.jsx";
import Status from "./pages/Status.jsx";
import Mazes from "./pages/Mazes.jsx";
import Teams from "./pages/Teams.jsx";

import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import Logbook from "./pages/Logbook.jsx";

import { AuthProvider } from "./AuthContext.jsx";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/RouteGuards.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "runs", element: <Runs /> },
      { path: "gallery", element: <Gallery /> },
      { path: "status", element: <Status /> },
      { path: "mazes", element: <Mazes /> },
      { path: "logbook", element: <ProtectedRoute><Logbook /></ProtectedRoute> },
      { path: "signin", element: <PublicOnlyRoute><SignIn /></PublicOnlyRoute> },
      { path: "signup", element: <PublicOnlyRoute><SignUp /></PublicOnlyRoute> },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "teams", element: <Teams /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
