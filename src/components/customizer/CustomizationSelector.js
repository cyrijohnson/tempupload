import { useState, useEffect } from "react";

// mui
import { Grid, Card, Button } from "@mui/material";

//custom components
import LazyImage from "components/LazyImage";

// utils
import { SERVER_URL } from "constant";
import ctx from "contexts/Customization";
import { useCart } from "react-use-cart";

export default function CustomizationSelector({ product }) {
  const { customizations, addCustomization } = ctx.useCustomizations();
  const { items } = useCart();
  const prod = items.find((item) => item.id === product.id);

  return (
    <Grid container spacing={3}>
      {customizations.map((customization) => (
        <Grid item xs={4} sm={2} key={customization.id}>
          <Card sx={{ height: 250 }}>
            <h3 style={{ textAlign: "center" }}>{customization.name}</h3>
            <Grid container justifyContent="center">
              <LazyImage
                src={
                  SERVER_URL + customization.image?.formats.thumbnail.url ??
                  "/ImgNotFound.png"
                }
                width={150}
                height={100}
                objectFit="contain"
              />
            </Grid>
            <h3 style={{ textAlign: "center" }}>
              £{customization.price.toFixed(2)}
            </h3>
            <Button
              fullWidth
              onClick={() => {
                addCustomization(product, customization);
              }}
              disabled={
                prod.customizations.find((c) => c.id === customization.id) !=
                null
              }
            >
              Select
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
