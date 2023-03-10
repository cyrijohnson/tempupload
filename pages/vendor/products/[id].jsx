import React, { useEffect, useState } from "react";
import DeliveryBox from "components/icons/DeliveryBox";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import LoadingScreen from "components/loading-screen";
import {
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Autocomplete,
  Snackbar,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Tabs,
  Tab,
  TabPanel,
  IconButton,
  Divider,
  Paper,
  Switch,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// image upload
import SmallDropZone from "components/SmallDropZone";
import DropZoneMultiple from "components/DropZoneMultiple";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

// formik
import { Formik } from "formik";
import * as yup from "yup";

// utils
import { SERVER_URL } from "constant";
import axios from "utils/axios";
import { v4 as uuidv4 } from "uuid";
import TreeViewSelector from "components/TreeViewSelector";
import AutoGeneratedFieldGroup from "components/AutoGeneratedFieldGroup";

// text editor
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Products
import { useProducts } from "contexts/ProductsContext";
import SelectableList from "components/SelectableList";
import MultiSelectList from "components/MultiSelectList";

const EditProduct = () => {
  // handle dynamic import
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

  const {
    categories,
    shops,
    tags,
    brands,
    products,
    refreshProducts,
    attributeTypes,
    attributes,
  } = useProducts();

  const router = useRouter();
  const { id } = router.query;

  // success alert
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  // variations
  const [variations, setVariations] = useState([]);
  const [variation, setVariation] = useState(null);
  const [editingSubVariation, setEditingSubVariation] = useState(false);
  const [variationChanged, setVariationChanged] = useState(false);
  const [colors, setColors] = useState([]);

  // accordions
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Formik handlers
  const [initialValues, setInitialValues] = useState({
    name: "",
    customizable: false,
    description: "",
    images: {},
    stock: "",
    price: "",
    sku: "",
    brand: "",
    category: "",
    shop: "",
    tags: "",
    parent: null,
    related: [],
  });

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

  const uploadImage = async (file, reference, refID) => {
    const formData = new FormData();

    formData.append("files", file);
    formData.append("ref", reference);
    formData.append("refId", refID);
    formData.append("field", "image");

    await axios.post(SERVER_URL + "/upload", formData);
  };

  // Initialize product data
  useEffect(() => {
    if (products.length == 0) return;

    const product = products.find((product) => product.id == id);
    // console.log(product);

    axios
      .get("/colors")
      .then((res) => {
        setColors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (!product) {
      router.push("/vendor/products");
      return;
    }

    setInitialValues({
      id: product.id,
      name: product.name,
      description: product.description,
      customizable: product.customizable,
      images: product.images,
      stock: product.stock,
      price: product.price,
      sku: product.sku,
      brand: product.brand.id,
      category: product.category.id,
      shop: product.shop?.id,
      tags: product.tags,
      related: product.related,
    });

    console.log(product);

    setVariations(product.variations);
  }, [products, id, variationChanged]);

  // Generate data for the selectable list
  const [selectableAttributes, setSelectableAttributes] = useState([]);
  useEffect(() => {
    const sel = [];
    attributeTypes.forEach((type) => {
      sel.push({
        id: type.id,
        header: type.name,
        contents: type.attribs.map((attrib) => ({
          ...attrib,
          name: attrib.content,
        })),
      });
      setSelectableAttributes(sel);
    });
  }, [attributes]);

  const addNewVariation = async (parent) => {
    if (loading) return;
    setLoading(true);

    const product = products.find((product) => product.id == id);

    let newVar = {
      product: product.id,
      name: parent == null ? "New Macro Variation" : "New variation",
      image: "",
      price: 0,
      sku: "",
      stock: 0,
      groupID: parent ? parent.groupID : uuidv4(),
      isParent: parent ? false : true,
    };

    // Create variation on server
    try {
      console.log("Creating variation");
      let varPostRes = await axios.post("/variations", newVar);

      newVar = varPostRes.data;

      //wait 2 seconds for the thumbnail generation
      setImageFiles([]);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // refresh the products context
      await refreshProducts();
    } catch (error) {
      console.log(error);
      newVar = null;
    }
    setLoading(false);
    let vars = [...variations];
    // setup the tree view settings
    if (parent != null) {
      parent.items ? parent.items.push(newVar) : (parent.items = [newVar]);
      let i = vars.findIndex((varObj) => varObj.id == parent.id);
      vars[i] = parent;
    } else {
      vars.push(newVar);
    }
    // update everything
    setVariations(vars);
    setVariation(newVar);
  };

  const updateVariation = async (toUpdate) => {
    if (loading) return;
    setLoading(true);

    if (editingSubVariation) {
      let parent = variations.find(
        (variation) =>
          variation.groupID == toUpdate.groupID && variation.isParent == true
      );
      toUpdate.groupID = parent.groupID;
      toUpdate.image = "";
    }

    // Update variation on server
    try {
      console.log("Updating variation");
      let oldVar = await axios.get(`/variations/${toUpdate.id}`);
      oldVar = oldVar.data;
      let varRes = await axios.put(`/variations/${toUpdate.id}`, toUpdate);
      let updated = varRes.data;

      // check for image changes
      if (!editingSubVariation) {
        if (variation.image != null) {
          console.log("Uploading images", variation.image);
          // clear possible images on the server
          if (oldVar.image != null && oldVar.image.id != null)
            await axios.delete("/clearImage/" + oldVar.image.id);
          // upload the new image
          await uploadImage(variation.image, "variation", updated.id);
          setImageFiles([]);
        }
      }

      // refresh the products context
      await refreshProducts();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);

    // setup the tree view settings
    let vars = [...variations];
    let i = vars.findIndex((varObj) => varObj.id == toUpdate.id);
    vars[i] = toUpdate;
    // update everything
    setVariations(vars);
    setVariation(toUpdate);
    setVariationChanged(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      console.log("Updating product", values);
      let rel = values.related;
      values.related = values.related.map((rel) => rel.id);
      const productRes = await axios.put(`/products/${id}`, values);
      values.related = rel;

      if (imageFiles.length > 0) {
        console.log("Uploading images", imageFiles);
        await uploadImages(imageFiles, "product", productRes.data.id);
      }

      await refreshProducts();

      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch parent image for sub-variations
  const subVariationImage = variation?.image?.url;

  if (variation && !variation.isParent) {
    const parentVariation = variations.find(
      (toFind) => toFind.groupID == variation.groupID && toFind.isParent == true
    );
    subVariationImage = parentVariation.image
      ? parentVariation.image.url
      : "/ImgNotFound.png";
  }

  if (initialValues.name == "") return <LoadingScreen />;

  return (
    <VendorDashboardLayout>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Product Saved!"
      />
      <DashboardPageHeader
        title="Edit Product"
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
            <Grid item xs={12}>
              <Button
                disabled={loading}
                variant="contained"
                color="secondary"
                type="submit"
                sx={{
                  mt: "25px",
                  mr: "10px",
                  mb: "1em",
                  float: "left",
                }}
              >
                Save product
              </Button>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <Button
                  onClick={() => {
                    setVariation(null);
                    setEditingSubVariation(false);
                  }}
                >
                  {initialValues.name}
                </Button>
                <TreeViewSelector
                  height={600}
                  categories={variations}
                  onCategorySelected={(value) => {
                    setVariation(value);
                    setEditingSubVariation(false);
                    setVariationChanged(false);
                  }}
                  onNewCategory={() => {
                    addNewVariation();
                    setEditingSubVariation(false);
                    setVariationChanged(false);
                  }}
                  onItemSelected={(value) => {
                    setVariation(value);
                    setEditingSubVariation(true);
                    setVariationChanged(false);
                  }}
                  onNewItem={(parent) => {
                    console.log(parent);
                    addNewVariation(parent);
                    setEditingSubVariation(true);
                    setVariationChanged(false);
                  }}
                />
              </Grid>
              <Grid item xs={9}>
                {variation == null && (
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
                          initialValues={values.images}
                          onChange={(files) => {
                            let allImages = files;
                            // filter duplicates
                            let noDuplicates = [...new Set(allImages)];
                            setImageFiles(noDuplicates ?? []);
                            // setFieldValue("images", noDuplicates ?? []);
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
                          defaultValue={values.tags}
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

                    <Grid item xs={12}>
                      <h4>Related Products</h4>
                      {products && (
                        <MultiSelectList
                          elements={products}
                          height={250}
                          selected={values.related}
                          ignore={[values.id]}
                          onChange={(newSelection) => {
                            setFieldValue("related", newSelection);
                          }}
                        />
                      )}
                    </Grid>
                  </Card>
                )}

                {variation != null && (
                  <Card
                    sx={{
                      p: "30px",
                    }}
                  >
                    <Grid container>
                      <Grid container justifyContent="flex-end">
                        {variationChanged && (
                          <Button
                            disabled={loading}
                            variant="contained"
                            color="success"
                            sx={{ height: 30, mr: 2 }}
                            onClick={() => {
                              if (loading) return;
                              updateVariation(variation);
                            }}
                          >
                            Save
                          </Button>
                        )}
                        <Button
                          disabled={loading}
                          variant="contained"
                          color="primary"
                          sx={{ height: 30 }}
                          onClick={async () => {
                            if (loading) return;
                            let newVariations = [...variations].filter(
                              (v) => v.id !== variation.id
                            );
                            setVariations(newVariations);
                            setVariation(null);
                            if (variation.id)
                              await axios.delete(`/variations/${variation.id}`);
                            refreshProducts();
                          }}
                        >
                          Delete
                        </Button>
                      </Grid>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid container justifyContent="center" item xs={12}>
                          {!editingSubVariation && (
                            <SmallDropZone
                              avatarSize={100}
                              preview={
                                variation.image
                                  ? variation.image.preview
                                    ? variation.image.preview
                                    : SERVER_URL + variation.image.url
                                  : ""
                              }
                              onChange={(files) => {
                                console.log("Changed DropZone Status");
                                let newVar = { ...variation };
                                newVar.image = files[0];
                                setVariation(newVar);
                                setVariationChanged(true);
                              }}
                            />
                          )}
                          {editingSubVariation && (
                            <Paper
                              elevation={3}
                              sx={{
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                p: 4,
                                mb: 2,
                              }}
                            >
                              <Image
                                src={
                                  variation.isParent
                                    ? variation.image
                                      ? SERVER_URL + variation.image.url
                                      : "/ImgNotFound.png"
                                    : subVariationImage
                                    ? SERVER_URL + subVariationImage
                                    : "/ImgNotFound.png"
                                }
                                width={100}
                                height={100}
                                layout="responsive"
                              />
                            </Paper>
                          )}
                          <Grid item xs={10}>
                            <TextField
                              name="name"
                              label="Name"
                              placeholder="Name"
                              fullWidth
                              onChange={(e) => {
                                const val = e.target.value;
                                let newVar = { ...variation };
                                newVar.name = val;
                                setVariation(newVar);
                                let vars = [...variations];
                                vars[vars.indexOf(variation)] = newVar;
                                setVariations(vars);
                                setVariationChanged(true);
                              }}
                              value={variation.name || ""}
                              error={variation.name == ""}
                              sx={{ mt: 2, mb: 2 }}
                            />

                            <Grid item xs={12} sx={{ mb: 5 }}>
                              <TextField
                                label={"RJM Color"}
                                fullWidth
                                select
                                onChange={async (e) => {
                                  await axios.put(
                                    "/variations/" + variation.id,
                                    {
                                      color: e.target.value,
                                    }
                                  );
                                  let newVar = { ...variation };
                                  newVar.color = colors.find(
                                    (c) => c.id == e.target.value
                                  );
                                  setVariation(newVar);
                                }}
                                value={
                                  variation.color ? variation.color.id : ""
                                }
                              >
                                {colors.map((color) => (
                                  <MenuItem value={color.id} key={color.id}>
                                    {color.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <Divider />
                            </Grid>

                            <Grid container justifyContent="space-between">
                              <Grid item xs={7} sx={{ mt: 2, mb: 2 }}>
                                <TextField
                                  name="sku"
                                  label="SKU"
                                  placeholder="SKU"
                                  fullWidth
                                  onChange={(e) => {
                                    let newVar = { ...variation };
                                    newVar.sku = e.target.value;
                                    setVariation(newVar);
                                    setVariationChanged(true);
                                  }}
                                  value={variation.sku || ""}
                                  error={variation.sku == ""}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  name="stock"
                                  label="Stock"
                                  placeholder="Stock"
                                  type="number"
                                  fullWidth
                                  onChange={(e) => {
                                    let newVar = { ...variation };
                                    newVar.stock = e.target.value;
                                    setVariation(newVar);
                                    setVariationChanged(true);
                                  }}
                                  value={variation.stock || ""}
                                  error={variation.stock == ""}
                                  sx={{ mt: 2, mb: 2 }}
                                />
                              </Grid>
                            </Grid>
                            <TextField
                              name="price"
                              label="Regular Price"
                              placeholder="Regular Price"
                              type="number"
                              fullWidth
                              onChange={(e) => {
                                let newVar = { ...variation };
                                newVar.price = e.target.value;
                                setVariation(newVar);
                                setVariationChanged(true);
                              }}
                              value={variation.price || ""}
                              error={variation.price == ""}
                              sx={{ mt: 2 }}
                            />
                            <Divider sx={{ mt: 2, mb: 1 }} />
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          container
                          justifyContent="center"
                          sx={{ mt: "2em", mb: ".5em" }}
                        >
                          <Grid item xs={10}>
                            {variation &&
                              variation.attributes &&
                              variation.attributes.length > 0 && (
                                <AutoGeneratedFieldGroup
                                  alwaysRefresh
                                  data={attributeTypes.map((category) => {
                                    return {
                                      id: category.id,
                                      name: category.name,
                                      type: "select",
                                      options: category.attribs,
                                      selected: variation.attribs?.find(
                                        (a) => a.type.id == category.id
                                      )?.id,
                                    };
                                  })}
                                  onChange={(vals) => {
                                    console.log(vals);
                                    let changed = false;
                                    vals.forEach((val) => {
                                      if (val != null && val.name != null) {
                                        let found = variation?.attributes[
                                          val.name
                                        ]?.options?.find(
                                          (option) =>
                                            option.content ==
                                            val.selected.content
                                        );
                                        if (!found) changed = true;
                                      }
                                    });
                                    if (changed) {
                                      setVariationChanged(true);
                                      let newVar = { ...variation };
                                      newVar.attribs = vals.map((val) => {
                                        return {
                                          ...val.selected,
                                          type: {
                                            id: val.selected.type,
                                          },
                                        };
                                      });
                                      console.log(newVar);
                                      setVariation(newVar);
                                    }
                                  }}
                                />
                              )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
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
export default EditProduct;
