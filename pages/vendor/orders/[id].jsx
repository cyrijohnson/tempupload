import React, { useState, useEffect } from "react";

import Delete from "@mui/icons-material/Delete";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import FlexBox from "components/FlexBox";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import TableRow from "components/TableRow";
import { H5, H6 } from "components/Typography";
import OrderDetails from "components/checkout/OrderDetails";

// Utils
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { SERVER_URL } from "constant";
import LoadingScreen from "components/loading-screen";
import axios from "utils/axios";

// Orders
import { useOrders } from "contexts/OrdersContext";

const OrderDetailsPage = () => {
  // state management --------------------------------------------------
  const { orders, ordersInitialized, refreshOrders } = useOrders();

  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  // payments
  const [refunding, setRefunding] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);

  // fetch order
  const fetchOrder = async (id) => {
    const { data } = await axios.get(`/orders/${id}`);
    if (data != null) {
      setOrder(data);
      setOrderStatus(data.orderStatus);
      if (data.refundID) {
        checkRefundStatus(data.refundID);
      }
    } else {
      router.push(`/`);
    }
  };

  const checkRefundStatus = async (refundID) => {
    // check for refund status
    let res = await axios.get("/refund/" + refundID);
    let status = res.data;
    setRefundStatus(status);
  };

  const updateOrder = async (newStatus) => {
    let res = await axios.put(`/update-order`, {
      orderID: order.sessionID,
      status: newStatus,
    });
    await refreshOrders();
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!ordersInitialized) return;
    fetchOrder(id);
  }, [router.isReady, orders]);

  const orderStatusList = [
    "packaging",
    "shipping",
    "delivering",
    "complete",
    "cancelled",
    "refunded",
  ];

  const Header = () => (
    <TableRow
      elevation={0}
      sx={{
        bgcolor: "grey.200",
        p: "12px",
        borderRadius: "0px !important",
      }}
    >
      <FlexBox
        flex="0 0 0 !important"
        m={0.75}
        alignItems="center"
        whiteSpace="pre"
      >
        <Typography fontSize="14px" color="grey.600" mr={0.5}>
          Order ID:
        </Typography>
        <Typography fontSize="14px">{order.sessionID}</Typography>
      </FlexBox>
      <FlexBox className="pre" m={0.75} alignItems="center">
        <Typography fontSize="14px" color="grey.600" mr={0.5}>
          Placed on:
        </Typography>
        <Typography fontSize="14px">
          {format(new Date(order.created_at), "dd MMM, yyyy")}
        </Typography>
      </FlexBox>
      <FlexBox className="pre" m={0.75} alignItems="center">
        <Box maxWidth="80px">
          <TextField
            label="Paid"
            placeholder="Paid"
            value={order.paid ? "Yes" : "No"}
          ></TextField>
        </Box>
      </FlexBox>

      <Box maxWidth="160px">
        <TextField
          label="Order Status"
          placeholder="Order Status"
          select
          fullWidth
          disabled={order.refundID}
          defaultValue={orderStatus}
          onChange={(e) => {
            setOrderStatus(e.target.value);
            updateOrder(e.target.value);
          }}
        >
          {orderStatusList.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </TableRow>
  );

  if (!orderStatus || !order) {
    return <LoadingScreen />;
  }

  return (
    <VendorDashboardLayout>
      <DashboardPageHeader
        title="Order Details"
        icon={ShoppingBag}
        button={
          <Link href="/vendor/orders">
            <Button
              color="primary"
              sx={{
                bgcolor: "primary.light",
                px: "2rem",
              }}
            >
              Back to Order List
            </Button>
          </Link>
        }
      />

      <Grid container>
        <OrderDetails
          order={order}
          orderStatus={orderStatus}
          HeaderComponent={Header}
          refundStatus={refundStatus}
        />
        {order.paid && !order.refundID && (
          <Grid container justifyContent="flex-end" spacing={5} mr={5}>
            <Grid item>
              <Typography color="red" fontSize="14px">
                Paid
              </Typography>
            </Grid>
            <Grid item>
              <Button
                disabled={refunding}
                color="primary"
                variant="contained"
                sx={{ float: "right" }}
                onClick={async () => {
                  setRefunding(true);
                  const res = await axios.post(`/refund-order`, {
                    orderID: order.id,
                  });
                  console.log(res.data);
                  await refreshOrders();

                  setRefunding(false);
                }}
              >
                REFUND
              </Button>
            </Grid>
          </Grid>
        )}
        {!order.paid && !order.refundID && (
          <Typography color="red" fontSize="14px">
            NOT Paid
          </Typography>
        )}
      </Grid>
    </VendorDashboardLayout>
  );
};

export default OrderDetailsPage;
