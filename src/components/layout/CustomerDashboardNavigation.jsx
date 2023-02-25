import FlexBox from "components/FlexBox";
import CustomerService from "components/icons/CustomerService";
import CreditCard from "@mui/icons-material/CreditCard";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Person from "@mui/icons-material/Person";
import Place from "@mui/icons-material/Place";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import {
  DashboardNavigationWrapper,
  StyledDashboardNav,
} from "./DashboardStyle";

// Auth
import useAuth from "contexts/useAuth";

// Orders
import { useOrders } from "contexts/OrdersContext";

const CustomerDashboardNavigation = () => {
  const { user } = useAuth();
  const { orders } = useOrders();

  const linkList = [
    {
      title: "DASHBOARD",
      list: [
        {
          href: "/orders",
          title: "Orders",
          icon: ShoppingBagOutlined,
          count: orders?.length,
        },
        {
          href: "/wish-list",
          title: "Wishlist",
          icon: FavoriteBorder,
          count: user?.wishlist.length,
        },
        // {
        //   href: "/support-tickets",
        //   title: "Support Tickets",
        //   icon: CustomerService,
        //   count: 1,
        // },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      list: [
        {
          href: "/profile",
          title: "Profile Info",
          icon: Person,
        },
        {
          href: "/address",
          title: "Addresses",
          icon: Place,
          count: user?.addresses.length,
        },
        {
          href: "/payment-methods",
          title: "Payment Methods",
          icon: CreditCard,
          count: user?.cards.length,
        },
      ],
    },
  ];

  const { pathname } = useRouter();
  return (
    <DashboardNavigationWrapper
      sx={{
        px: "0px",
        pb: "1.5rem",
        color: "grey.900",
      }}
    >
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="grey.600" fontSize="12px">
            {item.title}
          </Typography>
          {item.list.map((item) => (
            <StyledDashboardNav
              isCurrentPath={pathname.includes(item.href)}
              href={item.href}
              key={item.title}
            >
              <FlexBox alignItems="center">
                <item.icon
                  className="nav-icon"
                  fontSize="small"
                  color="inherit"
                  sx={{
                    mr: "10px",
                  }}
                />

                <span>{item.title}</span>
              </FlexBox>
              <span>{item.count}</span>
            </StyledDashboardNav>
          ))}
        </Fragment>
      ))}
    </DashboardNavigationWrapper>
  );
};

export default CustomerDashboardNavigation;
