import React from "react";

import { Box } from "@mui/material";

import BazarCard from "components/BazarCard";
import FlexBox from "components/FlexBox";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H6, Span } from "components/Typography";

import Link from "next/link";
import axios from "utils/axios";
import { SERVER_URL } from "constant";

const ProductCard8 = (props) => {
  const { id, image, images, price, name, sx = {} } = props;
  return (
    <BazarCard
      sx={{
        ...sx,
        overflow: "hidden",
      }}
    >
      <Link href={`/product/${id}`}>
        <a>
          <Box mb={1.5} borderRadius="8px" p="1em">
            <LazyImage
              src={
                image != null
                  ? SERVER_URL + image.url
                  : images != null && images.length
                  ? SERVER_URL + images[0].url
                  : "/ImgNotFound.png"
              }
              borderRadius="8px"
              height={500}
              width={500}
              layout="responsive"
              objectFit="contain"
              objectPosition="center"
            />
          </Box>
          <Box sx={{ backgroundColor: "info.main", p: "1em" }}>
            <Span
              title={name}
              mb={0.5}
              color="info.contrastText"
              ellipsis
              display="block"
            >
              {name}
            </Span>
            <FlexBox alignItems="center">
              <H6 color="info.contrastText" mr={0.5}>
                ${price}
              </H6>
              {/* <Span color="grey.600">
              <del>$1600</del>
            </Span> */}
            </FlexBox>
          </Box>
        </a>
      </Link>
    </BazarCard>
  );
};

export default ProductCard8;
