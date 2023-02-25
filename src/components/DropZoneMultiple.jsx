import { Button, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Avatar, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { H5, Small } from "./Typography";
import { SERVER_URL } from "constant";

// styling
const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  padding: "1em",
  alignItems: "center",
  justifyContent: "space-around",
};

const thumb = {
  display: "inline-flex",
  borderRadius: 15,
  border: "1px dotted #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: "100%",
  objectFit: "contain",
};

const DropZoneMultiple = ({
  onChange,
  onItemRemoved,
  initialValues,
  avatarSize,
}) => {
  // initial values
  const [files, setFiles] = useState([]);
  // const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (initialValues) {
      let toPreview = initialValues.filter((f) => f.url != null);
      setFiles(toPreview);
      // console.log("Setting files", toPreview);
    }
  }, [initialValues]);

  // dropzone
  const onDrop = useCallback((acceptedFiles) => {
    let fils = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    if (onChange) {
      // return a list of all the files and an array of the files that are not in the original array
      let allFiles = [...files, ...fils];
      onChange(allFiles);
    }

    setFiles((prev) => prev.concat(fils));
    // setPreviews([...previews].concat(fils));
    // console.log("Dropping", fils);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: ".jpeg,.jpg,.png,.gif",
  });

  const thumbs = files.map((file, index) => (
    <div style={thumb} key={index}>
      <div style={{ position: "relative" }}>
        <div style={thumbInner}>
          <IconButton
            sx={{
              position: "absolute",
              height: 24,
              width: 24,
              top: -10,
              right: -10,
              zIndex: 2,
              color: "red",
            }}
            onClick={(e) => {
              e.stopPropagation();
              let filtered = [...files].filter((el) =>
                el.preview ? el.preview != file.preview : el.url != file.url
              );
              if (onChange) onChange(filtered);
              if (onItemRemoved) {
                onItemRemoved(file);
              }
              setFiles(filtered);
            }}
          >
            <CancelOutlinedIcon />
          </IconButton>
          {/* <Avatar
          src={file.preview}
          sx={{
            margin: "2em",
            height: avatarSize ?? 200,
            width: avatarSize ?? 200,
          }}
        /> */}
          <img
            src={file.url ? SERVER_URL + file.url : file.preview}
            style={{
              height: avatarSize ?? "100%",
              width: avatarSize ?? "100%",
              objectFit: "contain",
            }}
            // Revoke data uri after image is loaded
            // onLoad={() => {
            //   URL.revokeObjectURL(file.preview);
            // }}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
      border="1px dashed"
      borderColor="grey.400"
      borderRadius="10px"
      bgcolor={isDragActive ? "grey.200" : "none"}
      sx={{
        transition: "all 250ms ease-in-out",
        outline: "none",
        height: "100%",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <H5 mb={2} color="grey.600">
        Drag & drop product images here
      </H5>

      <Divider
        sx={{
          width: "200px",
          mx: "auto",
        }}
      />

      <Typography
        color="grey.600"
        bgcolor={isDragActive ? "grey.200" : "background.paper"}
        lineHeight="1"
        px={2}
        mt={-1.25}
        mb={2}
      >
        or
      </Typography>

      <Button
        color="info"
        variant="contained"
        type="button"
        sx={{
          px: "2rem",
          mb: "22px",
        }}
      >
        Select files
      </Button>

      <Small color="grey.600">Upload product images</Small>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </Box>
  );
};

export default DropZoneMultiple;
