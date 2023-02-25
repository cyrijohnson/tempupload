import AppStore from "components/AppStore";
import BazarIconButton from "components/BazarIconButton";
import Image from "components/BazarImage";
import Facebook from "components/icons/Facebook";
import Google from "components/icons/Google";
import Instagram from "components/icons/Instagram";
import Twitter from "components/icons/Twitter";
import Youtube from "components/icons/Youtube";
import { Paragraph } from "components/Typography";
import { Box, Container, Grid, styled } from "@mui/material";
import Link from "next/link";
import React from "react";
import FlexBox from "../FlexBox"; // styled component

const StyledLink = styled("a")(({ theme }) => ({
  position: "relative",
  display: "block",
  padding: "0.3rem 0rem",
  color: theme.palette.info.contrastText,
  cursor: "pointer",
  borderRadius: 4,
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

const Footer = () => {
  return (
    <footer>
      <Box bgcolor="info.main">
        <Container
          sx={{
            p: "1rem",
            color: "info.contrastText",
          }}
        >
          <Box py={10} overflow="hidden">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <Link href="/">
                  <a>
                    <div style={{ marginBottom: 10 }}>
                      <Image
                        alt="RJM Logo"
                        src="/logo.png"
                        width="300"
                        layout="fill"
                      />
                    </div>
                  </a>
                </Link>

                <Paragraph mb={2.5} color="info.contrastText">
                  Download our RJM App for a quicker and better shopping
                  experienceand keep up to date with all the new features
                </Paragraph>

                <AppStore />
              </Grid>

              <Grid item lg={2} md={6} sm={6} xs={12}>
                <Box
                  fontSize="25px"
                  fontWeight="600"
                  mb={2.5}
                  lineHeight="1"
                  color="info.contrastText"
                >
                  About Us
                </Box>

                <div>
                  {aboutLinks.map((item, ind) => (
                    <Link href="/" key={ind}>
                      <StyledLink>{item}</StyledLink>
                    </Link>
                  ))}
                </div>
              </Grid>

              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Box
                  fontSize="25px"
                  fontWeight="600"
                  mb={2.5}
                  lineHeight="1"
                  color="info.contrastText"
                >
                  Customer Care
                </Box>

                <div>
                  {customerCareLinks.map((item, ind) => (
                    <Link href="/" key={ind}>
                      <StyledLink>{item}</StyledLink>
                    </Link>
                  ))}
                </div>
              </Grid>

              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Box
                  fontSize="25px"
                  fontWeight="600"
                  mb={2.5}
                  lineHeight="1"
                  color="info.contrastText"
                >
                  Contact Us
                </Box>
                <Box color="info.contrastText">/A Building 2</Box>
                <Box color="info.contrastText">
                  Gateway Business Park, Beancross Road,
                </Box>
                <Box color="info.contrastText">Grangemouth</Box>
                <Box mb={2} color="info.contrastText">
                  FK3 8WX
                </Box>

                <FlexBox className="flex" mx={-0.625}>
                  {iconList.map((item, ind) => (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopenner"
                      key={ind}
                    >
                      <BazarIconButton
                        m={0.5}
                        bgcolor="primary.light"
                        fontSize="12px"
                        padding="10px"
                      >
                        <item.icon fontSize="inherit" />
                      </BazarIconButton>
                    </a>
                  ))}
                </FlexBox>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

const aboutLinks = [
  "About",
  "Our Stores",
  "Terms & Conditions",
  "Privacy Policy",
];
const customerCareLinks = [
  "Help Center",
  "How to Buy",
  "Track Your Order",
  "Corporate & Bulk Purchasing",
  "Returns & Refunds",
];
const iconList = [
  {
    icon: Facebook,
    url: "https://www.facebook.com/UILibOfficial",
  },
  {
    icon: Twitter,
    url: "https://twitter.com/uilibofficial",
  },
  {
    icon: Youtube,
    url: "https://www.youtube.com/channel/UCsIyD-TSO1wQFz-n2Y4i3Rg",
  },
  {
    icon: Google,
    url: "/",
  },
  {
    icon: Instagram,
    url: "https://www.instagram.com/uilibofficial/",
  },
];
export default Footer;
