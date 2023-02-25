import { Button, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { H5, Small } from "./Typography";

const DropZone = ({ onChange, preview, avatarSize }) => {
  // initial values
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (preview) {
      setSelected(preview);
    }
  }, [preview]);

  // dropzone
  const onDrop = useCallback((acceptedFiles) => {
    let files = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    if (onChange) onChange(files);
    setSelected(files[0].preview);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ".jpeg,.jpg,.png,.gif",
  });
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
      {selected && (
        <Avatar
          src={selected}
          sx={{
            margin: "2em",
            height: avatarSize ?? 200,
            width: avatarSize ?? 200,
          }}
        />
      )}
      <input {...getInputProps()} />
      <H5 mb={2} color="grey.600">
        Drag & drop product image here
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
        on
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

      <Small color="grey.600">Upload product image</Small>
    </Box>
  );
};

export default DropZone;
