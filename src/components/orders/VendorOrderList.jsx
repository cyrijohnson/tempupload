import React, { useState, Fragment, useEffect } from "react";
import FlexBox from "components/FlexBox";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";
import { Button, Pagination } from "@mui/material";
import OrderRow from "./OrderRow"; // component props interface

// Auth
import useAuth from "contexts/useAuth";

// Orders
import { useOrders } from "contexts/OrdersContext";

const VendorOrderList = () => {
  const { orders } = useOrders();
  const { user } = useAuth();

  const [ords, setOrds] = useState(orders);

  useEffect(() => {
    setOrds(orders);
  }, [orders]);

  // pagination
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  return (
    <Fragment>
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
        <H5
          color="grey.600"
          my="0px"
          mx={0.75}
          textAlign="left"
          onClick={() => {
            // sort orders by order status
            const sorted = [...ords].sort((a, b) => {
              if (a.orderStatus < b.orderStatus) return -1;
              if (a.orderStatus > b.orderStatus) return 1;
              return 0;
            });
            setOrds(sorted);
          }}
        >
          Status
        </H5>
        <H5
          color="grey.600"
          my="0px"
          mx={0.75}
          textAlign="left"
          onClick={() => {
            // sort orders by order date
            const sorted = [...ords].sort((a, b) => {
              if (
                new Date(a.created_at).getTime() <
                new Date(b.created_at).getTime()
              )
                return 1;
              if (
                new Date(a.created_at).getTime() >
                new Date(b.created_at).getTime()
              )
                return -1;
              return 0;
            });
            setOrds(sorted);
          }}
        >
          Date purchased
        </H5>
        <H5
          color="grey.600"
          my="0px"
          mx={0.75}
          textAlign="left"
          onClick={() => {
            // sort orders by order total
            const sorted = [...ords].sort((a, b) => {
              if (a.finalPrice < b.finalPrice) return -1;
              if (a.finalPrice > b.finalPrice) return 1;
              return 0;
            });
            setOrds(sorted);
          }}
        >
          Total
        </H5>
        <H5
          color="grey.600"
          textAlign="left"
          my="0px"
          mx={0.75}
          onClick={() => {
            // sort orders if they are paid
            const sorted = [...ords].sort((a, b) => {
              if (a.paid && !b.paid) {
                return -1;
              }
              if (b.paid && !a.paid) {
                return 1;
              }
              return 0;
            });
            setOrds(sorted);
          }}
        >
          Paid
        </H5>
        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} my="0px"></H5>
      </TableRow>

      {ords.map((item, ind) => (
        <OrderRow item={item} key={ind} user={user} />
      ))}

      <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={5}
          variant="outlined"
          color="primary"
          page={page}
          onChange={handleChange}
        />
      </FlexBox>
    </Fragment>
  );
};

export default VendorOrderList;
