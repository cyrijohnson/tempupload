import React, { useState } from "react";
import DeliveryBox from "components/icons/DeliveryBox";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import {
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Autocomplete,
  Switch,
  Typography,
} from "@mui/material";
import { Formik } from "formik";

import Link from "next/link";
import { useRouter } from "next/router";
import * as yup from "yup";

// hooks
import { useProducts } from "contexts/ProductsContext";
import useAuth from "contexts/useAuth";

// utils
import axios from "utils/axios";
import { SERVER_URL } from "constant";
import DropZoneMultiple from "components/DropZoneMultiple";

// text editor
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const NewProductDetails = () => {
  // handle dynamic import
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

  const router = useRouter();

  const {
    categories,
    shops,
    tags,
    brands,
    addProduct,
    refreshProducts,
    producsInitialized,
  } = useProducts();

  // Formik handlers
  const [initialValues, setInitialValues] = useState({
    name: "",
    customizable: false,
    description: "",
    images: {},
    stock: 0,
    price: 0,
    sku: "",
    brand: "",
    category: "",
    shop: "",
    tags: tags,
    parent: null,
  });

  const handleFormSubmit = async (values) => {
    let newProduct = {
      name: values.name,
      customizable: values.customizable,
      description: values.description,
      sku: values.sku,
      price: values.price,
      stock: values.stock,
      brand: values.brand,
      category: values.category,
      tags: values.tags.map((tag) => tag.id),
      shop: values.shop,
      // images: values.images,
    };

    let product = await addProduct(newProduct);

    console.log(product);

    if (imageFiles.length > 0) {
      console.log("Uploading images", imageFiles);
      await uploadImages(imageFiles, "product", product.id);
    }

    await refreshProducts();

    router.push("/vendor/products/" + product.id);
  };

  // image upload
  const [imageFiles, setImageFiles] = useState([]);
  const uploadImages = async (files, reference, refID) => {
    const formData = new FormData();

    formData.append("ref", reference);
    formData.append("refId", refID);
    formData.append("field", "images");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // only upload blob files
      if (file.type && file.type.includes("image")) {
        formData.append(`files`, file, file.name);
      }
    }

    await axios.post(SERVER_URL + "/upload", formData);
  };

  if (producsInitialized == "") return <LoadingScreen />;

  return (
    <VendorDashboardLayout>
      <DashboardPageHeader
        title="Add Product"
        icon={DeliveryBox}
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
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Card
                sx={{
                  p: "30px",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item sm={8} xs={12}>
                    <TextField
                      name="name"
                      label="Name"
                      placeholder="Name"
                      fullWidth
                      onChange={handleChange}
                      value={values.name || ""}
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <Switch
                      checked={values.customizable}
                      onChange={(e) => {
                        setFieldValue("customizable", e.target.checked);
                      }}
                      name="customizable"
                    />
                    <Typography variant="caption">Customizable</Typography>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      name="brand"
                      label="Select Brand"
                      placeholder="Brand"
                      fullWidth
                      select
                      onChange={handleChange}
                      value={values.brand || ""}
                      error={!!touched.brand && !!errors.brand}
                      helperText={touched.brand && errors.brand}
                    >
                      {brands.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      name="category"
                      label="Select Category"
                      placeholder="Category"
                      fullWidth
                      select
                      onChange={handleChange}
                      value={values.category || ""}
                      error={!!touched.category && !!errors.category}
                      helperText={touched.category && errors.category}
                    >
                      {categories.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      name="shop"
                      label="Select Club Shop"
                      placeholder="Club Shop"
                      fullWidth
                      select
                      onChange={handleChange}
                      value={values.shop || ""}
                      error={!!touched.shop && !!errors.shop}
                      helperText={touched.shop && errors.shop}
                    >
                      <MenuItem value={null}>None</MenuItem>
                      {shops.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <DropZoneMultiple
                      onChange={(files) => {
                        setImageFiles(files);
                      }}
                      onItemRemoved={async (item) => {
                        if (item.id)
                          await axios.delete(`/clearImage/${item.id}`);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} data-color-mode="light">
                    <ReactQuill
                      value={values.description}
                      onChange={(val) => setFieldValue("description", val)}
                      modules={{
                        clipboard: {
                          matchVisual: false,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      name="stock"
                      label="Stock"
                      placeholder="Stock"
                      type="number"
                      fullWidth
                      onChange={handleChange}
                      value={values.stock || ""}
                      error={!!touched.stock && !!errors.stock}
                      helperText={touched.stock && errors.stock}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Autocomplete
                      multiple
                      options={tags}
                      getOptionLabel={(option) => option.name}
                      defaultValue={[]}
                      renderInput={(params) => (
                        <TextField id="tags" {...params} label="Tags" />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      name="tags"
                      placeholder="Tags"
                      fullWidth
                      onBlur={(e, val) => {
                        handleBlur(e);
                      }}
                      onChange={(e, val) => {
                        handleChange(e);

                        let newValues = val.map((v) => {
                          return { id: v.id, name: v.name };
                        });

                        setFieldValue("tags", newValues);
                      }}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      name="price"
                      label="Regular Price"
                      placeholder="Regular Price"
                      type="number"
                      fullWidth
                      onChange={handleChange}
                      value={values.price || ""}
                      error={!!touched.price && !!errors.price}
                      helperText={touched.price && errors.price}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      name="sku"
                      label="SKU"
                      placeholder="Product SKU"
                      fullWidth
                      onChange={handleChange}
                      value={values.sku || ""}
                      error={!!touched.sku && !!errors.sku}
                      helperText={touched.sku && errors.sku}
                    />
                  </Grid>
                </Grid>
              </Card>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  mt: "25px",
                }}
              >
                Save product
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </VendorDashboardLayout>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  brand: yup.string().required("required"),
  category: yup.string().required("required"),
  description: yup.string().required("required"),
  stock: yup.number().required("required"),
  price: yup.number().required("required"),
  sku: yup.string().required("required"),
});
export default NewProductDetails;
