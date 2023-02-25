import React, { useEffect, useState } from "react";

// import NavbarLayout from "components/layout/NavbarLayout";
import AppLayout from "components/layout/AppLayout";
import FrequentlyBought from "components/products/FrequentlyBought";
import ProductIntro from "components/products/ProductIntro";
import RelatedProducts from "components/products/RelatedProducts";

import { Grid } from "@mui/material";

import { useRouter } from "next/router";

// utils
import axios from "utils/axios";
import LoadingScreen from "components/loading-screen";
import SizerGrid from "components/SizerGrid";

const ProductDetails = (props) => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [kits, setKits] = useState([]);

  const loadProduct = async () => {
    const res = await axios.get(`/products/${id}`);
    let productData = res.data;
    // console.log(productData);
    setProduct(productData);
    setSelectedVariation(null);
    const resKit = await axios.get(`/kit-parts/${id}`);
    setKits(resKit.data);
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (id) {
      setProduct(null);
      loadProduct();
    }
  }, [router.isReady, id]);

  if (!product) return <LoadingScreen />;

  return (
    <AppLayout>
      <ProductIntro
        product={product}
        onVariationSelected={setSelectedVariation}
      />

      {selectedVariation && selectedVariation.variants && (
        <SizerGrid
          variants={selectedVariation.variants}
          onChange={(sizes) => {
            console.log(sizes);
          }}
        />
      )}
      <Grid container justifyContent="center" mt={10}>
        {kits.length > 0 && (
          <Grid item xs={10} md={8} container justifyContent="center">
            <FrequentlyBought productsData={kits} />
          </Grid>
        )}
        {product.related.length > 0 && (
          <Grid item xs={10} md={8} container justifyContent="center" mt={10}>
            <RelatedProducts productsData={product.related} />
          </Grid>
        )}
      </Grid>
    </AppLayout>
  );
};

export default ProductDetails;
