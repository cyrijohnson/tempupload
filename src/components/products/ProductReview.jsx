import FlexBox from "components/FlexBox";
import { H2, H5 } from "components/Typography";
import { Rating } from "@mui/lab";
import { Box, Button, Divider, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import ProductComment from "./ProductComment";
import useAuth from "contexts/useAuth";
import { useProducts } from "contexts/ProductsContext";
import axios from "utils/axios";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const ProductReview = ({ reviews, id, open }) => {
  const { user } = useAuth();
  const { refreshProducts } = useProducts();

  const [animationParent] = useAutoAnimate();

  const handleFormSubmit = async (values, { resetForm }) => {
    const newReview = {
      user: user.id,
      product: id,
      rating: values.rating,
      content: values.content,
    };
    await axios.post("/reviews", newReview);
    refreshProducts();
    resetForm();
  };

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: reviewSchema,
    onSubmit: handleFormSubmit,
  });
  return (
    <Box
      sx={{
        maxHeight: open ? 400 : 0,
        height: open ? 400 : 0,
        overflow: "auto",
      }}
      ref={animationParent}
    >
      {!user && (
        <>
          <H2 fontWeight="600" mb={2.5}>
            Login to Write a Review for this product
          </H2>
          <Divider sx={{ mt: 2.5, mb: 4 }} />
        </>
      )}

      {user && (
        <>
          <H2 fontWeight="600" mb={2.5}>
            Write a Review for this product
          </H2>

          <form onSubmit={handleSubmit}>
            <Box mb={2.5}>
              <FlexBox mb={1.5}>
                <H5 color="grey.700" mr={0.75}>
                  Your Rating
                </H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <Rating
                color="warn"
                size="medium"
                value={values.rating || 0}
                onChange={(_, value) => setFieldValue("rating", value)}
              />
            </Box>

            <Box mb={3}>
              <FlexBox mb={1.5}>
                <H5 color="grey.700" mr={0.75}>
                  Your Review
                </H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <TextField
                name="content"
                placeholder="Write a review here..."
                variant="outlined"
                multiline
                fullWidth
                rows={5}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.content || ""}
                error={!!touched.content && !!errors.content}
                helperText={touched.content && errors.content}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!(dirty && isValid)}
            >
              Submit
            </Button>
          </form>

          <Divider sx={{ mt: 2.5, mb: 4 }} />
        </>
      )}

      {reviews
        .sort((a, b) => b.rating - a.rating)
        .map((item, ind) => (
          <ProductComment {...item} key={ind} />
        ))}
    </Box>
  );
};

const initialValues = {
  rating: 0,
  content: "",
  date: new Date().toISOString(),
};
const reviewSchema = yup.object().shape({
  rating: yup.number().required("required"),
  content: yup.string().required("required"),
});
export default ProductReview;
