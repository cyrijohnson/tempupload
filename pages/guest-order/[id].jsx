import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

import FlexBox from "components/FlexBox";
import LoadingScreen from "components/loading-screen";
import OrderDetails from "components/checkout/OrderDetails";

// Utils
import axios from "utils/axios";
import { useRouter } from "next/router";

const StyledFlexbox = styled(FlexBox)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
  "& .line": {
    flex: "1 1 0",
    height: 4,
    minWidth: 50,
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
      height: 50,
      minWidth: 4,
    },
  },
}));

const GuestOrderDetailsPage = () => {
  // state management --------------------------------------------------
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const router = useRouter();

  // fetch order
  const fetchOrder = async (id, pid) => {
    const { data } = await axios.get(`/orders/${id}?pid=${pid}`);
    if (data != null) {
      setOrder(data);
      setOrderStatus(data.orderStatus);
    } else {
      router.push(`/`);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { id, pid } = router.query;
    fetchOrder(id, pid);
  }, [router.isReady]);

  if (!orderStatus || !order) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ p: "2em" }}>
      <OrderDetails order={order} orderStatus={orderStatus} />
    </Box>
  );
};

export default GuestOrderDetailsPage;
