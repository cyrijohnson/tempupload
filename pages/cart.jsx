import { useState } from "react";

// mui
import { Box, Button, Grid, Snackbar, Alert } from "@mui/material";

// custom components
import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import CheckoutNavLayout from "components/layout/CheckoutNavLayout";
import CheckoutSummary2 from "components/checkout/CheckoutSummary2";
import ProductCard7 from "components/product-cards/ProductCard7";
import CustomizerPanel from "components/customizer/CustomizerPanel";

// utils
import Link from "next/link";
import { useCart } from "react-use-cart";
import ctx from "contexts/Customization";

// Orders/Shipping
import { useOrders } from "contexts/OrdersContext";

const Cart = () => {
  const { items } = useCart();
  const { shippingOptions } = useOrders();
  const CustomizationProvider = ctx.useProvider();

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [vouchers, setVouchers] = useState([]);

  const [customizingProduct, setCustomizingProduct] = useState(null);

  const [alert, setAlert] = useState({
    status: "info",
    message: "",
  });

  const selectVoucher = (voucher) => {
    console.log(voucher);
    // if voucher is not in the list, add it
    if (vouchers.find((v) => v.code === voucher.code) === undefined) {
      setVouchers([...vouchers, voucher]);
    }
  };

  return (
    <CheckoutNavLayout>
      <CustomizationProvider>
        <CustomizerPanel
          product={customizingProduct}
          open={customizingProduct != null}
          onClose={() => setCustomizingProduct(null)}
        />

        {!items.length && (
          <FlexBox
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="calc(100vh - 74px)"
          >
            <LazyImage
              src="/assets/images/logos/shopping-bag.svg"
              width={90}
              height={100}
            />
            <Box
              component="p"
              mt={2}
              color="grey.600"
              textAlign="center"
              maxWidth="200px"
            >
              Your cart is empty. Start shopping
            </Box>
          </FlexBox>
        )}

        {items.length > 0 && (
          <Grid container spacing={3}>
            <Grid item lg={8} md={8} xs={12}>
              {items.map((item) => (
                <ProductCard7
                  key={item.id}
                  {...item}
                  onCustomizeClicked={() => setCustomizingProduct(item)}
                />
              ))}
            </Grid>

            <Grid item lg={4} md={4} xs={12}>
              {shippingOptions && (
                <CheckoutSummary2
                  shippingOptions={shippingOptions}
                  onSelectedShipping={setSelectedShipping}
                  selectedShipping={selectedShipping}
                  vouchers={vouchers}
                  selectVoucher={selectVoucher}
                  setAlert={setAlert}
                />
              )}
            </Grid>

            <Grid container justifyContent={"flex-end"} sx={{ my: 3 }}>
              <Grid item sm={4} xs={11}>
                <Link href="/checkout">
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    fullWidth
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={alert.message.length > 0}
          autoHideDuration={3000}
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }

            setAlert({ status: "info", message: "" });
          }}
        >
          <Alert elevation={6} variant="filled" severity={alert.status}>
            {alert.message}
          </Alert>
        </Snackbar>
      </CustomizationProvider>
    </CheckoutNavLayout>
  );
};

const stateList = [
  {
    value: "New York",
    label: "New York",
  },
  {
    value: "Chicago",
    label: "Chicago",
  },
];
export default Cart;
