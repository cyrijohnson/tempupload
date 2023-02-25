import { Button, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { H5, Small } from "./Typography";

const SmallDropZone = ({ onChange, preview, avatarSize, square }) => {
  // initial values
  const [selected, setSelected] = useState("");
  useEffect(() => {
    setSelected(preview);
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
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: ".jpeg,.jpg,.png,.gif",
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={"none"}
      sx={{
        transition: "all 250ms ease-in-out",
        outline: "none",
        height: 200,
      }}
      {...getRootProps()}
    >
      <Button
        color="info"
        variant="contained"
        sx={{
          px: "2rem",
          mb: "22px",
        }}
      >
        <input type="file" hidden {...getInputProps()} />
        {!selected && (
          <span
            style={{
              width: avatarSize ?? 200,
            }}
          >
            Select files
          </span>
        )}
        {selected && (
          <Avatar
            src={selected}
            variant={square ? "rounded" : ""}
            sx={{
              margin: "2em",
              height: avatarSize ?? 200,
              width: avatarSize ?? 200,
            }}
          />
        )}
      </Button>
    </Box>
  );
};

export default SmallDropZone;
