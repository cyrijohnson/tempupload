import { useState, useEffect } from "react";

// mui
import { Card, Grid, Popover } from "@mui/material";

export default function ColorPicker({
  size,
  pickerSize,
  colors,
  selectedColor,
  onChange,
  radius,
  elevation,
}) {
  const [anchor, setAnchor] = useState(null);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(selectedColor);

  return (
    <div>
      <Card
        elevation={elevation ?? 5}
        onClick={(e) => {
          setAnchor(e.currentTarget);
          setShowColorPicker(!showColorPicker);
        }}
        style={{
          backgroundColor: color,
          width: size ?? "3em",
          height: size ?? "3em",
          borderRadius: radius ?? "5px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: radius ?? "5px",
            backgroundColor: color,
          }}
        />
      </Card>
      <Popover
        id={`color-picker-${color}`}
        open={colors && showColorPicker}
        onClose={() => setShowColorPicker(false)}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Card sx={{ bgcolor: "#fcfcfc" }}>
          <Grid
            container
            sx={{
              width: pickerSize ?? "12em",
              height: pickerSize ? pickerSize * 0.75 : "9em",
            }}
            justifyContent="center"
            alignItems="center"
            // ref={wrapperRef}
          >
            {colors &&
              colors.map((c) => (
                <Grid
                  item
                  xs={3}
                  key={c.color}
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  <Card
                    elevation={2}
                    sx={{
                      width: pickerSize ? (pickerSize * 0.75) / 6 : "100%",
                      height: pickerSize ? (pickerSize * 0.75) / 6 : "100%",
                      borderRadius: radius ?? "5px",
                      backgroundColor: c.color,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: color === c.color ? "2px solid #fff" : "",
                      transition: "all 0.1s ease-in-out",
                      "&:hover": {
                        outline: "inset 2px #fff",
                        outlineOffset: "-2px",
                      },
                    }}
                    onClick={() => {
                      setColor(c.color);
                      if (onChange) onChange(c.color);
                      setShowColorPicker(!showColorPicker);
                    }}
                  />
                </Grid>
              ))}
          </Grid>
        </Card>
      </Popover>
    </div>
  );
}
