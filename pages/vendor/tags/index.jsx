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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import FlexBox from "components/FlexBox";
import ListAlt from "@mui/icons-material/ListAlt";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";

import Link from "next/link";
import axios from "utils/axios";
import { Formik } from "formik";
import * as yup from "yup";
import { useProducts } from "contexts/ProductsContext";

const Tags = () => {
  // context
  const { tags, addTag, refreshAdminData } = useProducts();
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
  const handleTagSubmit = async (values) => {
    if (values.name && values.name.length > 0) {
      addTag(values.name);
      values.name = "";
      setOpen(true);
    }
  };

  const renderTags = () => (
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

      {tags.map((item, index) => (
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
                let newTags = [...tags];
                newTags[index].name = e.target.value;
                setChanged({ ...changed, [index]: e.target.value });
                setTags((prev) => newTags);
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
                  axios.put(`/tags/${item.id}`, {
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
                if (confirm("Are you sure you want to delete this tag?")) {
                  // save the change and remove it from the staged changes
                  await axios.delete(`/tags/${item.id}`);
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
        message="Tag Added!"
      />
      {/* NEW TAG */}
      <DashboardPageHeader
        title="Add Tag"
        icon={ListAlt}
        button={
          <Link href="/vendor/products">
            <Button
              color="primary"
              sx={{
                bgcolor: "primary.light",
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
                onClick={() => handleTagSubmit(values)}
              >
                Save tag
              </Button>
            </form>
          )}
        </Formik>
      </Card>

      {/* TAGS LIST */}
      <DashboardPageHeader title="Tags" icon={ListAlt} />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={10}>
          {renderTags()}
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
};
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});

export default Tags;
