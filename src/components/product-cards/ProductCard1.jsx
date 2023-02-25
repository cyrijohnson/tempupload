import React, { Fragment, useCallback, useState } from "react";

// mui
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  styled,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Remove from "@mui/icons-material/Remove";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";

// custom components
import BazarCard from "components/BazarCard";
import BazarRating from "components/BazarRating";
import LazyImage from "components/LazyImage";
import { H3, Span } from "components/Typography";
import BazarButton from "components/BazarButton";
import FlexBox from "../FlexBox";

// utils
import Link from "next/link";
import { useCart } from "react-use-cart";
import axios from "utils/axios";
import { SERVER_URL } from "constant";

// Auth
import useAuth from "contexts/useAuth";

const StyledBazarCard = styled(BazarCard)(() => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  margin: "auto",
  overflow: "hidden",
  transition: "all 250ms ease-in-out",
  borderRadius: "8px",
  "&:hover": {
    "& .css-1i2n18j": {
      display: "flex",
    },
  },
}));
const ImageWrapper = styled(Box)(({ theme }) => ({
  objectFit: "cover",
  position: "relative",
  display: "inline-block",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
const StyledChip = styled(Chip)(() => ({
  position: "absolute",
  fontSize: "10px",
  fontWeight: 600,
  paddingLeft: 3,
  paddingRight: 3,
  top: "10px",
  left: "10px",
  zIndex: 11,
}));
const HoverIconWrapper = styled(Box)(({ theme }) => ({
  display: "none",
  flexDirection: "column",
  position: "absolute",
  top: "7px",
  right: "15px",
  cursor: "pointer",
  zIndex: 2,
  [theme.breakpoints.down("md")]: {
    display: "flex",
  },
}));
const ContentWrapper = styled(Box)(() => ({
  "& .title, & .categories": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const ProductCard1 = ({
  id,
  title,
  price,
  image,
  images,
  rating,
  discount,
  hideRating,
  hoverEffect,
  showProductSize,
}) => {
  const { user, refreshUser } = useAuth();

  const [open, setOpen] = useState(false);

  const { items, updateItemQuantity } = useCart();
  const cartItem = items.find((item) => item.id === id);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return (
    <StyledBazarCard hoverEffect={hoverEffect}>
      <ImageWrapper sx={{ padding: 3 }}>
        {discount && discount !== 0 && (
          <StyledChip color="primary" size="small" label={`${discount}% off`} />
        )}

        <BazarButton
          disableRipple
          disableElevation
          sx={{
            zIndex: "2",
            position: "absolute",
            right: "0",
            top: "10px",
            height: "0",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
          onClick={async () => {
            try {
              let list = await axios.post(`/wishlist/${id}`);
              refreshUser();
            } catch (e) {
              console.log(e);
            }
            refreshUser();
          }}
        >
          {user && user.wishlist.find((w) => w.id == id) ? (
            <Favorite fontSize="small" color="primary" />
          ) : (
            <FavoriteBorder
              fontSize="small"
              sx={{
                opacity: 0.5,
              }}
            />
          )}
        </BazarButton>

        <Link href={`/product/${id}`}>
          <a>
            <LazyImage
              src={
                image != null
                  ? SERVER_URL + image.url
                  : images && images.length
                  ? SERVER_URL + images[0].url
                  : "/ImgNotFound.png"
              }
              width={300}
              height={300}
              objectFit="cover"
              alt={title}
            />
          </a>
        </Link>
      </ImageWrapper>

      <ContentWrapper>
        <FlexBox
          sx={{
            backgroundColor: "info.main",
            px: ".7em",
            pb: ".5em",
          }}
        >
          <Box flex="1 1 0" minWidth="0px" mr={1}>
            <Link href={`/product/${id}`}>
              <a>
                <H3
                  className="title"
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  color="info.contrastText"
                  mb={1}
                  title={title}
                >
                  {title}
                </H3>
              </a>
            </Link>

            {!hideRating && (
              <BazarRating value={rating || 0} color="warn" readOnly />
            )}

            <FlexBox alignItems="center" mt={0.5}>
              <Box pr={1} fontWeight="600" color="info.contrastText">
                £{price.toFixed(2)}
              </Box>
              {!!discount && (
                <Box color="grey.600" fontWeight="600">
                  <del>{price?.toFixed(2)}</del>
                </Box>
              )}
            </FlexBox>
          </Box>
        </FlexBox>
      </ContentWrapper>

      <Dialog open={open} maxWidth={false} onClose={toggleDialog}>
        <DialogContent
          sx={{
            paddingBottom: "1.25rem",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: "0",
              right: "0",
            }}
            onClick={toggleDialog}
          >
            <Close className="close" fontSize="small" color="primary" />
          </IconButton>
        </DialogContent>
      </Dialog>
    </StyledBazarCard>
  );
};

export default ProductCard1;
