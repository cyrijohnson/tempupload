import { useState, useEffect } from "react";
import styled from "styled-components";

import LoadingScreen from "components/loading-screen";

import { GrapesjsReact } from "grapesjs-react";
import "grapesjs-preset-webpage";
import "grapesjs/dist/css/grapes.min.css";

import { useRouter } from "next/router";
import useAuth from "contexts/useAuth";
import axios from "utils/axios";
import { API_URL } from "constants";

const PageBuilder = ({ slug, display }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [pageData, setPageData] = useState(null);

  const StyledDiv = styled.div`
    ${pageData?.css}
  `;

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

  if (display) {
    if (pageData) {
      return (
        <StyledDiv
          dangerouslySetInnerHTML={{ __html: pageData.html }}
        ></StyledDiv>
      );
    } else return <LoadingScreen />;
  } else
    return user && user.role.type == "admin" ? (
      <GrapesjsReact
        id="grapesjs-react"
        plugins={["gjs-preset-webpage", "gjs-blocks-basic"]}
        onInit={(editor) => {
          editor.Storage.add("api", {
            async load(options = {}) {
              let res = await axios.get(`/pages?slug=${slug}`);
              if (res.data && res.data.length > 0) {
                setPageData(res.data[0]);
                return JSON.parse(res.data[0].content);
              }
            },

            async store(data, options = {}) {
              let res = await axios.get(`/pages?slug=${slug}`);
              if (res.data && res.data.length > 0) {
                let html = editor.getHtml();
                let css = editor.getCss();
                let toSave = {
                  html: html,
                  css: css,
                  content: JSON.stringify(data),
                  slug: slug,
                };
                await axios.put(`/pages/${res.data[0].id}`, toSave);
              } else {
                let html = editor.getHtml();
                let css = editor.getCss();
                let toSave = {
                  html: html,
                  css: css,
                  content: JSON.stringify(data),
                  slug: slug,
                };
                let newPageData = await axios.post("/pages", toSave);
                setPageData(newPageData.data);
              }
            },

            assetManager: {
              // Upload endpoint, set `false` to disable upload, default `false`
              upload: API_URL + "/upload",
              // The name used in POST to pass uploaded files, default: `'files'`
              uploadName: "files",
            },
          });

          editor.Panels.addPanel({
            id: "basic-actions",
            el: ".panel__basic-actions",
            buttons: [
              {
                id: "alert-button",
                className: "btn-alert-button",
                label: "Click my butt(on)",
                command(editor) {
                  alert("Hello World");
                },
              },
            ],
          });
        }}
        storageManager={{
          type: "api",
          options: {
            //   api: { key: "myKey" },
          },
        }}
      />
    ) : (
      <div>Sorry, you are not authorized to see this...</div>
    );
};

export default PageBuilder;
