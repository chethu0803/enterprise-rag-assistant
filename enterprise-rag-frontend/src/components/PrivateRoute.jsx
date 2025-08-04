import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminOnlyNotice from "./AdminOnlyNotice";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} />;
  }

  try {
    const decoded = jwtDecode(token);
    const isAdmin = decoded?.is_admin;

    if (adminOnly && !isAdmin) {
      return <AdminOnlyNotice />;
    }

    return children;
  } catch (err) {
    // Invalid or expired token
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
