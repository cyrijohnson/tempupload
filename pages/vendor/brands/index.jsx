import React, { useState, useEffect } from "react";

import {
  Button,
  Card,
  TextField,
  IconButton,
  Typography,
  Grid,
  Snackbar,
} from "@mui/material";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import FlexBox from "components/FlexBox";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";

import Link from "next/link";
import axios from "utils/axios";
import { Formik } from "formik";
import * as yup from "yup";
import { useProducts } from "contexts/ProductsContext";

const Brands = () => {
  // context
  const { brands, addBrand, refreshAdminData } = useProducts();
  // brands
  const [changed, setChanged] = useState(null);
  // success alert
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // Formik handlers
  const handleBrandSubmit = async (values) => {
    if (values.name && values.name.length > 0) {
      addBrand(values.name);
      values.name = "";
      setOpen(true);
    }
  };

  const renderBrands = () => (
    <>
      <TableRow
        sx={{
          padding: "0px 18px",
          mb: "-0.125rem",
          bgcolor: "transparent",
        }}
        elevation={0}
      >
        <FlexBox my="0px" mx={0.75} flex="2 2 220px !important">
          <H5 ml={7} color="grey.600" textAlign="left">
            Name
          </H5>
        </FlexBox>

        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} my="0px"></H5>
      </TableRow>

      {brands &&
        brands.map((item, index) => (
          <TableRow
            key={index}
            sx={{
              my: "1rem",
              padding: "6px 18px",
            }}
          >
            <FlexBox alignItems="center" m={0.75} flex="2 2 220px !important">
              <TextField
                fullWidth
                ml={2.5}
                value={item.name}
                size="small"
                variant="standard"
                onChange={(e) => {
                  let brnds = [...brands];
                  brnds[index].name = e.target.value;
                  setChanged({ ...changed, [index]: e.target.value });
                }}
              />
            </FlexBox>

            <Typography
              textAlign="center"
              color="grey.600"
              sx={{
                flex: "0 0 0 !important",
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              {changed && changed[index] != null && (
                <IconButton
                  onClick={() => {
                    // save the change and remove it from the staged changes
                    axios.put(`/brands/${item.id}`, {
                      name: changed[index],
                    });
                    let changedItems = { ...changed };
                    delete changedItems[index];
                    setChanged(changedItems);
                  }}
                >
                  <CheckCircleOutlineIcon fontSize="small" color="inherit" />
                </IconButton>
              )}
              <IconButton
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this brand?")) {
                    // save the change and remove it from the staged changes
                    await axios.delete(`/brands/${item.id}`);
                    let changedItems = { ...changed };
                    delete changedItems[index];
                    setChanged(changedItems);
                    await refreshAdminData();
                  }
                }}
              >
                <DeleteForeverIcon fontSize="small" color="error" />
              </IconButton>
            </Typography>
          </TableRow>
        ))}
    </>
  );

  return (
    <VendorDashboardLayout>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Brand Added!"
      />
      {/* NEW CATEGORY */}
      <DashboardPageHeader
        title="Add Brand"
        icon={AlignHorizontalLeftIcon}
        button={
          <Link href="/vendor/products">
            <Button
              color="primary"
              sx={{
                px: "2rem",
              }}
            >
              Back to Product List
            </Button>
          </Link>
        }
      />
      <Card
        sx={{
          p: "30px",
          marginBottom: "4em",
        }}
      >
        <Formik initialValues={initialValues} validationSchema={checkoutSchema}>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={3}>
                <Grid item sm={12} xs={12}>
                  <TextField
                    name="name"
                    label="Name"
                    placeholder="Name"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name || ""}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  mt: "25px",
                }}
                onClick={() => handleBrandSubmit(values)}
              >
                Save brand
              </Button>
            </form>
          )}
        </Formik>
      </Card>

      {/* BRANDS LIST */}
      <DashboardPageHeader title="Brands" icon={AlignHorizontalLeftIcon} />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={10}>
          {renderBrands()}
        </Grid>
      </Grid>
    </VendorDashboardLayout>
  );
};

const initialValues = {
  name: "",
};
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});

export default Brands;
