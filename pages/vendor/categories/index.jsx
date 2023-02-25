import React, { useState, useEffect } from "react";

import {
  Button,
  Card,
  TextField,
  IconButton,
  Pagination,
  Typography,
  Grid,
  Snackbar,
  Switch,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import FlexBox from "components/FlexBox";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";

import Link from "next/link";
import axios from "utils/axios";
import { Formik } from "formik";
import * as yup from "yup";
import { useProducts } from "contexts/ProductsContext";

const Categories = () => {
  // context
  const { categories, addCategory, refreshAdminData } = useProducts();
  // categories
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
  const handleCategorySubmit = async (values) => {
    if (values.name && values.name.length > 0) {
      addCategory(values.name, values.isShop);
      values.name = "";
      setOpen(true);
    }
  };

  const renderCategories = () => (
    <>
      <TableRow
        sx={{
          padding: "0px 18px",
          mb: "-0.125rem",
          bgcolor: "transparent",
        }}
        elevation={0}
      >
        <FlexBox my="0px" mx={0.75} flex="1 2 220px !important">
          <H5 ml={7} color="grey.600" textAlign="left">
            Name
          </H5>
        </FlexBox>

        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} my="0px"></H5>
        {/* <H5 ml={7} color="grey.600" textAlign="left">
          Is Club Shop Category
        </H5> */}
      </TableRow>

      {categories &&
        categories.map((item, index) => (
          <TableRow
            key={index}
            sx={{
              my: "1rem",
              padding: "6px 18px",
            }}
          >
            <Grid item sm={9} xs={9}>
              <TextField
                fullWidth
                ml={2.5}
                value={item.name}
                size="small"
                variant="standard"
                onChange={(e) => {
                  let cats = [...categories];
                  cats[index].name = e.target.value;
                  setChanged({ ...changed, [index]: e.target.value });
                }}
              />
            </Grid>
            {/* <Grid item sm={2} xs={2} container justifyContent="center">
              <Switch
                checked={item.isShop}
                onChange={(e) => {
                  let cats = [...categories];
                  cats[index].isShop = e.target.checked;
                  setChanged({ ...changed, [index]: cats[index].name });
                }}
                label="club shop"
              />
            </Grid> */}
            <Grid item sm={2} xs={2} container justifyContent="center">
              {changed && changed[index] != null && (
                <IconButton
                  onClick={() => {
                    // save the change and remove it from the staged changes
                    axios.put(`/categories/${item.id}`, {
                      name: changed[index],
                      isShop: item.isShop,
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
                  if (
                    confirm("Are you sure you want to delete this category?")
                  ) {
                    // save the change and remove it from the staged changes
                    await axios.delete(`/categories/${item.id}`);
                    let changedItems = { ...changed };
                    delete changedItems[index];
                    setChanged(changedItems);
                    await refreshAdminData();
                  }
                }}
              >
                <DeleteForeverIcon fontSize="small" color="error" />
              </IconButton>
            </Grid>
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
        message="Category Added!"
      />
      {/* NEW CATEGORY */}
      <DashboardPageHeader
        title="Add Category"
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
                onClick={() => handleCategorySubmit(values)}
              >
                Save category
              </Button>
            </form>
          )}
        </Formik>
      </Card>

      {/* CATEGORIES LIST */}
      <DashboardPageHeader title="Categories" icon={AlignHorizontalLeftIcon} />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={10}>
          {renderCategories()}
        </Grid>
      </Grid>
      {/* <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={5}
          onChange={(data) => {
            console.log(data);
          }}
        />
      </FlexBox> */}
    </VendorDashboardLayout>
  );
};

const initialValues = {
  name: "",
  isShop: false,
};
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});

export default Categories;
