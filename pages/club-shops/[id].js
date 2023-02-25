import { useState, useEffect } from "react";

// next
import { useRouter } from "next/router";
import Link from "next/link";

// mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// components
import AppLayout from "components/layout/AppLayout";
import LoadingScreen from "components/loading-screen";
import CarouselSection from "components/fashion-shop/CarouselSection";
import LazyImage from "components/LazyImage";
import ProductCard3 from "components/product-cards/ProductCard3";

// utils
import { SERVER_URL } from "constant";
import { useProducts } from "contexts/ProductsContext";
import renderHTML from "react-render-html";
import useAuth from "contexts/useAuth";

export default function ClubShopsList(props) {
  const router = useRouter();
  const { user } = useAuth();
  const { shops, categories } = useProducts();

  const [shop, setShop] = useState(null);
  const [shopCategories, setShopCategories] = useState([]);

  useEffect(() => {
    if (!router.isReady || shops.length == 0) return;
    const s = shops.find((shop) => shop.id == router.query.id);
    setShop(s);
    // assign all products a category
    let products = s.products;
    products.forEach((product) => {
      product.category = categories.find(
        (category) => category.id == product.category
      );
    });
    // group all product categories
    const groupedCategories = products.reduce((acc, product) => {
      if (acc.find((cat) => cat.id == product.category.id)) return acc;
      return [...acc, product.category.name];
    }, []);

    // group products for each category
    const cats = groupedCategories
      .map((category) => {
        return {
          name: category,
          products: products.filter(
            (product) => product.category.name == category
          ),
        };
      })
      .filter((category) => category.products.length > 0);
    // remove duplicates based on name
    const uniqueCats = cats.reduce((acc, cat) => {
      if (acc.find((c) => c.name == cat.name)) return acc;
      return [...acc, cat];
    }, []);
    setShopCategories(uniqueCats);
    console.log(uniqueCats);
  }, [router.isReady, shops]);

  if (shop == null) return <LoadingScreen />;

  return (
    <AppLayout>
      <Grid item sx={{ width: "100vw", height: 400, position: "relative" }}>
        <LazyImage
          src={SERVER_URL + shop.banner.url}
          alt={shop.name}
          layout="fill"
          objectFit="cover"
        />
      </Grid>
      <Grid container justifyContent="center">
        {renderHTML(shop.description)}
        <Grid container sx={{ p: 3, px: 6 }} item xs={12}>
          {shopCategories.map((category) => (
            <Grid item xs={12} key={category.name}>
              <Typography variant="h2" sx={{ mb: 5 }}>
                {category.name}
              </Typography>
              <Grid container spacing={3}>
                {category.products.map((item, ind) => (
                  <Grid item xs={6} sm={4} lg={2} key={ind}>
                    <ProductCard3
                      id={item.id}
                      imgUrl={
                        item.images.length > 0
                          ? SERVER_URL + item.images[0].url
                          : "/ImgNotFound.png"
                      }
                      name={item.name}
                      rating={item.rating}
                      price={item.price}
                      off={
                        item.discounts &&
                        item.discounts.length > 0 &&
                        item.discounts.reduce((a, b) => a + b.percentage, 0)
                      }
                      hideFavoriteIcon={!user}
                      isWishlisted={
                        user &&
                        user.wishlist &&
                        user.wishlist.find((w) => w.id === item.id)
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </AppLayout>
  );
}
