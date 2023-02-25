import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditIcon from "@mui/icons-material/Edit";

const EditableButton = ({
  text,
  onClick,
  onChangeComplete,
  showEditIcon,
  ...props
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [changed, setChanged] = useState(false);

  const handleClick = () => {
    setEditing(!editing);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setChanged(true);
  };

  return (
    <>
      {editing ? (
        <>
          <TextField
            value={value}
            onChange={handleChange}
            autoFocus
            fullWidth
            size="small"
            variant="standard"
          />
          <IconButton
            onClick={() => {
              setValue(text);
              setChanged(false);
              setEditing(false);
            }}
          >
            <CancelOutlinedIcon />
          </IconButton>
          {changed && (
            <IconButton
              onClick={() => {
                onChangeComplete(value);
                setChanged(false);
                setEditing(false);
              }}
            >
              <CheckCircleOutlineIcon fontSize="small" color="inherit" />
            </IconButton>
          )}
        </>
      ) : (
        <>
          <ListItemButton
            {...props}
            onClick={() => {
              if (onClick) onClick();
            }}
            onDoubleClick={() => {
              if (showEditIcon) return;
              handleClick();
            }}
            onBlur={() => {
              setEditing(false);
            }}
          >
            {text}
          </ListItemButton>
          {showEditIcon && (
            <IconButton
              onClick={() => {
                handleClick();
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </>
      )}
    </>
  );
};

export default EditableButton;
