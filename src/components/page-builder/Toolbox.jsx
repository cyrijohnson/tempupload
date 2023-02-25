// components/Toolbox.js
import React from "react";
import { Box, Typography, Grid, Button as MaterialButton } from "@mui/material";
import { Element, useEditor } from "@craftjs/core";

import { Container } from "./components/Container";
import { Text } from "./components/Text";
import { Image } from "./components/Image";
import { Button } from "./components/Button";

export const Toolbox = () => {
  const { connectors, query } = useEditor();

  return (
    <Box px={2} py={2} sx={{ minWidth: "100%", width: "100%" }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={1}
      >
        <Box pb={2}>
          <Typography>Drag to add</Typography>
        </Box>
        <Grid container direction="column" item>
          <MaterialButton
            variant="contained"
            ref={(ref) =>
              connectors.create(
                ref,
                <Element
                  is={Container}
                  backgroundColor="#eee"
                  size={6}
                  canvas
                />
              )
            }
          >
            Container
          </MaterialButton>
        </Grid>

        <Grid container direction="column" item>
          <MaterialButton
            variant="contained"
            ref={(ref) => connectors.create(ref, <Text />)}
          >
            Text
          </MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton
            variant="contained"
            ref={(ref) =>
              connectors.create(
                ref,
                <Image src="/ImgNotFound.png" objectFit="contain" />
              )
            }
          >
            Image
          </MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton
            variant="contained"
            ref={(ref) =>
              connectors.create(
                ref,
                <Element
                  is={Button}
                  canvas
                  variant="contained"
                  color="secondary"
                />
              )
            }
          >
            Button
          </MaterialButton>
        </Grid>
      </Grid>
    </Box>
  );
};
