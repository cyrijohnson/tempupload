import React, { useState, useEffect } from "react";
import Card1 from "components/Card1";
import CustomerDashboardLayout from "components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import CreditCard from "@mui/icons-material/CreditCard";
import { Button, Grid, TextField, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import * as yup from "yup";
import axios from "utils/axios";

// Auth
import useAuth from "contexts/useAuth";

var creditCardType = require("credit-card-type");

const PaymentMethodEditor = () => {
  const { user, refreshUser } = useAuth();

  const {
    query: { id },
  } = useRouter();

  const router = useRouter();

  const handleFormSubmit = async (values) => {
    await saveCardDetails(values);
  };

  const [selectedCard, setSelectedCard] = useState(null);

  const initialValues = {
    nameOnCard: selectedCard?.nameOnCard,
    cardNumber: "",
    cardMonth: "",
    cardYear: "",
  };

  const loadCardDetails = async (id) => {
    try {
      const { data } = await axios.get(`/cards/${id}`);
      console.log(data);
      setSelectedCard(data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveCardDetails = async (values) => {
    console.log(values);
    try {
      let number = values.cardNumber.toString();
      let month = months.indexOf(values.cardMonth) + 1;

      const newCard = {
        nameOnCard: values.nameOnCard,
        number,
        expireDate: `${month}/${values.cardYear}`,
        user: user.id,
      };

      // save card to the database
      if (creditCardType(number)[0].type != undefined) {
        if (id === "add") {
          axios.post("/cards", newCard);
          refreshUser();
          router.push("/payment-methods");
        } else {
          await axios.put(`/cards/${id}`, newCard);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      const card = loadCardDetails(id);
      setSelectedCard(card);
    }
  }, [id]);

  return (
    <CustomerDashboardLayout>
      <DashboardPageHeader
        icon={CreditCard}
        title={`${id === "add" ? "Add New" : "Edit"} Payment Method`}
        button={
          <Link href="/payment-methods">
            <Button
              color="primary"
              sx={{
                bgcolor: "primary.light",
                px: "2rem",
              }}
            >
              Back to Payment Methods
            </Button>
          </Link>
        }
      />

      <Card1>
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
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box mb={4}>
                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      name="nameOnCard"
                      label="Enter Your Name"
                      type="text"
                      value={values.nameOnCard || selectedCard?.nameOnCard}
                      error={!!touched.nameOnCard && !!errors.nameOnCard}
                      helperText={touched.nameOnCard && errors.nameOnCard}
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
              </Box>

              <Button
                disabled={!values.cardNumber || !values.nameOnCard}
                type="submit"
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </CustomerDashboardLayout>
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

  console.log(years);

  return years;
}

const years = generateArrayOfYears();

const checkoutSchema = yup.object().shape({
  nameOnCard: yup.string().required("required"),
  cardNumber: yup.string().required("required"),
  cardMonth: yup.string().required("required"),
  cardYear: yup.string().required("required"),
});
export default PaymentMethodEditor;
