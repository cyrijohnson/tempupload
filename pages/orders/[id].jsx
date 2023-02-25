import React, { Fragment, useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import ShoppingBag from "@mui/icons-material/ShoppingBag";

import DashboardLayout from "components/layout/CustomerDashboardLayout";
import CustomerDashboardNavigation from "components/layout/CustomerDashboardNavigation";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import OrderDetails from "components/checkout/OrderDetails";
import LoadingScreen from "components/loading-screen";

// Utils
import axios from "utils/axios";
import { useRouter } from "next/router";
import { useOrders } from "contexts/OrdersContext";

const OrderDetailsPage = () => {
  // state management --------------------------------------------------
  const { orders, ordersInitialized } = useOrders();

  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const router = useRouter();

  // fetch order
  const fetchOrder = async (id, pid) => {
    const { data } = await axios.get(`/orders/${id}?pid=${pid}`);
    let ord = data;
    if (ord != null) {
      console.log(ord);
      setOrder(ord);
      setOrderStatus(ord.orderStatus);
    } else {
      const { data } = await axios.get(`/orders/${id}`);
      console.log("data", data);
      setOrder(data);
      setOrderStatus(data.orderStatus);
    }
  };

  useEffect(() => {
    if (!ordersInitialized || !router.isReady) return;
    const { id, pid } = router.query;
    console.log(orders);
    fetchOrder(id, pid);
  }, [orders, router.isReady]);

  if (!orderStatus || !order) {
    return <LoadingScreen />;
  }

  return (
    <DashboardLayout>
      <DashboardPageHeader
        title="Order Details"
        icon={ShoppingBag}
        // button={
        //   <Button
        //     color="primary"
        //     sx={{
        //       bgcolor: "primary.light",
        //       px: "2rem",
        //     }}
        //   >
        //     Order Again
        //   </Button>
        // }
        navigation={<CustomerDashboardNavigation />}
      />
      <OrderDetails order={order} orderStatus={orderStatus} />
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
