import React, { Fragment, useState, useEffect } from "react";

import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import Done from "@mui/icons-material/Done";

import FlexBox from "components/FlexBox";
import Delivery from "components/icons/Delivery";
import CreditCardVerified from "components/icons/CreditCardVerified";
import PackageBox from "components/icons/PackageBox";
import TruckFilled from "components/icons/TruckFilled";
import TableRow from "components/TableRow";
import { H5, H3, H6, Paragraph, Span } from "components/Typography";
import LoadingScreen from "components/loading-screen";
import Card1 from "components/Card1";

// Utils
import axios from "utils/axios";
import usePrices from "hooks/usePrices";
import { format } from "date-fns";
import { SERVER_URL } from "constant";

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

const OrderDetails = ({
  order,
  orderStatus,
  refundStatus,
  HeaderComponent = null,
}) => {
  const { getTotalPrice, getItemCustomizationsPrice } = usePrices();
  // state management --------------------------------------------------
  const [paying, setPaying] = useState(false);

  const orderStatusList = [
    "packaging",
    "shipping",
    "delivering",
    "complete",
    "cancelled",
  ];
  const stepIconList = [CreditCardVerified, PackageBox, TruckFilled, Delivery];
  const statusIndex = orderStatusList.indexOf(orderStatus);

  if (!orderStatus || !order) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ p: "2em" }}>
      <Card
        sx={{
          p: "2rem 1.5rem",
          mb: "30px",
        }}
      >
        <StyledFlexbox>
          {stepIconList.map((Icon, ind) => (
            <Fragment key={ind}>
              <Box position="relative">
                <Avatar
                  sx={{
                    height: 64,
                    width: 64,
                    bgcolor: ind <= statusIndex ? "primary.main" : "grey.300",
                    color: ind <= statusIndex ? "grey.white" : "primary.main",
                  }}
                >
                  <Icon
                    color="inherit"
                    sx={{
                      fontSize: "32px",
                    }}
                  />
                </Avatar>
                {ind < statusIndex && (
                  <Box position="absolute" right="0" top="0">
                    <Avatar
                      sx={{
                        height: 22,
                        width: 22,
                        bgcolor: "grey.200",
                        color: "success.main",
                      }}
                    >
                      <Done
                        color="inherit"
                        sx={{
                          fontSize: "1rem",
                        }}
                      />
                    </Avatar>
                  </Box>
                )}
              </Box>
              {ind < stepIconList.length - 1 && (
                <Box
                  className="line"
                  bgcolor={ind < statusIndex ? "primary.main" : "grey.300"}
                />
              )}
            </Fragment>
          ))}
        </StyledFlexbox>
      </Card>

      <Card
        sx={{
          p: "0px",
          mb: "30px",
        }}
      >
        {HeaderComponent == null && (
          <TableRow
            sx={{
              bgcolor: "grey.200",
              p: "12px",
              boxShadow: "none",
              borderRadius: 0,
            }}
          >
            <FlexBox className="pre" m={0.75} alignItems="center">
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
                {format(new Date(order.created_at), "MMM dd, yyyy")}
              </Typography>
            </FlexBox>
            {order.orderStatus == "complete" && (
              <FlexBox className="pre" m={0.75} alignItems="center">
                <Typography fontSize="14px" color="grey.600" mr={0.5}>
                  Delivered on:
                </Typography>
                <Typography fontSize="14px">
                  {format(new Date(order.updated_at), "MMM dd, yyyy")}
                </Typography>
              </FlexBox>
            )}
          </TableRow>
        )}

        {HeaderComponent != null && <HeaderComponent />}

        <Box py={1}>
          {order.orderItems.map((item, index) => (
            <Grid px={2} py={1} container alignItems="center" key={index}>
              <Grid item xs={12}>
                <h2>Product</h2>
              </Grid>
              <FlexBox flex="2 2 260px" m={0.75} alignItems="center">
                <Avatar
                  variant="rounded"
                  src={SERVER_URL + item.image.url}
                  sx={{
                    height: 128,
                    width: 128,
                  }}
                />
                <Box ml={2.5}>
                  <H3 my="0px">{item.name}</H3>
                  <Typography fontSize="22px" color="grey.600">
                    ${item.price} x {item.quantity}
                  </Typography>
                </Box>
              </FlexBox>
              <FlexBox flex="1 1 260px" m={0.75} alignItems="center">
                <Typography fontSize="22px" color="grey.600">
                  {item.sku}
                </Typography>
              </FlexBox>

              {item.customizations && item.customizations.length > 0 && (
                <>
                  {/* <FlexBox flex="160px" m={0.75} alignItems="center">
                <Button variant="text" color="primary">
                  <Typography fontSize="14px">Write a Review</Typography>
                </Button>
              </FlexBox> */}
                  <Grid item xs={12}>
                    <h3>
                      Customizations: £
                      {(
                        getItemCustomizationsPrice(item) * item.quantity
                      ).toFixed(2)}
                    </h3>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    container
                    spacing={3}
                    justifyContent="center"
                  >
                    {item.customizations &&
                      item.customizations.map((c) => (
                        <Grid key={c.id} container item xs={8} md={4}>
                          <Card1 style={{ width: "100%" }}>
                            <Grid container>
                              <Grid
                                container
                                justifyContent="space-between"
                                sx={{ height: 100 }}
                                alignItems="space-evenly"
                              >
                                {c.type !== "image" && (
                                  <Grid item xs={1}>
                                    <Avatar
                                      src={SERVER_URL + c.image.url}
                                      sx={{
                                        bgcolor: c.color || "#fff",
                                        height: 64,
                                        width: 64,
                                      }}
                                    />
                                  </Grid>
                                )}
                                {c.type === "image" && (
                                  <Grid item xs={1}>
                                    <Tooltip title="Download" placement="top">
                                      <Avatar
                                        src={SERVER_URL + c.image.url}
                                        sx={{
                                          height: 64,
                                          width: 64,
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          // open the image in a new tab
                                          window.open(
                                            SERVER_URL + c.image.url,
                                            "_blank"
                                          );
                                        }}
                                      />
                                    </Tooltip>
                                  </Grid>
                                )}
                                <Grid item xs={7} container>
                                  <Grid item xs={12}>
                                    <Grid item xs={12}>
                                      <Span fontWeight="600" fontSize="18px">
                                        {c.name}
                                      </Span>
                                    </Grid>
                                    <Grid item xs={12}>
                                      {c.content && (
                                        <Chip
                                          label={c.content}
                                          variant="outlined"
                                        />
                                      )}
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Span
                                      fontWeight="100"
                                      fontSize="12px"
                                      sx={{ float: "right" }}
                                    >
                                      £{c.price.toFixed(2)}
                                    </Span>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                              <Grid item xs={12} container alignItems="center">
                                <Span fontWeight="300" fontSize="15px">
                                  Position: {c.area}
                                </Span>
                              </Grid>
                            </Grid>
                          </Card1>
                        </Grid>
                      ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ mt: 4 }} />
                  </Grid>
                </>
              )}
            </Grid>
          ))}
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item lg={6} md={6} xs={12}>
          <Card
            sx={{
              p: "20px 30px",
            }}
          >
            <H5 mt={0} mb={2}>
              Shipping To:
            </H5>
            <Paragraph fontSize="16px" my="0px">
              <b>{order.location.name}</b>
            </Paragraph>
            <Paragraph fontSize="14px" my="0px">
              {order.location.address} {order.location.address2}
            </Paragraph>
            <Paragraph fontSize="14px" my="0px">
              {order.location.city} {order.location.state}
            </Paragraph>
          </Card>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <Card
            sx={{
              p: "20px 30px",
            }}
          >
            <H5 mt={0} mb={2}>
              Total Summary
            </H5>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Subtotal:
              </Typography>
              <H6 my="0px">£{order.finalPrice}</H6>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Shipping fee:
              </Typography>
              <H6 my="0px">£{order.shipping.cost}</H6>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Taxes:
              </Typography>
              <H6 my="0px">{order.tax.percentage}%</H6>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Discount:
              </Typography>
              <H6 my="0px">
                {order.discounts.reduce((acc, curr) => {
                  return acc + curr.percentage;
                }, 0)}
                %
              </H6>
            </FlexBox>

            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Vouchers:
              </Typography>
              <H6 my="0px">
                {order.vouchers.reduce((acc, curr) => {
                  return acc + curr.percentage;
                }, 0)}
                %
              </H6>
            </FlexBox>

            <Divider
              sx={{
                mb: "0.5rem",
              }}
            />

            <FlexBox justifyContent="space-between" alignItems="center" mb={2}>
              <H6 my="0px">Total</H6>
              <H6 my="0px">
                £
                {getTotalPrice(
                  order.orderItems,
                  order.shipping.cost,
                  order.vouchers
                ).toFixed(2)}
              </H6>
            </FlexBox>
            {order.refundID && (
              <Typography color="red" fontSize="14px">
                {`Refund Status: ${refundStatus}`}
              </Typography>
            )}

            {!order.paid && !order.refundID && (
              <Button
                disabled={paying}
                color="primary"
                variant="contained"
                style={{ float: "right" }}
                onClick={async () => {
                  setPaying(true);
                  const res = await axios.post(`/pay-order`, {
                    orderID: order.id,
                  });
                  console.log(res.data);
                  await refreshOrders();

                  setPaying(false);
                }}
              >
                PAY NOW
              </Button>
            )}
            {order.paid && (
              <Typography fontSize="14px">Paid by Credit/Debit Card</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
