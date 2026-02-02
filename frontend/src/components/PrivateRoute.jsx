import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // or use context/auth logic
  return isAuthenticated ? children : <Navigate to={`${import.meta.env.BASE_URL}`} />;
};

export default PrivateRoute;
