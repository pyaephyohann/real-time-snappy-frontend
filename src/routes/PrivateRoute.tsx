import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const logInToken = localStorage.getItem("logInToken");
  return logInToken ? <Outlet /> : <Navigate to={"/auth/sign-in"} />;
};

export default PrivateRoute;
