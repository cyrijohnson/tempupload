import React from "react";
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

import axios from "utils/axios";

// Auth
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

const EditAddressForm = (props) => {
  const { user } = useAuth();

  const {
    addressData,
    selected,
    setAddressData,
    openEditForm,
    setOpenEditForm,
  } = props;
  const initialValues = {
    name: selected.name,
    address: selected.address,
    address2: selected.address2,
    phone: selected.phone,
    city: selected.city,
    state: selected.state,
    country: selected.country,
    zip: selected.zipCode,
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: (values) => {
      const updated = addressData.map((item) => {
        if (item.name === selected.name) {
          return values;
        } else {
          return item;
        }
      });
      setAddressData(updated);

      // save to db
      const editedAddress = {
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
      axios.put("/locations/" + selected.id, editedAddress);
      try {
        props.refreshData();
      } catch (error) {}

      if (updated) {
        setOpenEditForm(false);
      }
    },
  });
  return (
    <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
      <DialogContent>
        <Typography variant="h6" mb={3}>
          Edit Address Information
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box mb={3.5}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  name="name"
                  label="Enter Your Name"
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  name="address"
                  value={formik.values.address}
                  label="Street line 1"
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  name="address2"
                  value={formik.values.address2}
                  label="Address line 2"
                  error={
                    formik.touched.address2 && Boolean(formik.errors.address2)
                  }
                  helperText={formik.touched.address2 && formik.errors.address2}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  name="phone"
                  value={formik.values.phone}
                  label="Enter Your Phone"
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="city"
                  value={formik.values.city}
                  label="City"
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  name="state"
                  value={formik.values.state}
                  label="State"
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  fullWidth
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  name="zip"
                  value={formik.values.zip}
                  label="Zip"
                  error={formik.touched.zip && Boolean(formik.errors.zip)}
                  helperText={formik.touched.zip && formik.errors.zip}
                  fullWidth
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  name="country"
                  value={formik.values.country}
                  label="Country"
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                  fullWidth
                  onChange={formik.handleChange}
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
  );
};

export default EditAddressForm;
