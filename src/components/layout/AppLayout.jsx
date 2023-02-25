import Footer from "components/footer/Footer";
import Header from "components/header";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import Sticky from "components/sticky/Sticky";
import Topbar from "components/topbar/Topbar";
import Head from "next/head";
import React, { Fragment, useCallback, useEffect, useState } from "react";

// import AuthGuard from "utils/AuthGuard";

const AppLayout = ({ children, navbar, title = "RJM Sports" }) => {
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed) => {
    setIsFixed(fixed);
  }, []);

  // const protectedRoutes = ["/vendor/"];

  return (
    <Fragment>
      {/* <AuthGuard protectedRoutes={protectedRoutes}> */}
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Topbar />

      {children}

      <MobileNavigationBar />
      <Footer />
      {/* </AuthGuard> */}
    </Fragment>
  );
};

export default AppLayout;
