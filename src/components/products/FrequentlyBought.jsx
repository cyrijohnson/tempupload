import FlexBox from "components/FlexBox";
import BazarButton from "components/BazarButton";
import ProductCard8 from "components/product-cards/ProductCard8";
import { H2, H3, Span } from "components/Typography";
import { Box, styled } from "@mui/material";
import React, { Fragment } from "react"; // styled component

const WrapperBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("xs")]: {
    "& .card-holder": {
      position: "relative",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
    },
    "& .gray-box": {
      minWidth: 0,
      width: "100%",
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

const FrequentlyBought = ({ productsData }) => {
  return (
    <WrapperBox mb={7.5}>
      <H3 mb={3}>CREATE A KIT</H3>
      <FlexBox className="card-holder" flexWrap="wrap">
        {productsData.map((item, ind) => (
          <Fragment key={item.id}>
            <ProductCard8
              sx={{
                m: "0.5rem",
                maxWidth: "220px",
                minWidth: "160px",
                width: "100%",
                flex: "1 1 0",
              }}
              {...item}
            />
            {ind < productsData.length - 1 && (
              <FlexBox justifyContent="center" alignItems="center">
                <H2 color="grey.600" mx={1}>
                  +
                </H2>
              </FlexBox>
            )}
          </Fragment>
        ))}

        <FlexBox justifyContent="center" alignItems="center">
          <H2 color="grey.600" mx={3}>
            =
          </H2>
        </FlexBox>

        <FlexBox
          borderColor="grey.400"
          m={5}
          justifyContent="center"
          alignItems="center"
        >
          <H3 color="primary.main" mb={2}>
            £{productsData.reduce((acc, p) => (acc += p.price), 0).toFixed(2)}
          </H3>
          {/* <Span mb={2} fontWeight="600" color="grey.600">
            Save $500
          </Span> */}

          {/* <FlexBox>
            <BazarButton
              variant="contained"
              color="primary"
              sx={{
                mr: "1rem",
              }}
            >
              Add to Cart
            </BazarButton>
            <BazarButton variant="outlined" color="primary">
              Add to List
            </BazarButton>
          </FlexBox> */}
        </FlexBox>
      </FlexBox>
    </WrapperBox>
  );
};

export default FrequentlyBought;
