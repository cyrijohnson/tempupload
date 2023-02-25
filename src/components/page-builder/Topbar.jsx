// components/Topbar.js
import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Button as MaterialButton,
  Snackbar,
} from "@mui/material";

import { useEditor } from "@craftjs/core";

export const Topbar = ({ onSave }) => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const [snackbarMessage, setSnackbarMessage] = useState();

  return (
    <Grid item xs={12}>
      <Box px={1} py={1} bgcolor="#333">
        <Grid container alignItems="center">
          <Grid item xs>
            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={(_, value) =>
                    actions.setOptions((options) => (options.enabled = value))
                  }
                  color="secondary"
                />
              }
              sx={{ color: "secondary.main" }}
              label="Editable"
            />
          </Grid>
          <Grid item>
            <MaterialButton
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => {
                if (onSave) {
                  const json = query.serialize();
                  let toSave = lz.encodeBase64(lz.compress(json));
                  setSnackbarMessage("Saving");
                  onSave(toSave);
                }
              }}
            >
              Save
            </MaterialButton>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!snackbarMessage}
        onClose={() => setSnackbarMessage(null)}
        message={<span>{snackbarMessage}</span>}
      />
    </Grid>
  );
};
