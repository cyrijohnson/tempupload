import React, { useEffect, useState } from "react";

// mui
import { Box, Container, MenuItem, styled } from "@mui/material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ChevronRight from "@mui/icons-material/ChevronRight";

// custom components
import BazarButton from "components/BazarButton";
import BazarCard from "components/BazarCard";
import CategoryMenu from "components/categories/CategoryMenu";
import FlexBox from "components/FlexBox";
import Category from "components/icons/Category";
import NavLink from "components/nav-link/NavLink";
import { Paragraph } from "components/Typography";

// utils
import axios from "utils/axios";
import { useProducts } from "contexts/ProductsContext";

// const common css style
const navLinkStyle = {
  cursor: "pointer",
  marginRight: "2rem",
  transition: "color 150ms ease-in-out",
  "&:hover": {
    color: "secondary.main",
  },
  "&:last-child": {
    marginRight: "0",
  },
  fontSize: "1.2em",
  fontWeight: "bold",
}; // style components

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  ...navLinkStyle,
  color: theme.palette.info.contrastText,
}));
const ParentNav = styled(Box)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.info.main,
    "& > .parent-nav-item": {
      display: "block",
    },
  },
}));
const ParentNavItem = styled(Box)(() => ({
  display: "none",
  position: "absolute",
  top: 0,
  left: "100%",
  zIndex: 5,
}));
const NavBarWrapper = styled(BazarCard)(({ theme }) => ({
  display: "block",
  position: "relative",
  height: "100%",
  width: "70%",
  borderRadius: "0px",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  backgroundColor: theme.palette.info.main,
  color: theme.palette.info.contrastText,
}));
const InnerContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
}));
const CategoryMenuButton = styled(BazarButton)(({ theme }) => ({
  width: "278px",
  height: "40px",
  px: "1rem",
  backgroundColor: theme.palette.secondary.light,
}));

const Navbar = ({ navListOpen, hideCategories }) => {
  const { categories, brands } = useProducts();

  const [navigations, setNavigations] = useState([]);

  const [pages, setPages] = useState([]);

  const loadData = async (route, attribute) => {
    let res = await axios.get(route);
    let menu = res.data.map((item) => {
      return {
        title: item.name,
        url: `/static/${item[attribute]}`,
      };
    });
    return menu;
  };

  const setupSearch = (array, attribute, route) => {
    let menu = array.map((item) => {
      return {
        title: item.name,
        url: `${route}${item[attribute]}`,
      };
    });
    return menu;
  };

  const setupNavigationMenu = (navigation, title, menu) => {
    let navs = navigation.filter((item) => item.title !== title);
    navs = [
      ...navs,
      {
        title: title,
        child: menu,
      },
    ];
    return navs;
  };

  useEffect(() => {
    async function setup() {
      let nav = [];
      let menu = [];
      // fetch and setup brands ---------------------------------------------------
      menu = setupSearch(brands, "name", "/product/search?brand=");
      nav = setupNavigationMenu(nav, "Brands", menu);

      // fetch and setup pages ---------------------------------------------------
      menu = await loadData("/pages", "slug");
      setPages(menu);
      nav = setupNavigationMenu(nav, "Pages", menu);

      // setup categories ---------------------------------------------------------
      menu = setupSearch(categories, "name", "/product/search?category=");
      nav = setupNavigationMenu(nav, "Categories", menu);

      setNavigations(nav);
    }

    setup();
  }, [categories]);

  const renderNestedNav = (list, isRoot = false) => {
    return list?.map((nav) => {
      if (isRoot) {
        if (nav.url && nav.extLink)
          return (
            <StyledNavLink
              href={nav.url}
              key={nav.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nav.title.toUpperCase()}
            </StyledNavLink>
          );
        else if (nav.url)
          return (
            <StyledNavLink href={nav.url} key={nav.title}>
              {nav.title}
            </StyledNavLink>
          );
        if (nav.child)
          return (
            <FlexBox
              position="relative"
              flexDirection="column"
              alignItems="center"
              key={nav.title}
              sx={{
                "&:hover": {
                  "& > .child-nav-item": {
                    display: "block",
                  },
                },
              }}
            >
              <Box sx={navLinkStyle}>{nav.title.toUpperCase()}</Box>
              <Box
                className="child-nav-item"
                sx={{
                  display: "none",
                  position: "absolute",
                  left: 0,
                  top: "100%",
                  zIndex: 5,
                }}
              >
                <BazarCard
                  sx={{
                    mt: "1.25rem",
                    py: "0.5rem",
                    minWidth: "230px",
                  }}
                  elevation={3}
                >
                  {renderNestedNav(nav.child)}
                </BazarCard>
              </Box>
            </FlexBox>
          );
      } else {
        if (nav.url)
          return (
            <NavLink href={nav.url} key={nav.title}>
              <MenuItem>{nav.title}</MenuItem>
            </NavLink>
          );
        if (nav.child)
          return (
            <ParentNav position="relative" minWidth="230px" key={nav.title}>
              <MenuItem color="grey.700">
                <Box flex="1 1 0" component="span">
                  {nav.title}
                </Box>
                <ArrowRight fontSize="small" />
              </MenuItem>
              <ParentNavItem className="parent-nav-item" pl={1}>
                <BazarCard
                  sx={{
                    py: "0.5rem",
                    minWidth: "230px",
                  }}
                  elevation={3}
                >
                  {renderNestedNav(nav.child)}
                </BazarCard>
              </ParentNavItem>
            </ParentNav>
          );
      }
    });
  };

  return (
    <NavBarWrapper elevation={0} hoverEffect={false}>
      {!hideCategories ? (
        <InnerContainer>
          <CategoryMenu open={navListOpen}>
            <CategoryMenuButton variant="text">
              <Category fontSize="small" />
              <Paragraph
                fontWeight="600"
                textAlign="left"
                flex="1 1 0"
                ml={1.25}
                color="grey.600"
              >
                Categories
              </Paragraph>
              <ChevronRight className="dropdown-icon" fontSize="small" />
            </CategoryMenuButton>
          </CategoryMenu>
          <FlexBox>{renderNestedNav(navigations, true)}</FlexBox>
        </InnerContainer>
      ) : (
        <InnerContainer
          sx={{
            justifyContent: "space-evenly",
          }}
        >
          <FlexBox>
            {" "}
            <StyledNavLink href="/product/search" key={"search-key"}>
              {"SHOP"}
            </StyledNavLink>
            {renderNestedNav(navigations, true)}
          </FlexBox>
        </InnerContainer>
      )}
    </NavBarWrapper>
  );
};

export default Navbar;
