import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import SignUp from "../pages/auth/sign-up";
import SignIn from "../pages/auth/sign-in";
import Snaps from "../pages/snaps";
import MostPopular from "../pages/MostPopular";
import Passcode from "../pages/passcode";
import Collections from "../pages/collections";
import PrivateRoute from "./PrivateRoute";
import Landing from "../pages/Landing";
import VerifyEmail from "../pages/verify-email/page";

function Router() {
  return (
    <div>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/snaps/:userId" element={<Snaps />} />
          <Route path="/most-popular" element={<MostPopular />} />
          <Route path="/passcode" element={<Passcode />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default Router;
