import ProductCard3 from "components/product-cards/ProductCard3";
import useWindowSize from "hooks/useWindowSize";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Carousel from "../carousel/Carousel";
import CategorySectionCreator from "../CategorySectionCreator"; // common arrow button for slider

// Auth
import useAuth from "contexts/useAuth";

import { SERVER_URL } from "constant";

export const arrowButtonStyle = {
  backgroundColor: "white",
  color: "#2B3445",
};

const CarouselSection = ({ catTitle, Icon, products }) => {
  const { user } = useAuth();

  const [visibleSlides, setVisibleSlides] = useState(4);
  const width = useWindowSize();
  useEffect(() => {
    if (width < 500) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);
  return (
    <CategorySectionCreator
      icon={<Icon color="primary" /> ?? null}
      title={catTitle}
    >
      <Box mt={-0.5} mb={-0.5}>
        <Carousel
          totalSlides={products.length}
          visibleSlides={visibleSlides}
          infinite={true}
          leftButtonStyle={arrowButtonStyle}
          rightButtonStyle={arrowButtonStyle}
        >
          {products.map((item, ind) => (
            <Box py={0.5} key={ind}>
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
            </Box>
          ))}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
};

export default CarouselSection;
