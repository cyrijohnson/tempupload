import {
  Grid,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogContent,
} from "@mui/material";
import * as yup from "yup";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "utils/axios";
import useAuth from "contexts/useAuth";

const checkoutSchema = yup.object({
  name: yup.string().required("required"),
  address: yup.string().required("required"),
  address2: yup.string(),
  phone: yup.string().required("required"),
  city: yup.string().required("required"),
  state: yup.string().required("required"),
  country: yup.string().required("required"),
  zip: yup.string().required("required"),
});
const initialValues = {
  name: "",
  address: "",
  address2: "",
  phone: "",
  city: "",
  state: "",
  country: "",
  zip: "",
};

const NewAddressForm = ({ setNewAddress, refreshData }) => {
  const { user, refreshUser } = useAuth();

  const [addCardForm, setAddCardForm] = useState(false);
  const { handleChange, handleSubmit, errors, touched, values } = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setNewAddress(values);

        //save address to the db
        if (user) {
          const newAddress = {
            name: values.name,
            address: values.address,
            address2: values.address2,
            phone: values.phone.toString(),
            city: values.city,
            state: values.state,
            country: values.country,
            zipCode: values.zip.toString(),
            user: user.id,
          };

          await axios.post("/locations", newAddress);
          try {
            refreshData();
          } catch (error) {}
          refreshUser();
        }

        if (values) {
          setAddCardForm(false);
          resetForm(initialValues);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  });
  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        sx={{
          p: "2px 20px",
        }}
        onClick={() =>
          addCardForm ? setAddCardForm(false) : setAddCardForm(true)
        }
      >
        Add New Billing Info
      </Button>
      <Dialog open={addCardForm} onClose={() => setAddCardForm(false)}>
        <DialogContent>
          <Typography variant="h6" mb={3}>
            Add New Billing Information
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={3.5}>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="name"
                    label="Enter Your Name"
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="address"
                    value={values.address}
                    label="Street line 1"
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="address2"
                    value={values.address2}
                    label="Address line 2"
                    error={touched.address2 && Boolean(errors.address2)}
                    helperText={touched.address2 && errors.address2}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    name="phone"
                    value={values.phone}
                    label="Enter Your Phone"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    name="city"
                    value={values.city}
                    label="City"
                    error={touched.city && Boolean(errors.city)}
                    helperText={touched.city && errors.city}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    name="state"
                    value={values.state}
                    label="State"
                    error={touched.state && Boolean(errors.state)}
                    helperText={touched.state && errors.state}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    name="zip"
                    value={values.zip}
                    label="Zip"
                    error={touched.zip && Boolean(errors.zip)}
                    helperText={touched.zip && errors.zip}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    name="country"
                    value={values.country}
                    label="Country"
                    error={touched.country && Boolean(errors.country)}
                    helperText={touched.country && errors.country}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Button color="primary" variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewAddressForm;
