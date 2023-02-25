// mui
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove";
import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import BazarAvatar from "components/BazarAvatar";
import BazarButton from "components/BazarButton";
import BazarIconButton from "components/BazarIconButton";
import FlexBox from "components/FlexBox";
import ShoppingBagOutlined from "components/icons/ShoppingBagOutlined";
import LazyImage from "components/LazyImage";
import { H5, Tiny } from "components/Typography";

// utils
import Link from "next/link";
import { useCart } from "react-use-cart";

const MiniCart = ({ toggleSidenav }) => {
  const { palette } = useTheme();
  const { isEmpty, totalUniqueItems, items, updateItemQuantity, removeItem } =
    useCart();

  const getTotalPrice = () => {
    let total = 0;
    items.forEach((item) => {
      if (item.discountedPrice) {
        total += item.discountedPrice * item.quantity;
      } else {
        total += item.quantity * item.price;
      }
    });
    return total;
  };

  return (
    <Box width="380px">
      <Box
        overflow="auto"
        height={`calc(100vh - ${!!items.length ? "80px - 3.25rem" : "0px"})`}
      >
        <FlexBox
          alignItems="center"
          m="0px 20px"
          height="74px"
          color="secondary.main"
        >
          <ShoppingBagOutlined color="inherit" />
          <Box fontWeight={600} fontSize="16px" ml={1}>
            {items.length} item
          </Box>
        </FlexBox>

        <Divider />

        {!items.length && (
          <FlexBox
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="calc(100% - 74px)"
          >
            <LazyImage
              src="/assets/images/logos/shopping-bag.svg"
              width={90}
              height={100}
            />
            <Box
              component="p"
              mt={2}
              color="grey.600"
              textAlign="center"
              maxWidth="200px"
            >
              Your cart is empty. Start shopping
            </Box>
          </FlexBox>
        )}
        {items.map((item, index) => (
          <FlexBox
            alignItems="center"
            py={2}
            px={2.5}
            borderBottom={`1px solid ${palette.divider}`}
            key={index}
          >
            <FlexBox alignItems="center" flexDirection="column">
              <BazarButton
                variant="outlined"
                color="primary"
                sx={{
                  height: "32px",
                  width: "32px",
                  borderRadius: "300px",
                }}
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
              >
                <Add fontSize="small" />
              </BazarButton>
              <Box fontWeight={600} fontSize="15px" my="3px">
                {item.quantity}
              </Box>
              <BazarButton
                variant="outlined"
                color="primary"
                sx={{
                  height: "32px",
                  width: "32px",
                  borderRadius: "300px",
                }}
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity === 1}
              >
                <Remove fontSize="small" />
              </BazarButton>
            </FlexBox>

            <Link href={`/product/${item.productID}`}>
              <a>
                <BazarAvatar
                  src={item.imgUrl}
                  mx={2}
                  alt={item.name}
                  height={76}
                  width={76}
                />
              </a>
            </Link>

            <Box flex="1 1 0">
              <Box>
                <Link href={`/product/${item.productID}`}>
                  <a>
                    <H5 className="title" fontSize="14px">
                      {item.name}
                    </H5>
                  </a>
                </Link>
                {/* {item.attributes &&
                  item.attributes.map((attrib, index) => (
                    <p key={index} color="grey.600">
                      {attrib.content}
                    </p>
                  ))} */}
              </Box>

              {item.discountedPrice && (
                <Tiny color="grey.600">
                  £{item.discountedPrice.toFixed(2)} x 1
                </Tiny>
              )}
              {!item.discountedPrice && (
                <Tiny color="grey.600">£{item.price.toFixed(2)} x 1</Tiny>
              )}
              {item.discountedPrice && (
                <Box
                  fontWeight={600}
                  fontSize="14px"
                  color="primary.main"
                  mt={0.5}
                >
                  £{(item.quantity * item.discountedPrice).toFixed(2)}
                </Box>
              )}
              {!item.discountedPrice && (
                <Box
                  fontWeight={600}
                  fontSize="14px"
                  color="primary.main"
                  mt={0.5}
                >
                  ${(item.quantity * item.price).toFixed(2)}
                </Box>
              )}
            </Box>

            <BazarIconButton
              ml={2.5}
              size="small"
              onClick={() => removeItem(item.id)}
            >
              <Close fontSize="small" />
            </BazarIconButton>
          </FlexBox>
        ))}
      </Box>

      {!!items.length && (
        <Box p={2.5}>
          <Link href="/cart">
            <BazarButton
              variant="contained"
              color="primary"
              sx={{
                mb: "0.75rem",
                height: "40px",
              }}
              fullWidth
              onClick={toggleSidenav}
            >
              Checkout (${getTotalPrice().toFixed(2)})
            </BazarButton>
          </Link>
          {/* <Link href="/cart">
            <BazarButton
              color="primary"
              variant="outlined"
              sx={{
                height: 40,
              }}
              fullWidth
              onClick={toggleSidenav}
            >
              View Cart
            </BazarButton>
          </Link> */}
        </Box>
      )}
    </Box>
  );
};

MiniCart.defaultProps = {
  toggleSidenav: () => {},
};
export default MiniCart;
