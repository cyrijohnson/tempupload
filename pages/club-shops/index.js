import { useState, useEffect } from "react";

// next
import Link from "next/link";

// mui
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// components
import AppLayout from "components/layout/AppLayout";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";

// utils
import { SERVER_URL } from "constant";
import { useProducts } from "contexts/ProductsContext";

export default function ClubShopsList(props) {
  const { shops } = useProducts();

  console.log(shops);

  return (
    <AppLayout>
      <Grid container sx={{ p: 3, px: 6 }}>
        {shops.length > 0 &&
          shops.map((shop) => (
            <Grid item xs={6} sm={4} md={2} key={shop.id}>
              <Card>
                <Link href={`/club-shops/${shop.id}`}>
                  <CardMedia>
                    <a>
                      <HoverBox>
                        <LazyImage
                          src={SERVER_URL + shop.logo.url}
                          alt={shop.name}
                          width={200}
                          height={300}
                          objectFit="contain"
                          layout="responsive"
                        />
                      </HoverBox>
                    </a>
                  </CardMedia>
                </Link>
                {/* <CardContent>
                  <Typography variant="h4">{shop.name}</Typography>
                  <Typography variant="p">{shop.description}</Typography>
                </CardContent> */}
              </Card>
            </Grid>
          ))}
      </Grid>
    </AppLayout>
  );
}
