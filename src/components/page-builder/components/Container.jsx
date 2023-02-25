import React from "react";
import {
  Grid,
  Slider,
  Switch,
  Typography,
  Paper,
  Select,
  MenuItem,
  Divider,
  TextField,
} from "@mui/material";
import { useNode } from "@craftjs/core";
import { TwitterPicker } from "react-color";
import StrapiMediaLibrary from "components/page-builder/StrapiMediaLibrary";

import { SERVER_URL } from "constant";

export const Container = ({
  padding,
  margin,
  minHeight,
  height,
  backgroundColor,
  backgroundImage,
  backgroundObjectFit,
  desktopSize,
  mobileSize,
  flex,
  justify,
  align,
  children,
  radius,
  elevation,
  darken,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Grid
      item
      ref={(ref) => connect(drag(ref))}
      md={desktopSize}
      xs={mobileSize}
      sx={{
        borderRadius: radius + "%",
        minHeight,
        height,
      }}
    >
      <Paper
        elevation={elevation}
        sx={{
          margin,
          borderRadius: radius + "%",
          width: "100%",
          height: "100%",
          minHeight,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {darken > 0 && (
          <div
            style={{
              position: "absolute",
              background: `rgba(0, 0, 0, ${darken})`,
              width: "100%",
              height: "100%",
              minHeight,
              opacity: 1,
              pointerEvents: "none",
            }}
          />
        )}
        <Grid
          sx={{
            width: "100%",
            height: "100%",
            minHeight,
            padding,
            backgroundColor,
            backgroundImage: 'url("' + SERVER_URL + backgroundImage + '")',
            backgroundSize: backgroundObjectFit,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          container={flex}
          justifyContent={justify}
          alignItems={align}
        >
          {children}
        </Grid>
      </Paper>
    </Grid>
  );
};

const ContainerSettings = () => {
  const {
    id,
    minHeight,
    height,
    margin,
    padding,
    backgroundColor,
    backgroundImage,
    backgroundObjectFit,
    desktopSize,
    mobileSize,
    flex,
    justify,
    align,
    elevation,
    radius,
    darken,
    actions: { setProp },
  } = useNode((node) => ({
    id: node.data.props.id,
    minHeight: node.data.props.minHeight,
    height: node.data.props.height,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    backgroundColor: node.data.props.backgroundColor,
    backgroundImage: node.data.props.backgroundImage,
    backgroundObjectFit: node.data.props.backgroundObjectFit,
    desktopSize: node.data.props.desktopSize,
    mobileSize: node.data.props.mobileSize,
    flex: node.data.props.flex,
    justify: node.data.props.justify,
    align: node.data.props.align,
    radius: node.data.props.radius,
    elevation: node.data.props.elevation,
    darken: node.data.props.darken,
  }));

  return (
    <>
      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={6}>
          <Typography>Min Height</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            value={minHeight}
            onChange={(e) =>
              setProp((props) => (props.minHeight = e.target.value))
            }
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

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" item xs={12}>
        <Typography>Border Radius</Typography>
        <Grid item xs={10}>
          <Slider
            value={radius}
            onChange={(e, value) => setProp((props) => (props.radius = value))}
            valueLabelDisplay="auto"
            min={0}
            max={50}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography>{radius}</Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" item xs={12}>
        <Typography>Shadow</Typography>
        <Grid item xs={10}>
          <Slider
            value={elevation}
            onChange={(e, value) =>
              setProp((props) => (props.elevation = value))
            }
            valueLabelDisplay="auto"
            min={0}
            max={24}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography>{elevation}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" item xs={12}>
        <Typography>Desktop Size</Typography>
        <Grid item xs={10}>
          <Slider
            value={desktopSize}
            onChange={(e, value) =>
              setProp((props) => (props.desktopSize = value))
            }
            valueLabelDisplay="auto"
            min={1}
            max={12}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography>{desktopSize}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between" item xs={12}>
        <Typography>Mobile Size</Typography>
        <Grid item xs={10}>
          <Slider
            value={mobileSize}
            onChange={(e, value) =>
              setProp((props) => (props.mobileSize = value))
            }
            valueLabelDisplay="auto"
            min={1}
            max={12}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography>{mobileSize}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={4}>
          <Typography>Flex</Typography>
        </Grid>
        <Grid item xs={4}>
          <Switch
            checked={flex}
            onChange={(e) =>
              setProp((props) => (props.flex = e.target.checked))
            }
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={4}>
          <Typography>Justify</Typography>
        </Grid>
        <Grid item xs={4}>
          <Select
            fullWidth
            size="small"
            value={justify}
            onChange={(e) =>
              setProp((props) => (props.justify = e.target.value))
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="flex-start">flex-start</MenuItem>
            <MenuItem value="flex-end">flex-end</MenuItem>
            <MenuItem value="center">center</MenuItem>
            <MenuItem value="space-between">space-between</MenuItem>
            <MenuItem value="space-around">space-around</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={4}>
          <Typography>Align</Typography>
        </Grid>
        <Grid item xs={4}>
          <Select
            fullWidth
            size="small"
            value={align}
            onChange={(e) => setProp((props) => (props.align = e.target.value))}
            sx={{ mb: 2 }}
          >
            <MenuItem value="flex-start">flex-start</MenuItem>
            <MenuItem value="flex-end">flex-end</MenuItem>
            <MenuItem value="center">center</MenuItem>
            <MenuItem value="baseline">baseline</MenuItem>
            <MenuItem value="stretch">stretch</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" item xs={12} mb={3}>
        <Grid item xs={12}>
          <Typography>Background Color</Typography>
        </Grid>
        <Grid item xs={12}>
          <TwitterPicker
            triangle={"hide"}
            color={backgroundColor}
            onChange={(val) =>
              setProp((props) => (props.backgroundColor = val.hex))
            }
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography>Darken</Typography>
      </Grid>
      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={10}>
          <Slider
            value={darken}
            onChange={(e, value) => setProp((props) => (props.darken = value))}
            valueLabelDisplay="auto"
            min={0}
            max={1}
            step={0.1}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography>{darken}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={12}>
          <Typography>Background Image</Typography>
        </Grid>
        <Grid item xs={12}>
          <StrapiMediaLibrary
            image={backgroundImage}
            onSelect={(media) => {
              if (media) {
                setProp((props) => (props.backgroundImage = media.url));
              } else {
                setProp((props) => (props.backgroundImage = null));
              }
            }}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" item xs={12}>
        <Grid item xs={12}>
          <Typography>Background Object Fit</Typography>
        </Grid>
        <Grid item xs={12}>
          <Select
            fullWidth
            size="small"
            value={backgroundObjectFit}
            onChange={(e) =>
              setProp((props) => (props.backgroundObjectFit = e.target.value))
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="auto">auto</MenuItem>
            <MenuItem value="contain">contain</MenuItem>
            <MenuItem value="cover">cover</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </>
  );
};

Container.craft = {
  defaultProps: {
    minHeight: "200px",
    height: "100%",
    margin: 0,
    padding: 0,
    backgroundColor: "#fff",
    backgroundImage: "",
    backgroundObjectFit: "auto",
    desktopSize: 6,
    mobileSize: 12,
    flex: false,
    justify: "center",
    align: "center",
    radius: 0,
    elevation: 0,
    darken: 0,
  },
  related: {
    settings: ContainerSettings,
  },
  rules: {
    canMoveIn: (incomingNodes) => incomingNodes.every((incomingNode) => true),
  },
};
