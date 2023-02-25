import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function CheckboxList({
  elements,
  onChange,
  height,
  selected,
  ignore,
}) {
  const [checked, setChecked] = useState(selected || []);
  const [selectable, setSelectable] = useState(elements);

  useEffect(() => {
    if (selected != null) setChecked(selected);
    else setChecked([]);
  }, [selected]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((v) => v.id == value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    if (onChange) {
      onChange(newChecked);
    }
  };

  let autoCompleteElements = elements;
  if (ignore && ignore.length) {
    autoCompleteElements = elements.filter(
      (element) => ignore.includes(element.id) == false
    );
  }

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={autoCompleteElements}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Search" />}
        onChange={(event, value) => {
          if (value != null) {
            setSelectable(elements.filter((e) => e.name.includes(value.name)));
          } else setSelectable(elements);
        }}
      />
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          height: height || "100%",
          overflowY: "scroll",
        }}
      >
        {autoCompleteElements.map((value, index) => {
          const labelId = `checkbox-list-label-${value.id}`;

          if (ignore && ignore.length && ignore.includes(value.id)) return null;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(value)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={
                      checked &&
                      checked.length > 0 &&
                      checked.find((v) => v.id == value.id) != null
                    }
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
