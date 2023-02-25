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
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import MultiSelectList from "components/MultiSelectList";

// utils
import Link from "next/link";
import axios from "utils/axios";
import { Formik } from "formik";
import * as yup from "yup";
import { useProducts } from "contexts/ProductsContext";
import ctx from "contexts/Customization";
import { Box } from "@mui/system";
import { SERVER_URL } from "constant";

const Customizations = () => {
  // context
  const { products } = useProducts();

  const { areas, refreshCustomizations } = ctx.useCustomizations();
  const [customizationImage, setCustomizationImage] = useState(null);

  console.log(areas);

  // success alert
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const uploadImage = async (file, reference, refID) => {
    const formData = new FormData();

    formData.append("files", file);
    formData.append("ref", reference);
    formData.append("refId", refID);
    formData.append("field", "image");

    let res = await axios.post(SERVER_URL + "/upload", formData);
    return res.data;
  };

  // Formik handlers
  const handleAreaSubmit = async (values) => {
    console.log(values);
    if (values.id) {
      // updating?
      await axios.put(`/customization-areas/${values.id}`, values);
      if (customizationImage) {
        if (values.image && values.image.id) {
          let res = await axios.delete(`/clearImage/${values.image.id}`);
        }
        let img = await uploadImage(
          customizationImage,
          "customization-area",
          values.id
        );
        console.log(img);
      }
      await refreshCustomizations();
      clearForm();
      setOpen(true);
    } else {
      // new voucher
      let res = await axios.post(`/customization-areas`, values);
      if (customizationImage) {
        await uploadImage(
          customizationImage,
          "customization-area",
          res.data.id
        );
      }
      await refreshCustomizations();
      clearForm();
      setCustomizationImage(null);
      setOpen(true);
    }
  };
  let setField = null;
  let clearForm = null;

  const renderCustomizations = () => (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Products</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {areas &&
              areas.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Avatar
                      src={
                        item.image
                          ? SERVER_URL + item.image.url
                          : "/ImgNotFound.png"
                      }
                      sx={{
                        height: 36,
                        width: 36,
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>

                  <TableCell align="center">{item.products.length}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={() => {
                        setField("id", item.id);
                        setField("name", item.name);
                        setField("image", item.image);
                        setField("products", item.products);
                        setCustomizationImage(item.image);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <EditIcon />
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
        message="Area Saved!"
      />
      {/* NEW VOUCHER */}
      <DashboardPageHeader
        title="Customizations"
        icon={AlignHorizontalLeftIcon}
      />
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
                      <Grid item>
                        <h2>Customization Area</h2>
                      </Grid>
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
                  <Grid item xs={12} container justifyContent="center">
                    <Grid
                      item
                      xs={6}
                      container
                      justifyContent="center"
                      alignItems="center"
                    >
                      {customizationImage == undefined && (
                        <label htmlFor="contained-button-file">
                          <InputLabel>{"Image"}</InputLabel>
                          <Input
                            accept="image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={(e) => {
                              if (e.target.files.length !== 0) {
                                var blobObj = new Blob([e.target.files[0]], {
                                  type: "image/*",
                                });
                                let file = Object.assign(e.target.files[0], {
                                  preview: URL.createObjectURL(blobObj),
                                });
                                setCustomizationImage(file);
                              }
                            }}
                            sx={{ display: "none" }}
                          />
                          <Button variant="contained" component="span">
                            Upload
                          </Button>
                        </label>
                      )}
                      {customizationImage != null && (
                        <Grid item sx={{ position: "relative" }}>
                          <Grid item>
                            <Avatar
                              src={
                                customizationImage && customizationImage.preview
                                  ? customizationImage.preview
                                  : SERVER_URL + customizationImage.url
                              }
                              variant={"rounded"}
                              sx={{
                                margin: "2em",
                                height: 200,
                                width: 200,
                              }}
                            />
                          </Grid>
                          <Box sx={{ position: "absolute", right: 0, top: 0 }}>
                            <IconButton
                              onClick={() => {
                                setCustomizationImage(undefined);
                              }}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Grid item sm={5} xs={10}>
                      <h4>Products</h4>
                      {products && (
                        <MultiSelectList
                          elements={products}
                          height={250}
                          selected={values.products}
                          onChange={(newSelection) => {
                            setFieldValue("products", newSelection);
                          }}
                        />
                      )}
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
                  onClick={() => handleAreaSubmit(values)}
                >
                  Save area
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

      {/* AREAS LIST */}
      <DashboardPageHeader
        title="Customization Areas"
        icon={AlignHorizontalLeftIcon}
      />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={12}>
          {areas && renderCustomizations()}
        </Grid>
      </Grid>
    </VendorDashboardLayout>
  );
};

const initialValues = {
  id: "",
  name: "",
  image: "",
  products: [],
};
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});

export default Customizations;
