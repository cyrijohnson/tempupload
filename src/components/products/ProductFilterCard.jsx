import React, { useEffect, useState, useCallback } from "react";
import FlexBox from "components/FlexBox";
import { H5, H6, Paragraph, Span } from "components/Typography";
import {
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Rating,
  TextField,
  Grid,
  Slider,
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { Box } from "@mui/system";

// utils
import axios from "utils/axios";

// contexts
import { useProducts } from "contexts/ProductsContext";
import { stringify } from "querystring";
import { ObjectSchema } from "yup";

const ProductFilterCard = ({ searchQuery, onProductsSearched, page, sort }) => {
  const { categories, brands, tags } = useProducts();

  const [colors, setColors] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
    tags: [],
    other: [],
    price_min: 0,
    price_max: 250,
    rating_min: 0,
    color: "",
  });

  useEffect(() => {
    axios
      .get("/colors")
      .then((res) => {
        setColors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      let searchParams = { ...selectedFilters };

      Object.keys(searchQuery).forEach((key, index) => {
        searchQuery[key] = Array.isArray(searchQuery[key])
          ? searchQuery[key][0].toUpperCase() + searchQuery[key].substring(1)
          : [searchQuery[key][0].toUpperCase() + searchQuery[key].substring(1)];
        searchParams[key] = searchQuery[key];
      });
      setSelectedFilters(searchParams);
      searchForProducts(searchParams);
    } else {
      searchForProducts(selectedFilters);
    }
  }, [searchQuery, page, sort]);

  const handleChange = (item, filter) => {
    // add or remove category based on if it is already selected
    const newFilters = selectedFilters[filter].includes(item.name)
      ? selectedFilters[filter].filter((itemName) => itemName !== item.name)
      : [...selectedFilters[filter], item.name];

    const appliedFilters = {
      ...selectedFilters,
      [filter]: newFilters,
    };
    setSelectedFilters(appliedFilters);
    searchForProducts(appliedFilters);
    console.log(appliedFilters);
  };

  const handleSliderChange = useCallback((event, value) => {
    debounceSliderChange(event, value);
  }, []);

  const debounceSliderChange = debounce((e, val) => {
    console.log(val);
    const appliedFilters = {
      ...selectedFilters,
      price_min: val[0],
      price_max: val[1],
    };
    setSelectedFilters(appliedFilters);
    searchForProducts(appliedFilters);
  }, 200);

  const searchForProducts = async (filters) => {
    let queryString = "";
    // apply checkbox filters
    Object.keys(filters).forEach((key, index) => {
      if (filters[key].length > 0 && Array.isArray(filters[key])) {
        if (index != 0) queryString += "&";
        queryString += `${key}.name=${filters[key].join(`&${key}.name=`)}`;
      }
    });

    // apply price filters
    if (filters.price_min > 0) queryString += `&price_gte=${filters.price_min}`;
    if (filters.price_max < 250)
      queryString += `&price_lte=${filters.price_max}`;

    // apply rating filters
    if (filters.rating_min > 0)
      queryString += `&rating_gte=${filters.rating_min}`;

    // apply color filter
    if (filters.color.length > 0) queryString += `&color=${filters.color}`;

    // console.log(queryString);
    let sortSel = "";
    switch (sort) {
      case "phl":
        sortSel = "price:DESC";
        break;
      case "plh":
        sortSel = "price:ASC";
        break;
      case "rhl":
        sortSel = "rating:DESC";
        break;
      case "rlh":
        sortSel = "rating:ASC";
        break;
    }
    const response = await axios.get(
      `/products?${queryString}&_limit=9&_start=${page - 1}&_sort=${sortSel}`
    );
    // console.log(response.data);
    onProductsSearched(response.data);
  };

  return (
    <Card
      sx={{
        p: "18px 27px",
        overflow: "auto",
      }}
      elevation={0}
    >
      <H6 mb={2}>Brands</H6>
      {brands.map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              size="large"
              color="info"
              checked={selectedFilters.brand.includes(item.name)}
            />
          }
          onChange={() => {
            handleChange(item, "brand");
          }}
          label={<Span color="inherit">{item.name}</Span>}
          sx={{
            display: "flex",
          }}
          key={item.name}
        />
      ))}

      <Divider
        sx={{
          my: "1.5rem",
        }}
      />

      <H6 mb={2}>Categories</H6>
      {categories
        .filter((c) => !c.isShop)
        .map((item) => (
          <FormControlLabel
            control={
              <Checkbox
                size="large"
                color="info"
                checked={selectedFilters.category.includes(item.name)}
              />
            }
            onChange={() => {
              handleChange(item, "category");
            }}
            label={<Span color="inherit">{item.name}</Span>}
            sx={{
              display: "flex",
            }}
            key={item.name}
          />
        ))}

      <Divider
        sx={{
          mt: "18px",
          mb: "24px",
        }}
      />

      <H6 mb={2}>Tags</H6>
      {tags.map((item) => (
        <FormControlLabel
          control={<Checkbox size="large" color="info" />}
          onChange={() => {
            handleChange(item, "tags");
          }}
          label={<Span color="inherit">{item.name}</Span>}
          sx={{
            display: "flex",
          }}
          key={item.name}
        />
      ))}

      <Divider
        sx={{
          my: "1.5rem",
        }}
      />

      <H6 mb={4}>Price Range</H6>
      <Slider
        getAriaLabel={() => "Price range"}
        defaultValue={[selectedFilters.price_min, selectedFilters.price_max]}
        onChange={(e, v) => handleSliderChange(e, v)}
        step={10}
        marks
        min={0}
        max={250}
        valueLabelDisplay="on"
        getAriaValueText={(val) => `£${val[0]} - £${val[1]}`}
      />

      <Divider
        sx={{
          my: "1.5rem",
        }}
      />

      <H6 mb={2}>Minimum Rating</H6>
      <Rating
        size="large"
        precision={0.5}
        value={selectedFilters.rating_min}
        onChangeCommitted={(e) => {
          const appliedFilters = {
            ...selectedFilters,
            rating_min: Number(e.target.value),
          };
          setSelectedFilters(appliedFilters);
          searchForProducts(appliedFilters);
        }}
        color="warn"
      />

      <Divider
        sx={{
          my: "1.5rem",
        }}
      />

      <H6 mb={2}>Colors</H6>
      <Grid container mb={2}>
        {colors.map((item) => (
          <Grid
            item
            sx={{
              bgcolor: item.color,
              height: "25px",
              width: "25px",
              borderRadius: 300,
              border: "1px solid #000",
              cursor: "pointer",
              mr: 1,
              mb: 1,
            }}
            key={item.id}
            onClick={() => {
              console.log(item.name);
              const appliedFilters = {
                ...selectedFilters,
                color: item.name,
              };
              setSelectedFilters(appliedFilters);
              searchForProducts(appliedFilters);
            }}
          />
        ))}
        <Grid
          item
          sx={{
            height: "25px",
            borderRadius: 300,
            border: "1px solid #000",
            cursor: "pointer",
            mr: 1,
            mb: 1,
            px: 1,
          }}
          onClick={() => {
            const appliedFilters = {
              ...selectedFilters,
              color: "",
            };
            setSelectedFilters(appliedFilters);
            searchForProducts(appliedFilters);
          }}
        >
          Clear
        </Grid>
      </Grid>
    </Card>
  );
};

const otherOptions = ["On Sale", "In Stock", "Featured"];
export default ProductFilterCard;
