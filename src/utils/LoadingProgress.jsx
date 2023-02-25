import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import _ from "lodash";

export default function LoadingProgress({ data, children }) {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {_.isEmpty(data) && <LinearProgress />}
      {!_.isEmpty(data) && children}
    </Box>
  );
}
