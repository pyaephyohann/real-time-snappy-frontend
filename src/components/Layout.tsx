import { ReactNode, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import SplashScreen from "./SplashScreen";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const [showSplash, setShowSplash] = useState(true);

  const windowPathname = window.location.pathname;

  const isLandingPage = windowPathname === "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash)
    return (
      <div>
        <SplashScreen />
      </div>
    );

  return (
    <div>
      <ToastContainer />
      {!isLandingPage && (
        <div className="w-[80%] mx-auto fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}
      <div className={`${isLandingPage ? "" : "mt-[9rem]"}`}>{children}</div>
    </div>
  );
};

export default Layout;
