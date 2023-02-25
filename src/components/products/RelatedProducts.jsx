import ProductCard1 from "components/product-cards/ProductCard1";
import { H3 } from "components/Typography";
import { Card, Grid } from "@mui/material";
import React from "react";

const RelatedProducts = ({ productsData }) => {
  return (
    <Grid item xs={12} mb={7.5}>
      <H3 mb={3}>RELATED PRODUCTS</H3>
      <Card sx={{ p: 3 }}>
        <Grid item xs={12} container spacing={8}>
          {productsData.map((item, ind) => (
            <Grid item lg={3} md={4} sm={6} xs={10} key={ind}>
              <ProductCard1 {...item} hoverEffect />
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
};

export default RelatedProducts;
