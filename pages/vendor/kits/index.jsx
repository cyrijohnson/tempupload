import React, { useState, useEffect } from "react";

// mui
import {
  Button,
  Card,
  TextField,
  IconButton,
  Grid,
  Snackbar,
  InputLabel,
  Input,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// custom components
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import MultiSelectList from "components/MultiSelectList";

// utils
import Link from "next/link";
import axios from "utils/axios";
import { Formik } from "formik";
import * as yup from "yup";
import { useProducts } from "contexts/ProductsContext";

const Customizations = () => {
  // context
  const { categories, kits, refreshKits } = useProducts();

  // success alert
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Formik handlers
  const handleKitSubmit = async (values) => {
    console.log(values);
    if (values.id) {
      // updating
      await axios.put(`/kits/${values.id}`, values);
      await refreshKits();
      clearForm();
      setOpen(true);
    } else {
      // new
      await axios.post(`/kits`, values);
      await refreshKits();
      clearForm();
      setOpen(true);
    }
  };
  let setField = null;
  let clearForm = null;

  const renderList = () => (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Categories</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kits &&
              kits.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{item.name}</TableCell>

                  <TableCell align="center">{item.categories.length}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={() => {
                        setField("id", item.id);
                        setField("name", item.name);
                        setField("categories", item.categories);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={async () => {
                        await axios.delete(`/kits/${item.id}`);
                        await refreshKits();
                        clearForm();
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <VendorDashboardLayout>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Kit Saved!"
      />
      {/* NEW VOUCHER */}
      <DashboardPageHeader title="Kits" icon={AccessibilityNewIcon} />
      <Card
        sx={{
          p: "30px",
          marginBottom: "4em",
        }}
      >
        <Formik initialValues={initialValues} validationSchema={checkoutSchema}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            resetForm,
          }) => {
            setField = setFieldValue;
            clearForm = resetForm;
            return (
              <form onSubmit={(e) => e.preventDefault()}>
                <Grid container spacing={3} justifyContent="space-around">
                  <Grid
                    item
                    sm={12}
                    xs={12}
                    container
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Grid item sm={4} xs={4}>
                      <h2>Kit Builder</h2>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="name"
                        label="Name"
                        placeholder="Enter name"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name || ""}
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                  </Grid>

                  <Grid item sm={5} xs={10}>
                    <h4>Categories</h4>
                    {categories && categories.length && (
                      <MultiSelectList
                        elements={categories}
                        height={250}
                        selected={values.categories}
                        onChange={(newSelection) => {
                          setFieldValue("categories", newSelection);
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    mt: "25px",
                  }}
                  onClick={() => handleKitSubmit(values)}
                >
                  Save kit
                </Button>
                {values.id && (
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    sx={{
                      mt: "25px",
                      ml: 3,
                    }}
                    onClick={() => resetForm()}
                  >
                    Clear Values
                  </Button>
                )}
              </form>
            );
          }}
        </Formik>
      </Card>

      {/* KitS LIST */}
      <DashboardPageHeader title="Kits" icon={AccessibilityNewIcon} />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={12}>
          {kits && renderList()}
        </Grid>
      </Grid>
    </VendorDashboardLayout>
  );
};

const initialValues = {
  id: "",
  name: "",
  kits: [],
};
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});

export default Customizations;
