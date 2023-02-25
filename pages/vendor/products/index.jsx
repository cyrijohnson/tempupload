import { useState, useEffect } from "react";

// mui
import East from "@mui/icons-material/East";
import { Avatar, IconButton, Pagination, Typography } from "@mui/material";

// custom components
import FlexBox from "components/FlexBox";
import DeliveryBox from "components/icons/DeliveryBox";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";
import Link from "next/link";

// utils
import { useProducts } from "contexts/ProductsContext";
import { SERVER_URL } from "constant";
import { paginate } from "utils/utils";

const Products = () => {
  const { products } = useProducts();

  const [perPage, setPerPage] = useState(5);
  const [toShow, setToShow] = useState([]);

  useEffect(() => {
    setToShow(paginate(products, perPage, 1));
  }, [products, perPage]);

  return (
    <VendorDashboardLayout>
      <DashboardPageHeader title="Products" icon={DeliveryBox} />

      <TableRow
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          padding: "0px 18px",
          mb: "-0.125rem",
          bgcolor: "transparent",
        }}
        elevation={0}
      >
        <FlexBox my="0px" mx={0.75} flex="2 2 220px !important">
          <H5 ml={7} color="grey.600" textAlign="left">
            Name
          </H5>
        </FlexBox>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Stock
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Regular price
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          SKU
        </H5>
        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} my="0px"></H5>
      </TableRow>

      {toShow.map((item, ind) => (
        <Link href={`/vendor/products/${item.id}`} key={ind}>
          <TableRow
            sx={{
              my: "1rem",
              padding: "6px 18px",
            }}
          >
            <FlexBox alignItems="center" m={0.75} flex="2 2 220px !important">
              {!item.images ||
                (!item.images[0] && (
                  <Avatar
                    sx={{
                      height: 36,
                      width: 36,
                    }}
                  />
                ))}
              {item.images && item.images[0] && item.images[0].formats && (
                <Avatar
                  src={SERVER_URL + item.images[0].formats.thumbnail.url}
                  sx={{
                    height: 36,
                    width: 36,
                  }}
                />
              )}
              <Typography textAlign="left" ml={2.5}>
                {item.name}
              </Typography>
            </FlexBox>
            <H5
              m={0.75}
              textAlign="left"
              fontWeight="600"
              color={item.stock < 6 ? "error.main" : "inherit"}
            >
              {item.stock.toString().padStart(2, "0")}
            </H5>
            <H5 m={0.75} textAlign="left" fontWeight="400">
              £{item.price.toFixed(2)}
            </H5>
            <H5 m={0.75} textAlign="left" fontWeight="400">
              {item.sku}
            </H5>

            <Typography
              textAlign="center"
              color="grey.600"
              sx={{
                flex: "0 0 0 !important",
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              <IconButton>
                <East fontSize="small" color="inherit" />
              </IconButton>
            </Typography>
          </TableRow>
        </Link>
      ))}

      <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={Math.ceil(products.length / perPage)}
          onChange={(e, p) => {
            setToShow(paginate(products, perPage, p));
          }}
        />
      </FlexBox>
    </VendorDashboardLayout>
  );
};

export default Products;
