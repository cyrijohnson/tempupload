import React, { useState, useEffect } from "react";
import {
  Slider,
  Switch,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { useNode, useEditor } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { TwitterPicker } from "react-color";

import dynamic from "next/dynamic";
const FontPicker = dynamic(() => import("font-picker-react"), { ssr: false });

const fontsApiKey = "AIzaSyDPtqHOkdnMVZb6wrHcyz1Mwyn0Au-HCbI";

export const Text = ({
  text,
  fullWidth,
  fontSize,
  fontColor,
  textAlign,
  fontFamily,
  tagName,
}) => {
  const {
    connectors: { connect, drag },
    id,
    isActive,
    actions: { setProp },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setEditable(false);
      return;
    }
    !isActive && setEditable(false);
  }, [isActive, enabled]);

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      onClick={(e) => setEditable(true)}
      style={{ width: fullWidth ? "100%" : "auto", zIndex: 1 }}
    >
      <div style={{ display: "none" }}>
        <FontPicker
          limit={150}
          pickerId={id.toString().replace(/[^a-zA-Z ]/g, "")}
          apiKey={fontsApiKey}
          activeFontFamily={fontFamily}
        />
      </div>
      <ContentEditable
        className={
          "editable-text apply-font-" + id.toString().replace(/[^a-zA-Z ]/g, "")
        }
        disabled={!editable || !enabled}
        html={text}
        onChange={(e) => {
          // let value = e.target.value.replace(/<\/?[^>]+(>|$)/g, "");
          // let html = value.replace(/<div>/gi, "<br>").replace(/<\/div>/gi, "");
          setProp((props) => (props.text = e.target.value));
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.charCode == 13) {
            e.preventDefault();
          }
        }}
        tagName={tagName}
        style={{
          fontSize: `${fontSize}px`,
          color: fontColor,
          textAlign,
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
};

const TextSettings = () => {
  const {
    id,
    fullWidth,
    fontSize,
    fontColor,
    textAlign,
    fontFamily,
    tagName,
    actions: { setProp },
  } = useNode((node) => ({
    id: node.data.props.id,
    fullWidth: node.data.props.fullWidth,
    fontSize: node.data.props.fontSize,
    fontColor: node.data.props.fontColor,
    textAlign: node.data.props.textAlign,
    fontFamily: node.data.props.fontFamily,
    tagName: node.data.props.tagName,
  }));

  return (
    <>
      <FormControl
        size="small"
        component="fieldset"
        style={{ marginBottom: "15px", width: "100%" }}
      >
        <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography>Full Width</Typography>
          <Switch
            checked={fullWidth}
            onChange={(e) =>
              setProp((props) => (props.fullWidth = e.target.checked))
            }
          />
        </Grid>

        <Grid container justifyContent="space-between" item xs={12}>
          <Grid item xs={9}>
            <FontPicker
              style={{ width: "100%" }}
              limit={150}
              apiKey={fontsApiKey}
              activeFontFamily={fontFamily}
              onChange={(nextFont) =>
                setProp(
                  (props) =>
                    (props.fontFamily = nextFont.family ? nextFont.family : " ")
                )
              }
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              fullWidth
              size="small"
              value={tagName}
              onChange={(e) =>
                setProp((props) => (props.tagName = e.target.value))
              }
              sx={{ mb: 2 }}
            >
              <MenuItem value="h1">h1</MenuItem>
              <MenuItem value="h2">h2</MenuItem>
              <MenuItem value="h3">h3</MenuItem>
              <MenuItem value="h4">h4</MenuItem>
              <MenuItem value="h5">h5</MenuItem>
              <MenuItem value="h6">h6</MenuItem>
              <MenuItem value="p">p</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </FormControl>

      <Grid container justifyContent="center" sx={{ mb: 1 }}>
        <TwitterPicker
          triangle={"hide"}
          color={fontColor}
          onChangeComplete={(val) => {
            setProp((props) => (props.fontColor = val.hex));
          }}
        />
      </Grid>
      <FormLabel component="legend">Font size </FormLabel>
      <Slider
        value={fontSize || 10}
        step={5}
        min={1}
        max={150}
        valueLabelDisplay="auto"
        onChange={(_, value) => {
          setProp((props) => (props.fontSize = value ? value : " "));
        }}
      />
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Align</FormLabel>
        <RadioGroup
          value={textAlign}
          onChange={(e) =>
            setProp((props) => (props.textAlign = e.target.value))
          }
        >
          <FormControlLabel
            label="Left"
            value="left"
            control={<Radio size="small" color="primary" />}
          />
          <FormControlLabel
            label="Center"
            value="center"
            control={<Radio size="small" color="primary" />}
          />
          <FormControlLabel
            label="Right"
            value="right"
            control={<Radio size="small" color="primary" />}
          />
        </RadioGroup>
      </FormControl>
    </>
  );
};

Text.craft = {
  defaultProps: {
    fullWidth: false,
    text: "Text",
    fontSize: 20,
    fontColor: "#000",
    textAlign: "left",
    fontFamily: "Open Sans",
    tagName: "p",
  },
  rules: {
    canDrag: (node) =>
      node.data.props.canDrag == null || node.data.props.canDrag == true,
  },
  related: {
    settings: TextSettings,
  },
};
