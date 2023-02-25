import React from "react";
import {
  Grid,
  Button as MaterialButton,
  Slider,
  Select,
  MenuItem,
  Switch,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useNode } from "@craftjs/core";

export const Button = ({
  variant,
  color,
  fullWidth,
  padding,
  redirect,
  radius,
  elevation,
  children,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <MaterialButton
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      ref={(ref) => connect(drag(ref))}
      sx={{
        minWidth: children ? "auto" : 100,
        minHeight: children ? "auto" : 40,
        padding: padding,
        boxShadow: elevation,
        borderRadius: radius + "%",
        overflow: "hidden",
      }}
    >
      {children}
    </MaterialButton>
  );
};

const ButtonSettings = () => {
  const {
    id,
    variant,
    color,
    fullWidth,
    padding,
    radius,
    elevation,
    redirect,
    actions: { setProp },
  } = useNode((node) => ({
    id: node.data.props.id,
    size: node.data.props.size,
    variant: node.data.props.variant,
    color: node.data.props.color,
    fullWidth: node.data.props.fullWidth,
    padding: node.data.props.padding,
    redirect: node.data.props.redirect,
    radius: node.data.props.radius,
    elevation: node.data.props.elevation,
  }));

  return (
    <>
      <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography>Padding</Typography>
        <Slider
          value={padding}
          step={1}
          min={0}
          max={10}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            setProp((props) => (props.padding = value ? value : 0));
          }}
        />
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography>Full Width</Typography>
        <Switch
          checked={fullWidth}
          onChange={(e) =>
            setProp((props) => (props.fullWidth = e.target.checked))
          }
        />
      </Grid>
      <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography>Variant</Typography>
        <Select
          size="small"
          value={variant}
          onChange={(e) => setProp((props) => (props.variant = e.target.value))}
        >
          <MenuItem value="contained">Contained</MenuItem>
          <MenuItem value="outlined">Outlined</MenuItem>
          <MenuItem value="text">Text</MenuItem>
        </Select>
      </Grid>

      <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography>Color</Typography>
        <Select
          size="small"
          value={color}
          onChange={(e) => setProp((props) => (props.color = e.target.value))}
        >
          <MenuItem value="inherit">Default</MenuItem>
          <MenuItem value="primary">Primary</MenuItem>
          <MenuItem value="secondary">Secondary</MenuItem>
          <MenuItem value="info">Info</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="warning">Warning</MenuItem>
          <MenuItem value="error">Error</MenuItem>
        </Select>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography>Border Radius</Typography>
        <Slider
          value={radius || 0}
          min={1}
          max={50}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            setProp((props) => (props.radius = value ? value : " "));
          }}
        />
      </Grid>

      <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography>Elevation</Typography>
        <Slider
          value={elevation || 0}
          min={0}
          max={24}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            setProp((props) => (props.elevation = value ? value : " "));
          }}
        />
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography>Redirect</Typography>
        <TextField
          value={redirect}
          onChange={(e) =>
            setProp((props) => (props.redirect = e.target.value))
          }
        />
      </Grid>
    </>
  );
};

Button.craft = {
  defaultProps: {
    size: "medium",
    variant: "contained",
    color: "inherit",
    fullWidth: false,
    padding: 0,
    redirect: "",
    radius: 0,
    elevation: 0,
  },
  related: {
    settings: ButtonSettings,
  },
  rules: {
    canMoveIn: (incomingNodes) => incomingNodes.every((incomingNode) => true),
  },
};
