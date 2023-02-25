import React from "react";

import {
  Grid,
  Typography,
  Slider,
  Select,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material";

import LazyImage from "components/LazyImage";
import StrapiMediaLibrary from "components/page-builder/StrapiMediaLibrary";

import { useNode } from "@craftjs/core";
import { SERVER_URL } from "constant";

export const Image = ({
  src,
  padding,
  margin,
  width,
  height,
  objectFit,
  layout,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Grid
      ref={(ref) => connect(drag(ref))}
      sx={{ padding, margin, width, height, minHeight: height }}
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <LazyImage
          src={src}
          layout={layout}
          width="100%"
          height="100%"
          objectFit={objectFit}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </Grid>
  );
};

const ImageSettings = () => {
  const {
    id,
    src,
    padding,
    margin,
    width,
    height,
    objectFit,
    layout,
    actions: { setProp },
  } = useNode((node) => ({
    src: node.data.props.src,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    width: node.data.props.width,
    height: node.data.props.height,
    objectFit: node.data.props.objectFit,
    layout: node.data.props.layout,
  }));

  return (
    <>
      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={12}>
          <Typography>Image</Typography>
        </Grid>
        <Grid item xs={12}>
          <StrapiMediaLibrary
            image={src}
            onSelect={(media) => {
              if (media) {
                setProp((props) => (props.src = SERVER_URL + media.url));
              } else {
                setProp((props) => (props.src = "/ImgNotFound.png"));
              }
            }}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={12}>
          <Typography>Image Fit</Typography>
        </Grid>
        <Grid item xs={12}>
          <Select
            fullWidth
            size="small"
            value={objectFit}
            onChange={(e) =>
              setProp((props) => (props.objectFit = e.target.value))
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="auto">auto</MenuItem>
            <MenuItem value="contain">contain</MenuItem>
            <MenuItem value="cover">cover</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={12}>
          <Typography>Image Layout</Typography>
        </Grid>
        <Grid item xs={12}>
          <Select
            fullWidth
            size="small"
            value={layout}
            onChange={(e) =>
              setProp((props) => (props.layout = e.target.value))
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="fixed">fixed</MenuItem>
            <MenuItem value="fill">fill</MenuItem>
            <MenuItem value="responsive">responsive</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={6}>
          <Typography>Width</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            value={width}
            onChange={(e) => setProp((props) => (props.width = e.target.value))}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={6}>
          <Typography>Height</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            value={height}
            onChange={(e) =>
              setProp((props) => (props.height = e.target.value))
            }
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={4}>
          <Typography>Margin</Typography>
          <Slider
            value={margin}
            onChange={(e, value) => setProp((props) => (props.margin = value))}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={1}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography>Padding</Typography>
          <Slider
            value={padding}
            onChange={(e, value) => setProp((props) => (props.padding = value))}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={1}
          />
        </Grid>
      </Grid>
    </>
  );
};

Image.craft = {
  defaultProps: {
    src: "/ImgNotFound.png",
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100%",
    objectFit: "auto",
    layout: "fixed",
  },
  related: {
    settings: ImageSettings,
  },
};
