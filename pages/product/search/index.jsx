import React, { useCallback, useState } from "react";

import {
  Card,
  Grid,
  MenuItem,
  TextField,
  SwipeableDrawer,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";

import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";
import ProductCard1List from "components/products/ProductCard1List";
import ProductCard9List from "components/products/ProductCard9List";
import ProductFilterCard from "components/products/ProductFilterCard";
import { H5, Paragraph } from "components/Typography";

// utils
import { useRouter } from "next/router";
import useWindowSize from "hooks/useWindowSize";

const ProductSearchResult = () => {
  // options
  const [view, setView] = useState("grid");
  const width = useWindowSize();

  const [sortSelected, setSortSelected] = useState("rhl");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // data
  const router = useRouter();
  const { query } = router;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  return (
    <NavbarLayout>
      <Box pt={2.5}>
        <Grid
          item
          lg={3}
          xs={12}
          sx={{
            mt: -5,
            mb: 3,
            "@media only screen and (min-width: 1024px)": {
              display: "none",
            },
          }}
        >
          <IconButton
            onClick={() => {
              setDrawerOpen(!drawerOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
        </Grid>

        <Box sx={{ width: 300, float: "right" }}>
          <FlexBox alignItems="center">
            <Paragraph color="grey.600" mr={2} whiteSpace="pre">
              Sort by:
            </Paragraph>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Short by"
              select
              defaultValue={sortOptions[0].value}
              onChange={(e) => {
                setSortSelected(e.target.value);
              }}
              fullWidth
              sx={{
                flex: "1 1 0",
                mr: "1.75rem",
                minWidth: "150px",
              }}
            >
              {sortOptions.map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </FlexBox>
        </Box>

        <Grid container spacing={3}>
          <Grid
            item
            lg={3}
            xs={12}
            sx={{
              "@media only screen and (max-width: 1024px)": {
                display: "none",
              },
            }}
          >
            <ProductFilterCard
              searchQuery={query}
              onProductsSearched={setProducts}
              page={page}
              sort={sortSelected}
            />
          </Grid>

          <Grid
            item
            lg={3}
            xs={12}
            sx={{
              "@media only screen and (min-width: 1024px)": {
                display: "none",
              },
            }}
          >
            <SwipeableDrawer
              anchor={"left"}
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onOpen={() => setDrawerOpen(true)}
            >
              <ProductFilterCard
                searchQuery={query}
                onProductsSearched={setProducts}
                page={page}
                sort={sortSelected}
              />
            </SwipeableDrawer>
          </Grid>

          <Grid item lg={9} xs={12}>
            <ProductCard1List products={products} onPageChange={setPage} />
          </Grid>
        </Grid>
      </Box>
    </NavbarLayout>
  );
};

const sortOptions = [
  {
    label: "Rating High to Low",
    value: "rhl",
  },
  {
    label: "Rating Low to High",
    value: "rlh",
  },
  {
    label: "Price High to Low",
    value: "phl",
  },
  {
    label: "Price Low to High",
    value: "plh",
  },
];
export default ProductSearchResult;
