import React, { useEffect, useState } from "react";

// mui
import { Box } from "@mui/system";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// custom components
import Card1 from "components/Card1";
import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import { H6, Paragraph } from "components/Typography";
import NewAddressForm from "./NewAddressForm";
import EditAddressForm from "./EditAddressForm"; // date types

// hooks
import { useRouter } from "next/router";

// Auth
import useAuth from "contexts/useAuth";

// Orders/Shipping
import { useOrders } from "contexts/OrdersContext";

// utils
import { Formik } from "formik";
import * as yup from "yup";
import axios from "utils/axios";
import LoadingScreen from "components/loading-screen";
import { useCart } from "react-use-cart";

var creditCardType = require("credit-card-type");

const CheckoutForm2 = (props) => {
  const { user } = useAuth();
  const { items } = useCart();

  const [hasVoucher, setHasVoucher] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState("");
  // const [dateList, setDateList] = useState([]);
  const router = useRouter();

  const { shippingOptions } = useOrders();

  const [attemptingPayment, setAttemptingPayment] = useState(false);

  useEffect(() => {
    if (items.length == 0) router.push("/");
  }, [items]);

  // useEffect(() => {
  //   console.log(shippingOptions);
  // }, [shippingOptions]);

  const handleFormSubmit = async (values) => {
    console.log(values);
    // // delivery date
    // let deliveryDate = {
    //   date: values.date,
    //   time: values.time,
    // };
    // billing info
    let address = addressData.find((item) => item.address === values.address);
    // credit card
    let card = paymentMethodList.find((item) => item.number === values.card);
    card.cvc = values.cardCVC;

    const info = {
      cart: items,
      billing: address,
      // delivery: deliveryDate,
      card,
      shippingOptions: props.selectedShipping,
      vouchers: props.vouchers,
    };

    try {
      setAttemptingPayment(true);
      let res = await axios.post("/orders", info);
      setAttemptingPayment(false);
      router.push(`/orders/${res.data.id}?pid=${res.data.sessionID}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFieldValueChange = (value, fieldName, setFieldValue) => () => {
    setFieldValue(fieldName, value);
  };

  const toggleHasVoucher = () => {
    setHasVoucher((has) => !has);
  };

  // addresses ---------------------------------------------------------------
  const [addressData, setAddressData] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  // load initial data if present
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await axios.get("/locations");
        setAddressData(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user) loadData();
  }, [user]);
  // update addresses when they change
  useEffect(() => {
    if (newAddress !== "") {
      if (!addressData.find((item) => item.address === newAddress)) {
        setAddressData([newAddress, ...addressData]);
      }
    }
  }, [newAddress]);

  const deleteAddress = (name, id) => {
    if (!user) {
      const toDelete = addressData.find((address) => address.name === name);
      axios.delete(`/locations/${toDelete.id}`);
      const newArr = addressData.filter((item) => item.name !== name);
      setAddressData(newArr);
    } else {
      const toDelete = addressData.find((address) => address.id === id);
      axios.delete(`/locations/${toDelete.id}`);
      const newArr = addressData.filter((item) => item.id !== id);
      setAddressData(newArr);
    }
  };

  const [openEditForm, setOpenEditForm] = useState(false);
  const [selected, setSelected] = useState(false);

  const editHandler = (value) => {
    const data = addressData.find((item) => item.name === value);
    setSelected(data);
    openEditForm ? setOpenEditForm(false) : setOpenEditForm(true);
  };

  // credit cards ------------------------------------------------------------
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  // load initial data if present
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await axios.get("/cards");
        setPaymentMethodList(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user) loadData();
  }, [user]);
  // update cards when they change
  useEffect(() => {
    if (newPaymentMethod !== "") {
      if (!paymentMethodList.find((item) => item.number === newPaymentMethod)) {
        setPaymentMethodList([newPaymentMethod, ...paymentMethodList]);
      }
    }
  }, [newPaymentMethod]);

  const deletePaymentMethod = (number) => {
    const toDelete = paymentMethodList.find(
      (paymentMethod) => paymentMethod.number === number
    );
    if (user) axios.delete(`/cards/${toDelete.id}`);
    const newArr = paymentMethodList.filter((item) => item.number !== number);
    setPaymentMethodList(newArr);
  };

  // vouchers ---------------------------------------------------------------

  if (items.length == 0) return <LoadingScreen />;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={checkoutSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card1
            sx={{
              mb: "1.5rem",
            }}
          >
            <FlexBox
              mb={3.5}
              alignItems="center"
              justifyContent="space-between"
            >
              <FlexBox alignItems="center">
                <Avatar
                  sx={{
                    backgroundColor: "primary.main",
                    color: "primary.text",
                    mr: "0.875rem",
                    height: 32,
                    width: 32,
                  }}
                >
                  1
                </Avatar>
                <Typography fontSize="20px">Delivery Address</Typography>
              </FlexBox>

              <NewAddressForm setNewAddress={setNewAddress} />
            </FlexBox>

            <Typography mb={1.5}>Delivery Address</Typography>
            <Grid container spacing={3}>
              {addressData.map((item, ind) => (
                <Grid item md={4} sm={6} xs={12} key={ind}>
                  <Card
                    sx={{
                      backgroundColor: "grey.100",
                      p: "1rem",
                      position: "relative",
                      boxShadow: "none",
                      border: "1px solid",
                      cursor: "pointer",
                      borderColor:
                        item.address === values.address
                          ? "primary.main"
                          : "transparent",
                    }}
                    onClick={handleFieldValueChange(
                      item.address,
                      "address",
                      setFieldValue
                    )}
                  >
                    <FlexBox
                      justifyContent="flex-end"
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                      }}
                    >
                      {selected && (
                        <EditAddressForm
                          openEditForm={openEditForm}
                          setOpenEditForm={setOpenEditForm}
                          selected={selected}
                          addressData={addressData}
                          setAddressData={setAddressData}
                        />
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          mr: 1,
                        }}
                        onClick={() => editHandler(item.name)}
                      >
                        <ModeEditOutlineIcon
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteAddress(item.name, item?.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteOutlineIcon
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                    </FlexBox>
                    <H6 mb={0.5}>{item.name}</H6>
                    <Paragraph color="grey.700">{item.street1}</Paragraph>
                    {item.street2 && (
                      <Paragraph color="grey.700">{item.address2}</Paragraph>
                    )}
                    <Paragraph color="grey.700">{item.phone}</Paragraph>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card1>

          <Card1
            sx={{
              mb: "1.5rem",
            }}
          >
            <FlexBox
              mb={3.5}
              alignItems="center"
              justifyContent="space-between"
            >
              <FlexBox alignItems="center">
                <Avatar
                  sx={{
                    backgroundColor: "primary.main",
                    color: "primary.text",
                    mr: "0.875rem",
                    height: 32,
                    width: 32,
                  }}
                >
                  2
                </Avatar>
                <Typography fontSize="20px">Shipping</Typography>
              </FlexBox>
            </FlexBox>

            <Typography mb={1.5}>Shipping Options</Typography>
            <Grid container spacing={3}>
              <Grid item md={6} sm={12}>
                <TextField
                  name="shipping"
                  label="Shipping Options"
                  value={values.shipping}
                  defaultValue=""
                  error={!!touched.shipping && !!errors.shipping}
                  helperText={touched.shipping && errors.shipping}
                  fullWidth
                  select
                  onChange={(e) => {
                    let ship = shippingOptions.find(
                      (s) => s.id == e.target.value
                    );
                    setFieldValue("shipping", e.target.value);
                    props.onSelectShipping(ship);
                  }}
                >
                  {shippingOptions.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Card1>

          <Card1
            sx={{
              mb: "1.5rem",
            }}
          >
            <FlexBox alignItems="center" mb={3.5}>
              <Avatar
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.text",
                  mr: "0.875rem",
                  height: 32,
                  width: 32,
                }}
              >
                3
              </Avatar>
              <Typography fontSize="20px">Payment Details</Typography>
            </FlexBox>

            <Box mb={3.5}>
              <Typography mb={1.5}>Enter Card Information</Typography>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="cardHolderName"
                    label="Enter Your Name"
                    type="text"
                    value={values.cardHolderName}
                    error={!!touched.cardHolderName && !!errors.cardHolderName}
                    helperText={touched.cardHolderName && errors.cardHolderName}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    type="number"
                    name="cardNumber"
                    label="Enter Your Card Number"
                    value={values.cardNumber}
                    error={!!touched.cardNumber && !!errors.cardNumber}
                    helperText={touched.cardNumber && errors.cardNumber}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <TextField
                      type="number"
                      name="cardMonth"
                      label="Expire Card Month"
                      value={values.cardMonth}
                      defaultValue=""
                      error={!!touched.cardMonth && !!errors.cardMonth}
                      helperText={touched.cardMonth && errors.cardMonth}
                      fullWidth
                      select
                      onChange={handleChange}
                    >
                      {months.map((item) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      type="number"
                      name="cardYear"
                      label="Expire Card Year"
                      value={values.cardYear}
                      defaultValue=""
                      error={!!touched.cardYear && !!errors.cardYear}
                      helperText={touched.cardYear && errors.cardYear}
                      fullWidth
                      select
                      onChange={handleChange}
                      sx={{
                        mx: 3,
                      }}
                    >
                      {years.map((item) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
              </Grid>
              <Button
                sx={{ mt: 4 }}
                fullWidth
                color="primary"
                variant="outlined"
                disabled={
                  values.cardHolderName === "" ||
                  values.cardNumber.toString() === "" ||
                  values.cardMonth === "" ||
                  values.cardYear === ""
                }
                onClick={() => {
                  let number = values.cardNumber.toString();

                  let month = months.indexOf(values.cardMonth) + 1;

                  const newCard = {
                    nameOnCard: values.cardHolderName,
                    number,
                    expireDate: `${month}/${values.cardYear}`,
                    user: user?.id,
                  };

                  // save card to the database
                  if (creditCardType(number)[0].type != undefined)
                    axios.post("/cards", newCard);

                  // add card to state
                  setNewPaymentMethod(newCard);

                  // set all values to empty
                  setFieldValue("cardHolderName", "");
                  setFieldValue("cardNumber", "");
                  setFieldValue("cardMonth", "");
                  setFieldValue("cardYear", "");
                }}
              >
                Add New Card
              </Button>
              {/* <FormControlLabel
                sx={{
                  mt: 1,
                }}
                control={<Checkbox />}
                label="Save this card"
              /> */}
            </Box>
            <Box>
              <Typography mb={1.5}>Saved Cards</Typography>
              <Grid container spacing={3}>
                {paymentMethodList.map((item, index) => (
                  <Grid item md={4} sm={6} xs={12} key={index}>
                    <Card
                      sx={{
                        backgroundColor: "grey.100",
                        p: "1rem",
                        position: "relative",
                        boxShadow: "none",
                        border: "1px solid",
                        cursor: "pointer",
                        borderColor:
                          item.number === values.card
                            ? "primary.main"
                            : "transparent",
                      }}
                      onClick={handleFieldValueChange(
                        item.number,
                        "card",
                        setFieldValue
                      )}
                    >
                      <FlexBox
                        justifyContent="flex-end"
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                        }}
                      >
                        <IconButton
                          onClick={() => deletePaymentMethod(item.number)}
                          color="error"
                          size="small"
                        >
                          <DeleteOutlineIcon
                            sx={{
                              fontSize: 20,
                            }}
                          />
                        </IconButton>
                      </FlexBox>
                      <Box
                        height="24px"
                        width="36px"
                        position="relative"
                        mb={1}
                      >
                        <LazyImage
                          src={`/assets/images/payment-methods/${
                            creditCardType(item.number)[0]?.niceType
                          }.svg`}
                          layout="fill"
                          objectFit="contain"
                        />
                      </Box>

                      <Paragraph color="grey.700">
                        **** **** ****{" "}
                        {item.number
                          .toString()
                          .substring(item.number.toString().length - 4)}
                      </Paragraph>
                      <Paragraph color="grey.700">{item.nameOnCard}</Paragraph>
                    </Card>
                  </Grid>
                ))}
                <FlexBox justifyContent="flex-end" sx={{ width: "100%" }}>
                  <TextField
                    sx={{
                      mt: 4,
                    }}
                    type="number"
                    name="cardCVC"
                    label="CVC/CVV"
                    error={!!touched.cardCVC && !!errors.cardCVC}
                    helperText={touched.cardCVC && errors.cardCVC}
                    onChange={handleChange}
                  />
                </FlexBox>
              </Grid>
            </Box>

            <Button
              sx={{
                color: "primary.main",
                mt: "1.5rem",
                lineHeight: 1,
              }}
              onClick={toggleHasVoucher}
            >
              I have a voucher
            </Button>

            {hasVoucher && (
              <FlexBox mt={3} maxWidth="400px">
                {voucherMessage.length > 0 && (
                  <Grid container alignItems={"center"} sx={{ width: "3em" }}>
                    {voucherMessage == "success" ? (
                      <CheckCircleIcon sx={{ color: "green" }} />
                    ) : (
                      <CancelIcon sx={{ color: "red" }} />
                    )}
                  </Grid>
                )}
                <TextField
                  name="voucher"
                  placeholder="Enter voucher code here"
                  fullWidth
                  value={values.voucher || ""}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  sx={{
                    ml: "1rem",
                  }}
                  onClick={async () => {
                    try {
                      const res = await axios.post("/check-voucher", {
                        voucher: values.voucher,
                      });
                      props.onSelectVoucher(res.data);
                      setVoucherMessage("success");
                    } catch (error) {
                      setVoucherMessage("error");
                    }
                    //   setTimeout(() => {
                    //     setVoucherMessage("");
                    //   }, 1000);
                  }}
                >
                  Apply
                </Button>
              </FlexBox>
            )}

            <Button
              disabled={attemptingPayment}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mt: "1.5rem",
              }}
            >
              Place Order
            </Button>
          </Card1>
        </form>
      )}
    </Formik>
  );
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function generateArrayOfYears() {
  var min = new Date().getFullYear();
  var max = min + 9;
  var years = [];

  for (var i = min; i <= max; i++) {
    years.push(i);
  }

  return years;
}

const years = generateArrayOfYears();
const initialValues = {
  card: "",
  date: "",
  shipping: "",
  time: "",
  address: "",
  voucher: "",
  cardHolderName: "",
  cardNumber: "",
  // cardMonth: "",
  // cardYear: "",
  cardCVC: "",
};
const checkoutSchema = yup.object().shape({
  card: yup.string().required("required"),
  // date: yup.string().required("required"),
  // time: yup.string().required("required"),
  shipping: yup.string().required("required"),
  address: yup.string().required("required"),
  // cardHolderName: yup.string().required("required"),
  // cardNumber: yup.number().required("required"),
  // cardMonth: yup.string().required("required"),
  // cardYear: yup.number().required("required"),
  cardCVC: yup.number().required("required"),
  voucher: yup.string(),
});
export default CheckoutForm2;
