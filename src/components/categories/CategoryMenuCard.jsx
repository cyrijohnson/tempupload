import navigations from "data/navigations";
import { Box, styled } from "@mui/material";
import React from "react";
import CategoryMenuItem from "./CategoryMenuItem";
import MegaMenu1 from "./mega-menu/MegaMenu1";
import MegaMenu2 from "./mega-menu/MegaMenu2"; // component props interface
import { useProducts } from "contexts/ProductsContext";

// styled component
const Wrapper = styled(Box)(({ theme, position, open }) => ({
  position: position || "unset",
  padding: "0.5rem 0px",
  left: 0,
  right: "auto",
  top: position === "absolute" ? "calc(100% + 0.7rem)" : "0.5rem",
  borderRadius: 4,
  transform: open ? "scaleY(1)" : "scaleY(0)",
  transformOrigin: "top",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: "all 250ms ease-in-out",
  zIndex: 98,
}));

const CategoryMenuCard = ({ open, position }) => {
  // const megaMenu = {
  //   MegaMenu1, // desktop
  //   MegaMenu2, // mobile
  // };

  const { navigator } = useProducts();
  let MegaMenu = MegaMenu1;

  return (
    <Wrapper open={open} position={position}>
      {navigator != null && (
        <CategoryMenuItem
          title={navigator.title}
          href={navigator.href}
          icon={navigator.icon}
          caret={!!navigator.menuData}
          key={navigator.title}
        >
          <MegaMenu data={navigator.menuData || {}} />
        </CategoryMenuItem>
      )}
    </Wrapper>
  );
};

CategoryMenuCard.defaultProps = {
  position: "absolute",
};

export default CategoryMenuCard;

// export const getServerSideProps = async ({ params }) => {
//   let fashionMenu = navigations.find((nav) => nav.title === "Fashion");
//   console.log("fashionMenu", fashionMenu);
//   return {
//     props: {
//       fashionMenu,
//     },
//   };
// };
