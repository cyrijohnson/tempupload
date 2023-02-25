import React, { useEffect, useState } from "react";

// mui
import {
  Badge,
  Box,
  Container,
  Dialog,
  Drawer,
  IconButton,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonOutline from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlined from "components/icons/ShoppingBagOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

//custom components
import FlexBox from "components/FlexBox";
import MiniCart from "components/mini-cart/MiniCart";
import Login from "components/sessions/Login";

// utils
import { layoutConstant } from "utils/constants";
import clsx from "clsx";
import SearchBox from "../search-box/SearchBox"; // component props interface
import { useCart } from "react-use-cart";

// Auth
import useAuth from "contexts/useAuth";

// styled component
export const HeaderWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  height: "100%",
  background: theme.palette.background.paper,
  transition: "height 250ms ease-in-out",
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight,
  },
  backgroundColor: theme.palette.info.main,
  color: theme.palette.info.contrastText,
}));

const Header = ({ isFixed, className }) => {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  // Auth
  const { user, logout } = useAuth();

  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);

  const toggleDialog = () => setDialogOpen(!dialogOpen);

  const { items } = useCart();
  const [cartItems, setCartItems] = useState(0);
  useEffect(() => {
    setCartItems(items.length);
  }, [items]);

  const cartHandle = (
    <Badge badgeContent={cartItems} color="primary">
      <Box
        component={IconButton}
        ml={2.5}
        bgcolor="grey.200"
        p={0.75}
        onClick={() => {
          toggleSidenav();
        }}
      >
        <ShoppingBagOutlined />
      </Box>
    </Badge>
  );

  return (
    <HeaderWrapper className={clsx(className)}>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <FlexBox justifyContent="center" flex="1 1 0">
          <SearchBox />
        </FlexBox>

        <FlexBox
          alignItems="center"
          sx={{
            // display: {
            //   xs: "none",
            //   md: "flex",
            // },
            p: 2,
          }}
        >
          <Box
            component={IconButton}
            ml={2}
            p={0.75}
            bgcolor="grey.200"
            onClick={() => {
              if (user) logout();
              else toggleDialog();
            }}
          >
            {user ? <ExitToAppIcon /> : <PersonOutline />}
          </Box>
          {cartHandle}
        </FlexBox>

        <Dialog
          open={dialogOpen}
          fullWidth={isMobile}
          scroll="body"
          onClose={toggleDialog}
        >
          <Login />
        </Dialog>

        <Drawer open={sidenavOpen} anchor="right" onClose={toggleSidenav}>
          <MiniCart />
        </Drawer>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
