import React, { useState, useEffect } from "react";

// mui
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
import EditIcon from "@mui/icons-material/Edit";

// custom components
import FlexBox from "components/FlexBox";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";

// utils
import Link from "next/link";
import axios from "utils/axios";
import { Formik } from "formik";
import * as yup from "yup";

const Pages = () => {
  // pages
  const [pages, setPages] = useState([]);
  const [changed, setChanged] = useState(null);
  // success alert
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    axios
      .get("/pages")
      .then((res) => {
        setPages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Formik handlers
  const handlePageSubmit = async (values) => {
    if (
      values.name &&
      values.name.length > 0 &&
      values.slug &&
      values.slug.length > 0
    ) {
      await axios.post("/pages", values);
      values.name = "";
      values.slug = "";
      setOpen(true);
      refreshData();
    }
  };

  const renderPages = () => (
    <>
      <TableRow
        sx={{
          padding: "0px 18px",
          mb: "-0.125rem",
          bgcolor: "transparent",
        }}
        elevation={0}
      >
        <FlexBox justifyContent="space-between">
          <H5 color="grey.600" textAlign="left">
            Name
          </H5>
          <H5 color="grey.600" textAlign="left">
            Slug
          </H5>
          <H5 color="grey.600" px={2.75} my="0px">
            Actions
          </H5>
        </FlexBox>
      </TableRow>

      {pages &&
        pages.map((item, index) => (
          <TableRow
            key={index}
            sx={{
              my: "1rem",
              padding: "6px 18px",
            }}
          >
            <FlexBox justifyContent="space-between">
              <TextField
                value={item.name}
                size="small"
                variant="standard"
                onChange={(e) => {
                  let pg = [...pages];
                  pg[index].name = e.target.value;
                  setChanged({ ...changed, [index]: e.target.value });
                }}
              />
              <TextField
                value={item.slug}
                size="small"
                variant="standard"
                onChange={(e) => {
                  let pg = [...pages];
                  pg[index].slug = e.target.value;
                  setChanged({ ...changed, [index]: e.target.value });
                }}
              />

              <Typography
                textAlign="center"
                color="grey.600"
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
              >
                {changed && changed[index] != null && (
                  <IconButton
                    onClick={async () => {
                      // save the change and remove it from the staged changes
                      await axios.put(`/pages/${item.id}`, {
                        name: changed[index],
                      });
                      let changedItems = { ...changed };
                      delete changedItems[index];
                      setChanged(changedItems);
                      refreshData();
                    }}
                  >
                    <CheckCircleOutlineIcon fontSize="small" color="inherit" />
                  </IconButton>
                )}
                <Link href={`/vendor/static-pages/${item.slug}`}>
                  <IconButton>
                    <EditIcon fontSize="small" color="error" />
                  </IconButton>
                </Link>
                <IconButton
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this page?")) {
                      // save the change and remove it from the staged changes
                      await axios.delete(`/pages/${item.id}`);
                      refreshData();
                    }
                  }}
                >
                  <DeleteForeverIcon fontSize="small" color="error" />
                </IconButton>
              </Typography>
            </FlexBox>
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
        message="Page Added!"
      />
      {/* NEW CATEGORY */}
      <DashboardPageHeader title="Add Page" icon={AlignHorizontalLeftIcon} />
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
                <Grid item xs={12} container justifyContent="space-between">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Name"
                      placeholder="Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name || ""}
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      name="slug"
                      label="Slug"
                      placeholder="Slug"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.slug || ""}
                      error={!!touched.slug && !!errors.slug}
                      helperText={touched.slug && errors.slug}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  mt: "25px",
                }}
                onClick={() => handlePageSubmit(values)}
              >
                Save Page
              </Button>
            </form>
          )}
        </Formik>
      </Card>

      {/* PAGES LIST */}
      <DashboardPageHeader title="Pages" icon={AlignHorizontalLeftIcon} />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={10}>
          {renderPages()}
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

export default Pages;
