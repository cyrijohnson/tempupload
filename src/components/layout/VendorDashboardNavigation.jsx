import React, { useState, useEffect } from "react";

import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import Assignment from "@mui/icons-material/Assignment";
import Dashboard from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ListAlt from "@mui/icons-material/ListAlt";
import NoteAdd from "@mui/icons-material/NoteAdd";
import Settings from "@mui/icons-material/Settings";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import FlexBox from "components/FlexBox";
import {
  DashboardNavigationWrapper,
  StyledDashboardNav,
} from "./DashboardStyle";

import { useRouter } from "next/router";
import { useProducts } from "contexts/ProductsContext";

const VendorDashboardNavigation = () => {
  const { storeInfo } = useProducts();

  const linkList = [
    {
      href: "/vendor/dashboard",
      title: "Dashboard",
      icon: Dashboard,
    },
    {
      href: "/vendor/static-pages",
      title: "Pages",
      icon: MenuBookIcon,
    },
    {
      href: "/vendor/club-shops",
      title: "Club Shops",
      icon: StoreIcon,
      count: storeInfo?.shops,
    },
    {
      href: "/vendor/brands",
      title: "Brands",
      icon: StoreIcon,
      count: storeInfo?.brands,
    },
    {
      href: "/vendor/categories",
      title: "Categories",
      icon: AlignHorizontalLeftIcon,
      count: storeInfo?.categories,
    },
    {
      href: "/vendor/tags",
      title: "Tags",
      icon: ListAlt,
      count: storeInfo?.tags,
    },
    {
      href: "/vendor/kits",
      title: "Kit builder",
      icon: AccessibilityNewIcon,
    },
    {
      href: "/vendor/vouchers",
      title: "Vouchers",
      icon: CollectionsBookmarkIcon,
      count: storeInfo?.vouchers,
    },
    {
      href: "/vendor/customizations",
      title: "Customizations",
      icon: TextFieldsIcon,
    },
    {
      href: "/vendor/products",
      title: "Products",
      icon: Assignment,
      count: storeInfo?.products,
    },
    {
      href: "/vendor/add-product",
      title: "Add New Product",
      icon: NoteAdd,
    },
    {
      href: "/vendor/attributes",
      title: "Attributes",
      icon: CollectionsBookmarkIcon,
      count: storeInfo?.attributes,
    },
    {
      href: "/vendor/orders",
      title: "Orders",
      icon: ShoppingCart,
      count: storeInfo?.orders,
    },
    // {
    //   href: "/vendor/account-settings",
    //   title: "Account Settings",
    //   icon: Settings,
    // },
  ];

  const { pathname } = useRouter();
  return (
    <DashboardNavigationWrapper
      sx={{
        px: "0px",
        py: "1.5rem",
        color: "grey.900",
      }}
    >
      {linkList.map((item) => (
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
    </DashboardNavigationWrapper>
  );
};
export default VendorDashboardNavigation;
