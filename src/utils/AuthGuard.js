import PropTypes from "prop-types";
import { useState } from "react";
// next
import { useRouter } from "next/router";
// ----------------------------------------------------------------------
import useAuth from "contexts/useAuth";
import { useProducts } from "contexts/ProductsContext";
import LoadingScreen from "components/loading-screen";

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children, protectedRoutes }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { productsInitialized } = useProducts();

  const initCompleted = isInitialized && productsInitialized;

  const router = useRouter();

  const [requestedLocation, setRequestedLocation] = useState(null);

  //   useEffect(() => {
  //     if (requestedLocation && pathname !== requestedLocation) {
  //       setRequestedLocation(null);
  //       navigate(requestedLocation);
  //     }
  //   }, [pathname, navigate, requestedLocation]);

  if (!initCompleted) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (router.pathname !== requestedLocation) {
      setRequestedLocation(router.pathname);
    }
    const match = protectedRoutes.find((element) => {
      if (router.pathname.includes(element)) {
        return true;
      }
    });

    // console.log(router.pathname);
    // console.log(protectedRoutes);
    // console.log("match", match);

    if (match) {
      router.push("/login");
    }
  }

  return <>{children}</>;
}
