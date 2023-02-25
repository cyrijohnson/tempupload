import { Fragment, useEffect, useState } from "react";

// mui
import {
  Box,
  Divider,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

// custom components
import Card1 from "components/Card1";
import { Span } from "components/Typography";
import FlexBox from "components/FlexBox";
import LoadingScreen from "components/loading-screen";

// utils
import axios from "utils/axios";
import { useOrders } from "contexts/OrdersContext";
import { useCart } from "react-use-cart";
import useStorage from "hooks/useStorage";
import usePrices from "hooks/usePrices";

const CheckoutSummary2 = (props) => {
  const { shippingOptions, taxes, ordersInitialized } = useOrders();
  const { items } = useCart();
  const { getItem, setItem } = useStorage();

  const {
    getSubTotal,
    getTotalPrice,
    getCustomizationsPrice,
    getTotalDiscount,
  } = usePrices();

  const vouchers = getItem("vouchers") || [];
  const shipping = getItem("shipping") || {};

  const [voucherCode, setVoucherCode] = useState("");
  const [selectedShipping, setSelectedShipping] = useState(shipping);

  if (!ordersInitialized) return <LoadingScreen />;

  return (
    <Card1>
      <Box>
        <FlexBox mb={3.5} alignItems="center" justifyContent="space-between">
          <FlexBox alignItems="center">
            <Typography fontSize="20px">Shipping</Typography>
          </FlexBox>
        </FlexBox>

        <TextField
          name="shipping"
          label="Shipping Options"
          defaultValue={selectedShipping.id}
          fullWidth
          select
          onChange={(e) => {
            let ship = shippingOptions.find((s) => s.id == e.target.value);
            setItem("shipping", ship);
            setSelectedShipping(ship);
          }}
        >
          {shippingOptions.map((item) => (
            <MenuItem value={item.id} key={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <Divider sx={{ my: 3 }} />
        <Typography color="secondary.900" fontWeight="700" mb={3}>
          Your order
        </Typography>

        {items.map((item, index) => (
          <Fragment key={index}>
            <FlexBox justifyContent="space-between" alignItems="center" mt={3}>
              <Typography>
                <Span fontWeight="700" fontSize="14px">
                  {item.quantity}
                </Span>{" "}
                x {item.name}
              </Typography>
              <Typography>
                £
                {(
                  (item.discountedPrice ? item.discountedPrice : item.price) *
                  item.quantity
                ).toFixed(2)}
              </Typography>
            </FlexBox>
            {item.customizations &&
              item.customizations.map((c) => (
                <FlexBox
                  justifyContent="space-between"
                  alignItems="center"
                  key={c.id}
                >
                  <Span fontWeight="100" fontSize="12px">
                    {"+ "} {c.name}
                  </Span>
                  <Span fontWeight="100" fontSize="12px">
                    £{(c.price * item.quantity).toFixed(2)}
                  </Span>
                </FlexBox>
              ))}
            {item.customizations && item.customizations.length > 0 && (
              <Span fontWeight="700" fontSize="12px" sx={{ float: "right" }}>
                £{(getCustomizationsPrice(items) * item.quantity).toFixed(2)}
              </Span>
            )}
          </Fragment>
        ))}

        <Divider
          sx={{
            borderColor: "grey.300",
            mt: 3,
            mb: "1.5rem",
          }}
        />

        <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
          <Typography color="grey.600">Subtotal:</Typography>
          <Typography fontWeight="700">
            £{getSubTotal(items).toFixed(2)}
          </Typography>
        </FlexBox>

        <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
          <Typography color="grey.600">Shipping:</Typography>
          <Typography fontWeight="700">
            £
            {vouchers.find((v) => v.isFreeShipping) != null
              ? 0
              : selectedShipping?.cost ?? 0}
            {/* {props.selectedShipping?.name} - £{props.selectedShipping?.cost} */}
          </Typography>
        </FlexBox>

        <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
          <Typography color="grey.600">Tax:</Typography>
          <Typography fontWeight="700">{taxes.percentage}%</Typography>
        </FlexBox>

        <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
          <Typography color="grey.600">Savings:</Typography>
          <Typography fontWeight="700">
            £{getTotalDiscount(items, vouchers).toFixed(2)}
          </Typography>
        </FlexBox>

        <Divider
          sx={{
            borderColor: "grey.300",
            mb: "0.5rem",
            mt: 2,
          }}
        />

        <FlexBox
          fontWeight="700"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography>Total:</Typography>
          <Typography fontWeight="700">
            £{getTotalPrice(items, selectedShipping.cost, vouchers).toFixed(2)}
          </Typography>
        </FlexBox>

        <Divider sx={{ my: 3 }} />

        <TextField
          placeholder="Voucher"
          variant="outlined"
          size="small"
          fullWidth
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            mt: "1rem",
            mb: "30px",
          }}
          onClick={async () => {
            try {
              const res = await axios.post("/check-voucher", {
                voucher: voucherCode,
              });
              if (getItem("vouchers") == null) {
                setItem("vouchers", [res.data]);
              } else {
                if (
                  getItem("vouchers").find((v) => v.code == voucherCode) == null
                ) {
                  setItem("vouchers", [...vouchers, res.data]);
                }
              }
              props.setAlert({
                status: "success",
                message: "Voucher valid!",
              });
            } catch (error) {
              console.log(error);
              props.setAlert({
                status: "error",
                message: "Voucher not valid :(",
              });
            }
          }}
        >
          Apply Voucher
        </Button>
      </Box>
    </Card1>
  );
};

export default CheckoutSummary2;
