import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "../pages/Home";
import Register from "../pages/Register";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
