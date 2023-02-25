import BazarMenu from "components/BazarMenu";
import FlexBox from "components/FlexBox";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Box, Card, MenuItem, TextField } from "@mui/material";
import TouchRipple from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react"; // styled components
// also used in the GrocerySearchBox component

// utils
import axios from "utils/axios";
// import useThrottle from "hooks/useThrottle";

export const SearchOutlinedIcon = styled(SearchOutlined)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  marginRight: 6,
})); // also used in the GrocerySearchBox component

export const SearchResultCard = styled(Card)(() => ({
  position: "absolute",
  top: "100%",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  width: "100%",
  zIndex: 99,
}));

const SearchBox = () => {
  // const [category, setCategory] = useState("All Categories");
  const [resultList, setResultList] = useState([]);
  const parentRef = useRef();

  // search
  // const [searchInputValue, setSearchInputValue] = useState("");
  // const searchThrotteled = useThrottle(searchInputValue, 500);

  const search = debounce(async (e) => {
    const value = e.target?.value;
    if (!value || value.length < 3) setResultList([]);
    else {
      // search on the db
      const { data } = await axios.get(`/products/search?q=${value}`);
      console.log(data);
      setResultList(data);
    }
  }, 200);
  const hanldeSearch = useCallback((event) => {
    event.persist();
    search(event);
  }, []);

  const handleDocumentClick = () => {
    setResultList([]);
  };

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <Box
      position="relative"
      flex="1 1 0"
      maxWidth="670px"
      mx="auto"
      {...{
        ref: parentRef,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="SEARCH RJM.COM"
        fullWidth
        onChange={hanldeSearch}
        InputProps={{
          sx: {
            height: 35,
            minWidth: 300,
            paddingRight: 0,
            borderRadius: 0,
            color: "white",
            overflow: "hidden",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey.500",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey.500",
            },
          },
          startAdornment: <SearchOutlinedIcon fontSize="small" />,
        }}
      />

      {!!resultList.length && (
        <SearchResultCard elevation={2}>
          {resultList.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id}>
              <MenuItem key={item.id}>{item.name}</MenuItem>
            </Link>
          ))}
        </SearchResultCard>
      )}
    </Box>
  );
};

export default SearchBox;
