import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const InputConfirmer = ({ text, onChangeComplete, onCancel, ...props }) => {
  const [value, setValue] = useState(text);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <TextField
        value={value}
        onChange={handleChange}
        autoFocus
        fullWidth
        size="small"
        variant="standard"
      />
      {onChangeComplete != null && (
        <IconButton
          onClick={() => {
            onChangeComplete(value);
          }}
        >
          <CheckCircleOutlineIcon fontSize="small" color="inherit" />
        </IconButton>
      )}
      {onCancel != null && (
        <IconButton
          onClick={() => {
            onCancel();
          }}
        >
          <CancelOutlinedIcon fontSize="small" color="inherit" />
        </IconButton>
      )}
    </>
  );
};

export default InputConfirmer;
