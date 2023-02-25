import React, { useState, useEffect } from "react";

// mui
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";

// custom components
import BazarButton from "components/BazarButton";
import FlexBox from "components/FlexBox";
import { H1, H2, H3, H4 } from "components/Typography";

// utils
import { useCart } from "react-use-cart";
import { SERVER_URL } from "constant";
import useAuth from "contexts/useAuth";
import axios from "utils/axios";

const SizerGrid = ({ parent, variants }) => {
  const { items, addItem, updateItemQuantity } = useCart();
  const { user, refreshUser } = useAuth();

  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    let s = [];
    variants.forEach((variant) => {
      let itm = items.find(
        (item) => item.id == variant.id && item.variation == item.variation
      );
      let qty = itm ? itm.quantity : 0;
      s.push({
        ...variant,
        amount: qty,
      });
    });
    // console.log(s);
    setSizes(s);
  }, [variants]);

  return (
    <>
      <Box
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          display: { xs: "none", md: "inherit" },
        }}
      >
        <Table
          sx={{
            borderCollapse: "separate",
            borderSpacing: "4px 4px",
            borderRadius: 5,
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell
                variant="head"
                align="center"
                sx={{
                  backgroundColor: "info.main",
                  color: "white",
                }}
              >
                <H3>Sizes</H3>
              </TableCell>
              {sizes.length > 0 &&
                sizes.map((size, index) => (
                  <TableCell
                    align="center"
                    key={index}
                    sx={{ backgroundColor: "grey.200" }}
                  >
                    {size.name}
                  </TableCell>
                ))}
            </TableRow>
            <TableRow>
              <TableCell
                variant="head"
                align="center"
                sx={{ backgroundColor: "info.main", color: "white" }}
              >
                <H3>Price</H3>
              </TableCell>
              {sizes.length > 0 &&
                sizes.map((size, index) => (
                  <TableCell
                    align="center"
                    key={index}
                    sx={{ backgroundColor: "grey.200" }}
                  >
                    {size.price}
                  </TableCell>
                ))}
            </TableRow>
            <TableRow>
              <TableCell
                variant="head"
                align="center"
                sx={{ backgroundColor: "info.main", color: "white" }}
              >
                <H3>Quantity</H3>
              </TableCell>
              {sizes.length > 0 &&
                sizes.map((size, index) => {
                  const cartItem = items.find(
                    (item) => item.id == parent.id + " - " + size.id
                  );
                  return (
                    <TableCell
                      align="center"
                      key={index}
                      sx={{ backgroundColor: "grey.200" }}
                    >
                      {size && !cartItem?.quantity ? (
                        <>
                          {size.stock > 0 && (
                            <BazarButton
                              variant="contained"
                              color="info"
                              sx={{
                                px: "1.75rem",
                                height: "40px",
                              }}
                              onClick={() => {
                                // console.log(size);
                                let toUpdate = {
                                  id: parent.id + " - " + size.id,
                                  productID: parent.id,
                                  name: `${parent.name} - ${size.name}`,
                                  price: size.price,
                                  imgUrl: SERVER_URL + parent.image.url,
                                  variation: size.id,
                                  attributes: size.attribs,
                                  discountedPrice: size.discountedPrice ?? 0,
                                  customizable: parent.customizable,
                                  addons: [],
                                  customizations: [],
                                };
                                addItem(toUpdate);
                              }}
                              disabled={size.stock <= 0}
                            >
                              +
                            </BazarButton>
                          )}

                          {size.stock == 0 && (
                            <>
                              <BazarButton
                                color="primary"
                                onClick={async () => {
                                  try {
                                    let list = await axios.post(
                                      `/subscriptions/${size.id}`
                                    );
                                    refreshUser();
                                  } catch (e) {
                                    console.log(e);
                                  }
                                  refreshUser();
                                }}
                                disabled={user == null}
                              >
                                {user &&
                                user.subscriptions.find((s) => s.id == size.id)
                                  ? "Remove notifications for this product"
                                  : "Notify me when back in stock"}
                              </BazarButton>
                            </>
                          )}
                        </>
                      ) : (
                        <FlexBox alignItems="center">
                          <BazarButton
                            sx={{
                              p: "9px",
                            }}
                            variant="outlined"
                            size="small"
                            color="info"
                            onClick={() =>
                              updateItemQuantity(
                                cartItem.id,
                                cartItem.quantity - 1
                              )
                            }
                          >
                            <Remove fontSize="small" />
                          </BazarButton>
                          <H3 fontWeight="600" mx={2.5}>
                            {cartItem?.quantity.toString().padStart(2, "0")}
                          </H3>

                          <BazarButton
                            sx={{
                              p: "9px",
                            }}
                            variant="outlined"
                            size="small"
                            color="info"
                            onClick={() =>
                              updateItemQuantity(
                                cartItem.id,
                                cartItem.quantity + 1
                              )
                            }
                            disabled={size.stock - cartItem.quantity <= 0}
                          >
                            <Add fontSize="small" />
                          </BazarButton>
                        </FlexBox>
                      )}
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      {/* MOBILE VIEW ------------------------------------------- */}
      <Box sx={{ display: { md: "none" }, padding: 4 }}>
        <List>
          <Grid
            container
            sx={{
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor: "info.main",
                color: "white",
              }}
            >
              <ListItem>
                <Grid
                  item
                  xs={12}
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <ListItemText sx={{ textAlign: "center" }}>
                    <H3>Size</H3>
                  </ListItemText>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: "info.main",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <ListItemText>
                    <H3>Price</H3>
                  </ListItemText>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: "info.main",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <ListItemText>
                    <H3>Quantity</H3>
                  </ListItemText>
                </Grid>
              </ListItem>
            </Grid>
            {sizes.length > 0 &&
              sizes.map((size, index) => {
                const cartItem = items.find(
                  (item) => item.id == parent.id + " - " + size.id
                );
                return (
                  <Grid
                    item
                    xs={12}
                    key={index}
                    sx={{
                      backgroundColor: "grey.200",
                    }}
                  >
                    <ListItem
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      <Grid item xs={12}>
                        <ListItemText>{size.name}</ListItemText>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          backgroundColor: "grey.200",
                          textAlign: "center",
                        }}
                      >
                        <ListItemText>{size.price}</ListItemText>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          backgroundColor: "grey.200",
                          textAlign: "center",
                        }}
                      >
                        <ListItemText>
                          {size && !cartItem?.quantity ? (
                            <>
                              {size.stock > 0 && (
                                <BazarButton
                                  variant="contained"
                                  color="info"
                                  onClick={() => {
                                    console.log(size);
                                    let toUpdate = {
                                      id: parent.id + " - " + size.id,
                                      productID: parent.id,
                                      name: `${parent.name} - ${size.name}`,
                                      price: size.price,
                                      imgUrl: SERVER_URL + parent.image.url,
                                      variation: size.id,
                                      attributes: size.attribs,
                                      discountedPrice:
                                        size.discountedPrice ?? 0,
                                      customizable: parent.customizable,
                                      addons: [],
                                      customizations: [],
                                    };
                                    addItem(toUpdate);
                                  }}
                                  disabled={size.stock <= 0}
                                >
                                  Add to Cart
                                </BazarButton>
                              )}

                              {size.stock == 0 && (
                                <>
                                  <BazarButton
                                    color="info"
                                    onClick={async () => {
                                      try {
                                        let list = await axios.post(
                                          `/subscriptions/${size.id}`
                                        );
                                        refreshUser();
                                      } catch (e) {
                                        console.log(e);
                                      }
                                      refreshUser();
                                    }}
                                    disabled={user == null}
                                  >
                                    {user &&
                                    user.subscriptions.find(
                                      (s) => s.id == size.id
                                    )
                                      ? "Remove notifications for this product"
                                      : "Notify me when back in stock"}
                                  </BazarButton>
                                </>
                              )}
                            </>
                          ) : (
                            <FlexBox
                              alignItems="center"
                              justifyContent="space-evenly"
                            >
                              <BazarButton
                                variant="outlined"
                                size="small"
                                color="info"
                                onClick={() =>
                                  updateItemQuantity(
                                    cartItem.id,
                                    cartItem.quantity - 1
                                  )
                                }
                                sx={{ width: 20, height: 20 }}
                              >
                                <Remove fontSize="small" />
                              </BazarButton>
                              <H3 fontWeight="600">
                                {cartItem?.quantity.toString().padStart(2, "0")}
                              </H3>

                              <BazarButton
                                variant="outlined"
                                size="small"
                                color="info"
                                onClick={() =>
                                  updateItemQuantity(
                                    cartItem.id,
                                    cartItem.quantity + 1
                                  )
                                }
                                sx={{ width: 20, height: 20 }}
                              >
                                <Add fontSize="small" />
                              </BazarButton>
                            </FlexBox>
                          )}
                        </ListItemText>
                      </Grid>
                    </ListItem>
                  </Grid>
                );
              })}
          </Grid>
        </List>
      </Box>
    </>
  );
};

export default SizerGrid;
