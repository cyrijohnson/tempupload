import BazarAvatar from "components/BazarAvatar";
import BazarRating from "components/BazarRating";
import FlexBox from "components/FlexBox";
import { H5, H6, Paragraph, Span } from "components/Typography";
import { Box, Divider } from "@mui/material";
import { getDateDifference } from "utils/utils";
import React from "react";

const ProductComment = ({ user, rating, date, content }) => {
  return (
    <Box mb={2} maxWidth="600px">
      <FlexBox alignItems="center" mb={1}>
        {/* <BazarAvatar src={imgUrl} height={48} width={48} /> */}
        <Box ml={2}>
          <H5 mb={0.5}>{user}</H5>
          <FlexBox alignItems="center">
            <BazarRating value={rating} color="warn" readOnly />
            <Span ml={1} mr={1}>
              {" "}
              -{" "}
            </Span>
            <Span>{getDateDifference(date)}</Span>

            {/* <H6 mx={1.25}>{rating}</H6> */}
          </FlexBox>
        </Box>
      </FlexBox>

      <Paragraph color="grey.700">{content}</Paragraph>
      <Divider sx={{ mt: 0.5, mb: 1 }} />
    </Box>
  );
};

export default ProductComment;
