import React, { Fragment, useState } from "react";

import { Box } from "@mui/system";
import { Button, Grid } from "@mui/material";

import Card1 from "components/Card1";

import Link from "next/link";
import { useRouter } from "next/router";
import { useOrders } from "contexts/OrdersContext";

import SquarePaymentForm from "./SquarePaymentForm";
import LoadingScreen from "components/loading-screen";

const PaymentFormComponent = () => {
  const router = useRouter();
  const { ordersInitialized } = useOrders();

  return ordersInitialized ? (
    <Fragment>
      <Card1
        sx={{
          mb: "2rem",
        }}
      >
        <SquarePaymentForm />
      </Card1>

      <Grid container spacing={7}>
        <Grid item sm={6} xs={12}>
          <Link href="/checkout">
            <Button variant="outlined" color="primary" type="button" fullWidth>
              Back to checkout details
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Fragment>
  ) : (
    <LoadingScreen />
  );
};

export default PaymentFormComponent;
