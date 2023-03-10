import React from "react";

// mui
import { Grid } from "@mui/material";

// custom components
import CheckoutForm from "components/checkout/CheckoutForm";
import CheckoutSummary2 from "components/checkout/CheckoutSummary2";
import CheckoutNavLayout from "components/layout/CheckoutNavLayout";

const Checkout = () => {
  return (
    <CheckoutNavLayout>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          <CheckoutForm />
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary2 />
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  );
};

export default Checkout;
