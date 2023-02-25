import React, { useEffect, useState } from "react";

// mui
import { Box } from "@mui/system";
import { Container, Grid } from "@mui/material";

// custom components
import Navbar from "components/navbar/Navbar";
import Stepper from "components/stepper/Stepper";
import AppLayout from "./AppLayout";

// utils
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";

const CheckoutNavLayout = ({ children }) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const { items } = useCart();
  const { pathname } = router;

  const handleStepChange = (step) => {
    switch (step) {
      case 0:
        router.push("/cart");
        break;

      case 1:
        router.push("/checkout");
        break;

      case 2:
        router.push("/payment");
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setSelectedStep(1);
        break;

      case "/checkout":
        setSelectedStep(2);
        break;

      case "/payment":
        setSelectedStep(3);
        break;

      default:
        break;
    }
  }, [pathname]);
  return (
    <AppLayout navbar={<Navbar />}>
      <Container
        sx={{
          my: "2rem",
        }}
      >
        {items.length > 0 && (
          <Box mb={3}>
            <Grid container spacing={3}>
              <Grid item lg={8} md={8} xs={12}>
                <Stepper
                  stepperList={stepperList}
                  selectedStep={selectedStep}
                  onChange={handleStepChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        {children}
      </Container>
    </AppLayout>
  );
};

const stepperList = [
  {
    title: "Cart",
    disabled: false,
  },
  {
    title: "Details",
    disabled: false,
  },
  {
    title: "Payment",
    disabled: false,
  },
];
export default CheckoutNavLayout;
