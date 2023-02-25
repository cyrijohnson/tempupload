import React from "react";

// mui
import { Grid } from "@mui/material";

// custom components
import CheckoutNavLayout from "components/layout/CheckoutNavLayout";
import PaymentFormComponent from "components/payment/PaymentFormComponent";
import CheckoutSummary2 from "components/checkout/CheckoutSummary2";

const Checkout = () => {
  return (
    <CheckoutNavLayout>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          <PaymentFormComponent />
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary2 />
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  );
};

export default Checkout;
