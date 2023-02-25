import * as React from "react";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";

export default function DeletableChips({ items, onDelete }) {
  const handleDelete = (index) => {
    if (onDelete) onDelete(index);
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {items.map((item, index) => (
        <Grid item key={index}>
          <Chip label={item} onDelete={() => handleDelete(index)} />
        </Grid>
      ))}
    </Grid>
  );
}
