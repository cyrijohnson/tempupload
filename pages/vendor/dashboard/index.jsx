import React, { useState, useEffect } from "react";
import VendorAnalyticsChart from "components/dashboard/VendorAnalyticsChart";
import FlexBox from "components/FlexBox";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import { H1, H5, Paragraph } from "components/Typography";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import { Avatar, Card, Grid } from "@mui/material";

// Orders
import { useOrders } from "contexts/OrdersContext";

const VendorDashboard = (props) => {
  const { orders } = useOrders();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (orders) {
      const total = orders.reduce((acc, order) => {
        return acc + order.finalPrice;
      }, 0);
      setTotalEarnings(total.toFixed(2));

      const monthly = orders.reduce((acc, order) => {
        if (
          new Date(order.created_at).getMonth() === new Date().getMonth() &&
          new Date(order.created_at).getFullYear() === new Date().getFullYear()
        ) {
          return acc + order.finalPrice;
        }
      }, 0);
      setMonthlyEarnings(monthly ? monthly.toFixed(2) : 0);

      const pend = 0;
      orders.forEach((order) => {
        if (order.orderStatus == "packaging") {
          pend += 1;
        }
      });
      setPending(pend);
    }
  }, [orders]);

  const cardList = [
    {
      title: "Total Earnings (before taxes)",
      amount: `£${totalEarnings}`,
      subtitle: "after associated vendor fees",
    },
    {
      title: "This Month",
      amount: `£${monthlyEarnings}`,
      subtitle: "Will be reset on the first of each month",
    },
    {
      title: "Pending Orders",
      amount: pending ?? 0,
      subtitle: "Orders awaiting to be sent",
    },
  ];

  return (
    <VendorDashboardLayout>
      <DashboardPageHeader title="Dashboard" icon={ShoppingBag} />

      <h1>COUNTER {props.counter}</h1>
      <Grid container spacing={3}>
        {cardList.map((item, ind) => (
          <Grid item lg={4} md={4} sm={6} xs={12} key={ind}>
            <Card
              sx={{
                textAlign: "center",
                py: "1.5rem",
                height: "100%",
              }}
            >
              <H5 color="grey.600" mb={1}>
                {item.title}
              </H5>
              <H1 color="grey.700" mb={0.5} lineHeight="1.3">
                {item.amount}
              </H1>
              <Paragraph color="grey.600">{item.subtitle}</Paragraph>
            </Card>
          </Grid>
        ))}

        <Grid item lg={8} xs={12}>
          <Card
            sx={{
              p: "20px 30px",
            }}
          >
            <H5 mb={3}>Sales</H5>
            <VendorAnalyticsChart />
          </Card>
        </Grid>

        {/* <Grid item lg={4} xs={12}>
          <Card
            sx={{
              p: "20px 30px",
            }}
          >
            <H5>Top Countries</H5>
            {topCountryList.map((item, ind) => (
              <FlexBox
                alignItems="center"
                justifyContent="space-between"
                my="1rem"
                key={ind}
              >
                <FlexBox alignItems="center">
                  <Avatar
                    src={item.flagUrl}
                    sx={{
                      mr: "8px",
                      height: 30,
                      width: 30,
                    }}
                  />
                  <span>{item.name}</span>
                </FlexBox>
                <H5>${item.amount}</H5>
              </FlexBox>
            ))}
          </Card>
        </Grid> */}
      </Grid>
    </VendorDashboardLayout>
  );
};

// export const getServerSideProps = withAuthServerSideProps();

const topCountryList = [
  {
    name: "United States",
    amount: 130,
    flagUrl:
      "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
  },
  {
    name: "United Kingdom",
    amount: 110,
    flagUrl:
      "http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg",
  },
  {
    name: "Canada",
    amount: 100,
    flagUrl:
      "http://purecatamphetamine.github.io/country-flag-icons/3x2/CA.svg",
  },
  {
    name: "India",
    amount: 80,
    flagUrl:
      "http://purecatamphetamine.github.io/country-flag-icons/3x2/IN.svg",
  },
  {
    name: "Jordan",
    amount: 80,
    flagUrl:
      "http://purecatamphetamine.github.io/country-flag-icons/3x2/JO.svg",
  },
  {
    name: "Brazil",
    amount: 70,
    flagUrl:
      "http://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg",
  },
];
export default VendorDashboard;
