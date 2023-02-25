import React from "react";
import FlexBox from "components/FlexBox";
import CustomerDashboardLayout from "components/layout/CustomerDashboardLayout";
import CustomerDashboardNavigation from "components/layout/CustomerDashboardNavigation";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import ProductCard1 from "components/product-cards/ProductCard1";
import Favorite from "@mui/icons-material/Favorite";
import { Button, Grid, Pagination } from "@mui/material";

import { SERVER_URL } from "constant";

// Auth
import useAuth from "contexts/useAuth";

const WishList = () => {
  const { user, refreshUser } = useAuth();

  return (
    <CustomerDashboardLayout>
      <DashboardPageHeader
        title="My Wish List"
        icon={Favorite}
        // button={
        //   <Button
        //     color="primary"
        //     sx={{
        //       px: "2rem",
        //       bgcolor: "primary.light",
        //     }}
        //   >
        //     Add All to Cart
        //   </Button>
        // }
        navigation={<CustomerDashboardNavigation />}
      />

      <Grid container spacing={3}>
        {user?.wishlist.map((item) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              title={item.name}
              price={item.price}
              imgUrl={
                item.images
                  ? item.images.length > 0
                    ? SERVER_URL + item.images[0].url
                    : "/ImgNotFound.png"
                  : SERVER_URL + item.image.url
              }
              rating={item.rating}
              discount={
                item.discounts &&
                item.discounts.length > 0 &&
                item.discounts.reduce((a, b) => a + b.percentage, 0)
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={5}
          variant="outlined"
          color="primary"
          onChange={(data) => {
            console.log(data);
          }}
        />
      </FlexBox> */}
    </CustomerDashboardLayout>
  );
};

export default WishList;
