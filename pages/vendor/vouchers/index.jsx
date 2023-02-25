import React, { useState, useEffect } from "react";

// mui
import {
  Button,
  Card,
  TextField,
  IconButton,
  Grid,
  Snackbar,
  Switch,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import moment from "moment";
import { useProducts } from "contexts/ProductsContext";

const Vouchers = () => {
  // context
  const {
    categories,
    products,
    vouchers,
    addVoucher,
    refreshVouchers,
    productsInitialized,
  } = useProducts();
  // success alert
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!productsInitialized) return;
    refreshVouchers();
  }, [productsInitialized]);

  // Formik handlers
  const handleVoucherSubmit = async (values) => {
    if (values.id) {
      // updating?
      await axios.put(`/vouchers/${values.id}`, values);
      await refreshVouchers();
      clearForm();
      setOpen(true);
    } else {
      // new voucher
      addVoucher(
        values.code,
        values.percentage,
        values.categories.map((c) => c.id),
        values.products.map((p) => p.id),
        values.from,
        values.to,
        values.isFreeShipping
      );
      values.name = "";
      await refreshVouchers();
      clearForm();
      setOpen(true);
    }
  };
  let setField = null;
  let clearForm = null;

  const renderVouchers = () => (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid To</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Is Free Shipping</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers &&
              vouchers.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.code}
                  </TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                  <TableCell>
                    {moment(item.from).format("DD/MM/yyyy")}
                  </TableCell>
                  <TableCell>{moment(item.to).format("DD/MM/yyyy")}</TableCell>
                  <TableCell align="center">{item.categories.length}</TableCell>
                  <TableCell align="center">{item.products.length}</TableCell>
                  <TableCell align="center">
                    <Switch checked={item.isFreeShipping} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => {
                        setField("id", item.id);
                        setField("code", item.code);
                        setField("percentage", item.percentage);
                        setField(
                          "from",
                          moment(item.from).format("YYYY-MM-DD")
                        );
                        setField("to", moment(item.to).format("YYYY-MM-DD"));
                        setField("categories", item.categories);
                        setField("products", item.products);
                        setField("isFreeShipping", item.isFreeShipping);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={async () => {
                        if (
                          confirm(
                            "Are you sure you want to delete this voucher?"
                          )
                        ) {
                          await axios.delete(`/vouchers/${item.id}`);
                          await refreshVouchers();
                        }
                      }}
                    >
                      <DeleteForeverIcon fontSize="small" color="error" />
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
        message="Voucher Added!"
      />
      {/* NEW VOUCHER */}
      <DashboardPageHeader
        title="Add Voucher"
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
                        <h2>New Voucher</h2>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      xs={6}
                      container
                      justifyContent="space-around"
                      alignItems="center"
                    >
                      <Grid item sm={8} xs={8}>
                        <h3>Is Free Shipping Voucher</h3>
                      </Grid>
                      <Switch
                        checked={values.isFreeShipping}
                        onChange={(e) => {
                          setFieldValue("isFreeShipping", e.target.checked);
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item sm={5} xs={10}>
                    <TextField
                      name="code"
                      label="Code"
                      placeholder="Enter code"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.code || ""}
                      error={!!touched.code && !!errors.code}
                      helperText={touched.code && errors.code}
                    />
                  </Grid>
                  <Grid item sm={5} xs={10}>
                    <TextField
                      name="percentage"
                      label="Percentage Off"
                      placeholder="Enter percentage"
                      type="number"
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.percentage || ""}
                      error={!!touched.percentage && !!errors.percentage}
                      helperText={touched.percentage && errors.percentage}
                    />
                  </Grid>
                  <Grid item sm={5} xs={10}>
                    <TextField
                      name="from"
                      label="Valid From"
                      placeholder="Enter date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.from || ""}
                      error={!!touched.from && !!errors.from}
                      helperText={touched.from && errors.from}
                    />
                  </Grid>
                  <Grid item sm={5} xs={10}>
                    <TextField
                      name="to"
                      label="Valid Until"
                      placeholder="Enter date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.to || ""}
                      error={!!touched.to && !!errors.to}
                      helperText={touched.to && errors.to}
                    />
                  </Grid>
                  <Grid item sm={5} xs={10}>
                    <h4>Categories</h4>
                    {categories && (
                      <MultiSelectList
                        elements={categories}
                        height={180}
                        selected={values.categories}
                        onChange={(newSelection) => {
                          setFieldValue("categories", newSelection);
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item sm={5} xs={10}>
                    <h4>Products</h4>
                    {products && (
                      <MultiSelectList
                        elements={products}
                        height={180}
                        selected={values.products}
                        onChange={(newSelection) => {
                          setFieldValue("products", newSelection);
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
                  onClick={() => handleVoucherSubmit(values)}
                >
                  Save voucher
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

      {/* CATEGORIES LIST */}
      <DashboardPageHeader title="Vouchers" icon={AlignHorizontalLeftIcon} />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={12}>
          {vouchers && renderVouchers()}
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
  id: "",
  code: "",
  percentage: "",
  from: "",
  to: "",
  categories: [],
  products: [],
  isFreeShipping: false,
};
const checkoutSchema = yup.object().shape({
  code: yup.string().required("required"),
  percentage: yup.number().required("required"),
  from: yup.date().required("required"),
  to: yup.date().required("required"),
});

export default Vouchers;
