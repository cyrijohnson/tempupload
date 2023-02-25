import React, { useEffect, useState } from "react";
import Router from "next/router";

import useAuth from "contexts/useAuth";

import LoadingScreen from "components/loading-screen";

function getRedirectTo() {
  if (typeof window !== "undefined" && window.location) {
    return window.location;
  }
  return {};
}

const withAuthComponent = (WrappedComponent, roles) => {
  const Wrapper = (props) => {
    const { user, isAuthenticated, isInitialized } = useAuth();

    const redirectIfNoUser = () => {
      if (user && roles.find((r) => r == user.role.type) != undefined) return;
      const redir = getRedirectTo();
      Router.replace(
        `/login?r=${redir.pathname + encodeURIComponent(redir.search)}`,
        "/login",
        { shallow: true }
      );
    };

    useEffect(() => {
      if (!isInitialized) return;
      if (user) console.log(roles.find((r) => r == user.role.type));
      if (!user) {
        setTimeout(redirectIfNoUser, 500);
      }
      if (user && roles.find((r) => r == user.role.type) === undefined) {
        setTimeout(redirectIfNoUser, 500);
      }
    }, [user, isInitialized]);

    if (!isAuthenticated) {
      return <LoadingScreen />;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuthComponent;
