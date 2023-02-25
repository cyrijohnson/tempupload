import React, { useState } from "react";

import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import Card1 from "components/Card1";
// import countryList from "data/countryList";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import * as yup from "yup";
import useStorage from "hooks/useStorage";

const CheckoutForm = () => {
  const { getItem, setItem } = useStorage();
  const router = useRouter();

  const billingInfo = getItem("billingInfo");

  const initialValues = {
    sameAsShipping: billingInfo ? billingInfo.sameAsShipping : false,
    shipping_name: billingInfo?.shipping_name,
    shipping_surname: billingInfo?.shipping_surname,
    shipping_email: billingInfo?.shipping_email,
    shipping_contact: billingInfo?.shipping_contact,
    shipping_company: billingInfo?.shipping_company,
    shipping_zip: billingInfo?.shipping_zip,
    // shipping_country: countryList[229],
    shipping_city: billingInfo?.shipping_city,
    shipping_address1: billingInfo?.shipping_address1,
    shipping_address2: billingInfo?.shipping_address2,

    billing_name: billingInfo?.billing_name,
    billing_surname: billingInfo?.billing_surname,
    billing_email: billingInfo?.billing_email,
    billing_contact: billingInfo?.billing_contact,
    billing_company: billingInfo?.billing_company,
    billing_zip: billingInfo?.billing_zip,
    // billing_country: countryList[229],
    billing_city: billingInfo?.billing_city,
    billing_address1: billingInfo?.billing_address1,
    billing_address2: billingInfo?.billing_address2,
  };

  const [sameAsShipping, setSameAsShipping] = useState(
    billingInfo ? billingInfo.sameAsShipping : false
  );

  const handleFormSubmit = async (values) => {
    if (values.shipping_address2.length == 0)
      values.shipping_address2 = values.shipping_address1;
    if (values.billing_address2.length == 0)
      values.billing_address2 = values.billing_address1;
    setItem("billingInfo", { ...values, sameAsShipping: sameAsShipping });
    router.push("/payment");
  };

  const handleCheckboxChange = (values, setFieldValue) => (e, _) => {
    const checked = e.currentTarget.checked;
    setSameAsShipping(checked);
    setFieldValue("same_as_shipping", checked);
    setFieldValue("billing_name", checked ? values.shipping_name : "");
    setFieldValue("billing_surname", checked ? values.shipping_surname : "");
    setFieldValue("billing_city", checked ? values.shipping_city : "");
    setFieldValue("billing_address1", checked ? values.shipping_address1 : "");
    setFieldValue("billing_address2", checked ? values.shipping_address2 : "");
    setFieldValue("billing_email", checked ? values.shipping_email : "");
    setFieldValue("billing_contact", checked ? values.shipping_contact : "");
    setFieldValue("billing_zip", checked ? values.shipping_zip : "");
  };

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
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card1
            sx={{
              mb: "2rem",
            }}
          >
            <Typography fontWeight="600" mb={2}>
              Shipping Address
            </Typography>

            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="shipping_name"
                  sx={{
                    mb: "1rem",
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_name || ""}
                  error={!!touched.shipping_name && !!errors.shipping_name}
                  helperText={touched.shipping_name && errors.shipping_name}
                />
                <TextField
                  fullWidth
                  label="Surname"
                  name="shipping_surname"
                  sx={{
                    mb: "1rem",
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_surname || ""}
                  error={
                    !!touched.shipping_surname && !!errors.shipping_surname
                  }
                  helperText={
                    touched.shipping_surname && errors.shipping_surname
                  }
                />
                <TextField
                  name="shipping_contact"
                  label="Phone Number"
                  fullWidth
                  sx={{
                    mb: "1rem",
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_contact || ""}
                  error={
                    !!touched.shipping_contact && !!errors.shipping_contact
                  }
                  helperText={
                    touched.shipping_contact && errors.shipping_contact
                  }
                />
                <TextField
                  fullWidth
                  type="email"
                  name="shipping_email"
                  label="Email Address"
                  sx={{
                    mb: "1rem",
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_email || ""}
                  error={!!touched.shipping_email && !!errors.shipping_email}
                  helperText={touched.shipping_email && errors.shipping_email}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  name="shipping_city"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_city || ""}
                  error={!!touched.shipping_city && !!errors.shipping_city}
                  helperText={touched.shipping_city && errors.shipping_city}
                  sx={{
                    mb: "1rem",
                  }}
                />
                <TextField
                  fullWidth
                  label="Address 1"
                  name="shipping_address1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_address1 || ""}
                  error={
                    !!touched.shipping_address1 && !!errors.shipping_address1
                  }
                  helperText={
                    touched.shipping_address1 && errors.shipping_address1
                  }
                  sx={{
                    mb: "1rem",
                  }}
                />
                <TextField
                  name="shipping_address2"
                  label="Address 2"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_address2 || ""}
                  error={
                    !!touched.shipping_address2 && !!errors.shipping_address2
                  }
                  helperText={
                    touched.shipping_address2 && errors.shipping_address2
                  }
                  sx={{
                    mb: "1rem",
                  }}
                />

                <TextField
                  fullWidth
                  label="Post Code"
                  name="shipping_zip"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shipping_zip || ""}
                  error={!!touched.shipping_zip && !!errors.shipping_zip}
                  helperText={touched.shipping_zip && errors.shipping_zip}
                />
              </Grid>
            </Grid>
          </Card1>

          <Card1
            sx={{
              mb: "2rem",
            }}
          >
            <Typography fontWeight="600" mb={2}>
              Billing Address
            </Typography>

            <FormControlLabel
              label="Same as shipping address"
              control={
                <Checkbox
                  size="small"
                  color="secondary"
                  defaultChecked={sameAsShipping}
                />
              }
              sx={{
                mb: sameAsShipping ? "" : "1rem",
                zIndex: 1,
                position: "relative",
              }}
              onChange={handleCheckboxChange(values, setFieldValue)}
            />

            {!sameAsShipping && (
              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="billing_name"
                    sx={{
                      mb: "1rem",
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_name || ""}
                    error={!!touched.billing_name && !!errors.billing_name}
                    helperText={touched.billing_name && errors.billing_name}
                  />
                  <TextField
                    fullWidth
                    label="Surname"
                    name="billing_surname"
                    sx={{
                      mb: "1rem",
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_surname || ""}
                    error={
                      !!touched.billing_surname && !!errors.billing_surname
                    }
                    helperText={
                      touched.billing_surname && errors.billing_surname
                    }
                  />
                  <TextField
                    name="billing_contact"
                    label="Phone Number"
                    fullWidth
                    sx={{
                      mb: "1rem",
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_contact || ""}
                    error={
                      !!touched.billing_contact && !!errors.billing_contact
                    }
                    helperText={
                      touched.billing_contact && errors.billing_contact
                    }
                  />
                  <TextField
                    fullWidth
                    type="email"
                    name="billing_email"
                    label="Email Address"
                    sx={{
                      mb: "1rem",
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_email || ""}
                    error={!!touched.billing_email && !!errors.billing_email}
                    helperText={touched.billing_email && errors.billing_email}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  {/* <TextField fullWidth label="Company" name="shipping_company" sx={{
                    mb: '1rem'
                  }} onBlur={handleBlur} onChange={handleChange} value={values.shipping_company || ''} error={!!touched.shipping_company && !!errors.shipping_company} helperText={touched.shipping_company && errors.shipping_company} />
                  
                  <Autocomplete options={countryList} getOptionLabel={option => option.label || ''} value={values.shipping_country} sx={{
                    mb: '1rem'
                  }} fullWidth onChange={(_e, value) => setFieldValue('shipping_country', value)} renderInput={params => <TextField label="Country" placeholder="Select Country" variant="outlined" // size ="large"
                error={!!touched.shipping_country && !!errors.shipping_country} helperText={touched.shipping_country && errors.shipping_country} {...params} />} /> */}

                  <TextField
                    fullWidth
                    label="City"
                    name="billing_city"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_city || ""}
                    error={!!touched.billing_city && !!errors.billing_city}
                    helperText={touched.billing_city && errors.billing_city}
                    sx={{
                      mb: "1rem",
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Address 1"
                    name="billing_address1"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_address1 || ""}
                    error={
                      !!touched.billing_address1 && !!errors.billing_address1
                    }
                    helperText={
                      touched.billing_address1 && errors.billing_address1
                    }
                    sx={{
                      mb: "1rem",
                    }}
                  />

                  <TextField
                    name="billing_address2"
                    label="Address 2"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_address2 || ""}
                    error={
                      !!touched.billing_address2 && !!errors.billing_address2
                    }
                    helperText={
                      touched.billing_address2 && errors.billing_address2
                    }
                    sx={{
                      mb: "1rem",
                    }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Post Code"
                    name="billing_zip"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billing_zip || ""}
                    error={!!touched.billing_zip && !!errors.billing_zip}
                    helperText={touched.billing_zip && errors.billing_zip}
                  />
                </Grid>
              </Grid>
            )}
          </Card1>

          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <Link href="/cart">
                <Button
                  variant="outlined"
                  color="primary"
                  type="button"
                  fullWidth
                >
                  Back to Cart
                </Button>
              </Link>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Proceed to Payment
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

const checkoutSchema = yup.object().shape({
  shipping_name: yup.string().required("required"),
  shipping_surname: yup.string().required("required"),
  shipping_email: yup.string().email("invalid email").required("required"),
  shipping_contact: yup.string().required("required"),
  shipping_zip: yup.string().required("required"),
  // shipping_country: yup.object().required("required"),
  shipping_city: yup.string().required("required"),
  shipping_address1: yup.string().required("required"),

  billing_name: yup.string().required("required"),
  billing_surname: yup.string().required("required"),
  billing_email: yup.string().required("required"),
  billing_contact: yup.string().required("required"),
  billing_zip: yup.string().required("required"),
  // billing_country: yup.object().required("required"),
  billing_city: yup.string().required("required"),
  billing_address1: yup.string().required("required"),
});
export default CheckoutForm;
