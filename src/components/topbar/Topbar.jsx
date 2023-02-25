import React, { useEffect, useState } from "react";

// mui
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";

// custom components
import Image from "components/BazarImage";
import FlexBox from "components/FlexBox";
import Navbar from "components/navbar/Navbar";
import Header from "components/header";

// utils
import { layoutConstant } from "utils/constants";
import Link from "next/link";

const TopbarWrapper = styled("div")(({ theme }) => ({
  background: theme.palette.info.main,
  color: theme.palette.info.contrastText,
  height: layoutConstant.topbarHeight,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  fontSize: 12,
  "& .topbarLeft": {
    "& .logo": {
      display: "none",
    },
    "& .title": {
      marginLeft: "10px",
    },
    // "@media only screen and (max-width: 900px)": {
    //   "& .logo": {
    //     display: "block",
    //   },
    //   "& > *:not(.logo)": {
    //     display: "none",
    //   },
    // },
  },
  "& .topbarRight": {
    "& .link": {
      paddingRight: 30,
      color: theme.palette.secondary.contrastText,
    },
    // "@media only screen and (max-width: 900px)": {
    //   "& .link": {
    //     display: "none",
    //   },
    // },
  },
  "& .smallRoundedImage": {
    height: 15,
    width: 25,
    borderRadius: 2,
  },
  "& .handler": {
    height: "100%",
  },
  "& .menuTitle": {
    fontSize: 12,
    marginLeft: "0.5rem",
    fontWeight: 600,
  },
  "& .menuItem": {
    minWidth: 100,
  },
  "& .marginRight": {
    marginRight: "1.25rem",
  },
}));

const TopBarLine = styled("div")(({ theme }) => ({
  height: "5px",
  background: theme.palette.secondary.main,
}));

const Topbar = () => {
  useEffect(() => {
    // get language from browser
    // console.log(navigator.language);
  }, []);
  return (
    <>
      <TopBarLine />
      <TopbarWrapper>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <FlexBox alignItems="center" sx={{ height: "100%" }}>
            <div className="logo" style={{ height: "100%" }}>
              <Link href="/" sx={{ height: "100%" }}>
                <div
                  style={{
                    height: "100%",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    alt="RJM Logo"
                    src="/logo.png"
                    width="100%"
                    height="100%"
                    layout="fill"
                  />
                </div>
              </Link>
            </div>
          </FlexBox>
          <Navbar hideCategories />
          <Header isFixed={true} />
        </Container>
      </TopbarWrapper>
    </>
  );
};

export default Topbar;
