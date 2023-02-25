import FlexBox from "components/FlexBox";
import ProductCard3 from "components/product-cards/ProductCard3";
import { Span } from "components/Typography";
import productDatabase from "data/product-database";
import { Grid, Pagination } from "@mui/material";
import React, { useState, useEffect } from "react";

// utils
import axios from "utils/axios";
import { SERVER_URL } from "constant";

const ProductCard1List = ({ products, onPageChange }) => {
  const [productsCount, setProductsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);

  useEffect(() => {
    getProductsCount();
  }, []);

  const getProductsCount = async () => {
    const response = await axios.get(`/products/count`);
    const count = response.data;
    const maxPages = Math.ceil(count / 9);
    setProductsCount(count);
    setMaxPages(maxPages);
  };

  return (
    <div>
      <Grid container>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {products.map((item, ind) => (
            <Grid item lg={4} sm={4} xs={4} key={ind}>
              <ProductCard3
                {...item}
                imgUrl={
                  item.images.length > 0
                    ? SERVER_URL + item.images[0].url
                    : "/ImgNotFound.png"
                }
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
      >
        <Span color="grey.600">{`Showing ${currentPage}-${
          currentPage * 9
        } of ${productsCount} Products`}</Span>
        <Pagination
          count={maxPages}
          variant="outlined"
          color="info"
          shape="rounded"
          onChange={(e, newPage) => {
            setCurrentPage(newPage);
            onPageChange(newPage);
          }}
        />
      </FlexBox>
    </div>
  );
};

export default ProductCard1List;
