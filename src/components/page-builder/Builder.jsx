import React, { useState, useEffect } from "react";
import { Typography, Paper, Grid } from "@mui/material";

import { Toolbox } from "./Toolbox";
import { SettingsPanel } from "./SettingsPanel";
import { Topbar } from "./Topbar";

import { Container, ContainerVis } from "./components/Container";
import { Text } from "./components/Text";
import { Image } from "./components/Image";
import { Button } from "./components/Button";

import { Editor, Frame, Element } from "@craftjs/core";
import BuilderDebugger from "./BuilderDebugger";

import { useRouter } from "next/router";
import useAuth from "contexts/useAuth";
import axios from "utils/axios";
import { API_URL } from "constants";

export default function Builder({ slug, fullWidth, display }) {
  const router = useRouter();
  const { user } = useAuth();

  const [pageData, setPageData] = useState(null);

  const save = async (data) => {
    let res = await axios.get(`/pages?slug=${slug}`);
    if (res.data && res.data.length > 0) {
      let toSave = {
        content: data,
        slug: slug,
      };
      await axios.put(`/pages/${res.data[0].id}`, toSave);
    } else {
      let toSave = {
        content: data,
        slug: slug,
      };
      let newPageData = await axios.post("/pages", toSave);
      setPageData(newPageData.data);
    }
  };

  useEffect(() => {
    if (display) {
      axios
        .get(`/pages?slug=${slug}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setPageData(res.data[0]);
          } else {
            router.push("/404");
          }
        })
        .catch((err) => {
          console.log(err);
          router.push("/404");
        });
    }
  }, [display, slug]);

  return (
    <Grid>
      <Editor
        resolver={{ Container, ContainerVis, Text, Image, Button }}
        enabled={!display}
      >
        {/* <BuilderDebugger /> */}
        <Grid container>
          {!display && (
            <Topbar
              onSave={(json) => {
                save(json);
              }}
            />
          )}
          <Grid
            item
            xs={fullWidth ? 12 : 9}
            sx={{
              border: display ? "" : "3px solid #eee",
              height: "100%",
            }}
          >
            <Frame>
              <Element
                is={Container}
                backgroundColor="#fff"
                canvas
                desktopSize={12}
                height="100%"
                minHeight="200px"
                id="container"
              />
            </Frame>
          </Grid>
          {!display && (
            <Grid
              item
              xs={3}
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 999,
                width: "100%",
              }}
            >
              <Paper>
                <Toolbox />
                <SettingsPanel />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Editor>
    </Grid>
  );
}
