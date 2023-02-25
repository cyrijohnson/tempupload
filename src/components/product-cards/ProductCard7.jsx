import React, { useCallback } from "react";

// mui
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove";
import { Button, IconButton } from "@mui/material";
import { Box } from "@mui/system";

// custom components
import ProductCard7Style from "./ProductCard7Style";
import Image from "components/BazarImage";
import FlexBox from "components/FlexBox";
import { Span } from "components/Typography";

//utils
import Link from "next/link";
import { useCart } from "react-use-cart";

const ProductCard7 = ({
  id,
  name,
  quantity,
  price,
  discountedPrice,
  imgUrl,
  customizable,
  onCustomizeClicked,
}) => {
  const { updateItemQuantity, removeItem } = useCart();

  return (
    <ProductCard7Style>
      <Image
        src={imgUrl || "/assets/images/products/iphone-xi.png"}
        height={140}
        width={140}
        display="block"
        alt={name}
      />
      <FlexBox
        className="product-details"
        flexDirection="column"
        justifyContent="space-between"
        minWidth="0px"
        width="100%"
      >
        <Link href={`/product/${id}`}>
          <a>
            <Span className="title" fontWeight="600" fontSize="18px" mb={1}>
              {name}
            </Span>
          </a>
        </Link>
        <Box position="absolute" right="1rem" top="1rem">
          <FlexBox alignItems="center">
            <Button
              variant="outlined"
              color="primary" // padding="5px"
              // size="none"
              // borderColor="primary.light"
              disabled={quantity === 1}
              sx={{
                p: "5px",
              }}
              onClick={() => updateItemQuantity(id, quantity - 1)}
            >
              <Remove fontSize="small" />
            </Button>
            <Span mx={1} fontWeight="600" fontSize="15px">
              {quantity}
            </Span>
            <Button
              variant="outlined"
              color="primary" // padding="5px"
              // size="none"
              // borderColor="primary.light"
              sx={{
                p: "5px",
              }}
              onClick={() => updateItemQuantity(id, quantity + 1)}
            >
              <Add fontSize="small" />
            </Button>
            <IconButton
              size="small"
              sx={{
                padding: "4px",
                ml: "12px",
              }}
              onClick={() => removeItem(id)}
            >
              <Close fontSize="small" />
            </IconButton>
          </FlexBox>
        </Box>

        <FlexBox // width="100%"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <FlexBox flexWrap="wrap" alignItems="center">
            <Span color="grey.600" mr={1}>
              ${discountedPrice ? discountedPrice.toFixed(2) : price.toFixed(2)}{" "}
              x {quantity}
            </Span>
            <Span fontWeight={600} color="primary.main" mr={2}>
              $
              {(discountedPrice
                ? discountedPrice * quantity
                : price * quantity
              ).toFixed(2)}
            </Span>
          </FlexBox>
          <FlexBox alignItems="center">
            {customizable && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  if (onCustomizeClicked) onCustomizeClicked();
                }}
              >
                Customize
              </Button>
            )}
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </ProductCard7Style>
  );
};

export default ProductCard7;
