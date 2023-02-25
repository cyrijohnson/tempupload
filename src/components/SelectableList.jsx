import React, { useState } from "react";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";

export default function SelectableList({
  title,
  items,
  initialValues,
  height,
  onChange,
  singleSelection,
}) {
  const [checked, setChecked] = useState(initialValues ?? []);

  const handleToggle = (value) => () => {
    if (singleSelection) {
      // only select one for each item.header
      if (checked.find((item) => item.header === value.header)) {
        setChecked([
          ...checked.filter((item) => item.header !== value.header),
          value,
        ]);
      } else setChecked([...checked, value]);
    } else {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      if (onChange != null) onChange(newChecked);

      setChecked(newChecked);
    }
  };

  return (
    <div style={{ height: height ?? "100%" }}>
      <h2 style={{ marginLeft: ".5em", marginBottom: ".5em" }}>{title}</h2>
      <List
        sx={{
          width: "100%",
          maxWidth: "100%",
          bgcolor: "background.paper",
          position: "relative",
          overflowY: "auto",
          maxHeight: height ?? "100%",
          height: "100%",
          "& ul": { padding: 0 },
        }}
        subheader={<li />}
        dense
        disablePadding
      >
        {items.map((item, index) => (
          <li key={`item-${index}`}>
            <ul>
              <ListSubheader>{item.header}</ListSubheader>
              {item.contents.map((itm, ind) => (
                <ListItem key={`item-${itm.id}`}>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle({ id: itm.id, header: item.header })}
                    dense
                    sx={{ height: "1.3em" }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.find((i) => itm.id === i.id)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={itm.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </div>
  );
}
