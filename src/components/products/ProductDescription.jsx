import { Box } from "@mui/material";
import React from "react";
const parse = require("html-react-parser");

const ProductDescription = ({ description }) => {
  return <Box sx={{ maxHeight: 400 }}>{parse(description)}</Box>;
};

export default ProductDescription;
