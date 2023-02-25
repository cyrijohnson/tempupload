import { useState, useCallback } from "react";

// mui
import { styled } from "@mui/material/styles";
import { debounce } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TextField from "@mui/material/TextField";

// custom components
import ColorPicker from "components/ColorPicker";

// utils
import ctx from "contexts/Customization";
import { useCart } from "react-use-cart";
import { useProducts } from "contexts/ProductsContext";

// component ovverides
const Input = styled("input")({
  display: "none",
});

export default function CustomizationAreaSelector({ product }) {
  const {
    areas,
    addAreaToCustomization,
    setColorForCustomization,
    setTextForCustomization,
    setImageForCustomization,
  } = ctx.useCustomizations();

  const { items } = useCart();
  const { rjmColors } = useProducts();
  const prod = items.find((item) => item.id === product.id);

  const changeColorDebounced = debounce(
    (prod, customization, color) =>
      setColorForCustomization(prod, customization, color),
    500
  );

  const changeTextDebounced = debounce(
    (prod, customization, text) =>
      setTextForCustomization(prod, customization, text),
    500
  );

  const availableAreas = areas.filter((area) => {
    let product = area.products.find((p) => {
      console.log(p.id, prod.productID);
      return p.id == prod.productID;
    });
    return product;
  });

  return (
    <Grid container justifyContent="center" spacing={3}>
      {prod.customizations.map((customization, index) => (
        <Grid
          item
          md={6}
          xs={10}
          container
          justifyContent="space-between"
          key={index}
        >
          <Card sx={{ p: 3, width: "100%", height: "100%" }}>
            <Grid container justifyContent="space-between">
              <Grid item xs={12}>
                <h3 style={{ marginTop: -5 }}>{customization.name}</h3>
              </Grid>
              <Grid item md={12} xs={12} mb={3}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="simple-select-standard-label">
                    {"Location"}
                  </InputLabel>
                  <Select
                    onChange={(e) => {
                      let area = availableAreas.find(
                        (area) => area.id == e.target.value
                      );
                      addAreaToCustomization(prod, customization, area);
                    }}
                    label="Select Area"
                    value={customization.area ? customization.area.id : -1}
                    defaultValue={
                      customization.area ? customization.area.id : undefined
                    }
                  >
                    <MenuItem value={-1}>
                      <em>None</em>
                    </MenuItem>
                    {availableAreas.map((area, index) => (
                      <MenuItem
                        value={area.id}
                        key={index}
                        disabled={
                          prod.customizations.find(
                            (c) => c.area && c.area.id == area.id
                          ) !== undefined
                        }
                      >
                        {area.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={4}>
                <InputLabel>{"Color"}</InputLabel>
                <ColorPicker
                  selectedColor={customization.color}
                  colors={rjmColors}
                  radius="50%"
                  elevation={8}
                  pickerSize={200}
                  onChange={(color) =>
                    changeColorDebounced(prod, customization, color)
                  }
                />
              </Grid>
              {customization.type == "image" && (
                <Grid
                  item
                  md={8}
                  xs={6}
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  {prod.customizations.find(
                    (c) => c.id == customization.id && c.uploadedImage
                  ) == undefined && (
                    <label htmlFor="contained-button-file">
                      <InputLabel>{"Image"}</InputLabel>
                      <Input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(e) => {
                          setImageForCustomization(
                            prod,
                            customization,
                            e.target.files[0]
                          );
                        }}
                      />
                      <Button variant="contained" component="span">
                        Upload
                      </Button>
                    </label>
                  )}
                  {prod.customizations.find(
                    (c) => c.id == customization.id && c.uploadedImage
                  ) !== undefined && (
                    <Grid container justifyContent="end" alignItems="center">
                      <Grid item>
                        <h4>
                          {
                            prod.customizations.find(
                              (c) => c.id == customization.id
                            ).uploadedImage.name
                          }
                        </h4>
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => {
                            setImageForCustomization(
                              prod,
                              customization,
                              undefined
                            );
                          }}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
              {customization.type == "text" && (
                <Grid item md={8} xs={8}>
                  <InputLabel>{"Content"}</InputLabel>
                  <TextField
                    fullWidth
                    defaultValue={customization.uploadedText}
                    onChange={(e) => {
                      changeTextDebounced(prod, customization, e.target.value);
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
