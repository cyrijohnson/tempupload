import FlexBox from "components/FlexBox";
import CustomerDashboardNavigation from "components/layout/CustomerDashboardNavigation";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import { Pagination } from "@mui/material";
import React, { Fragment } from "react";
import OrderRow from "./OrderRow"; // component props interface

// Auth
import useAuth from "contexts/useAuth";

// Orders
import { useOrders } from "contexts/OrdersContext";

const CustomerOrderList = () => {
  const { orders } = useOrders();
  const { user } = useAuth();

  return (
    <Fragment>
      <DashboardPageHeader
        title="My Orders"
        icon={ShoppingBag}
        navigation={<CustomerDashboardNavigation />}
      />

      <TableRow
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          padding: "0px 18px",
          background: "none",
        }}
        elevation={0}
      >
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Order #
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Status
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Date purchased
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Total
        </H5>
        <H5
          flex="0 0 0 !important"
          color="grey.600"
          px={2.75}
          py={0.5}
          my={0}
        ></H5>
      </TableRow>

      {user &&
        orders.map((item, ind) => (
          <OrderRow item={item} key={ind} user={user} />
        ))}

      <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={5}
          variant="outlined"
          color="primary"
          onChange={(data) => {
            console.log(data);
          }}
        />
      </FlexBox>
    </Fragment>
  );
};

export default CustomerOrderList;
