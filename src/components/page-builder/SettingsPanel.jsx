import React from "react";
import {
  Box,
  Chip,
  Grid,
  Typography,
  Button as MaterialButton,
  FormControl,
  FormLabel,
  Slider,
} from "@mui/material";
import { useEditor } from "@craftjs/core";

export const SettingsPanel = () => {
  const { selected, actions, query } = useEditor((state, query) => {
    const currentNodeId = Array.from(state.events.selected)[0];
    const nodesArray = Array.from(state.nodes);
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
    };
  });

  return selected ? (
    <Box
      bgcolor="rgba(0, 0, 0, 0.06)"
      mt={2}
      px={2}
      py={2}
      sx={{
        overflow: "auto",
        maxHeight: "40vw",
        width: "100%",
      }}
    >
      <Grid container direction="column" spacing={0}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="subtitle1">Selected</Typography>
              </Grid>
              <Grid item>
                <Chip size="small" color="primary" label={selected.name} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {selected && query.node(selected.id).ancestors().length > 0 && (
          <MaterialButton
            sx={{ mb: 3 }}
            variant="contained"
            color="secondary"
            onClick={() => {
              actions.selectNode(query.node(selected.id).ancestors()[0]);
            }}
          >
            Select Parent
          </MaterialButton>
        )}
        {selected.settings && React.createElement(selected.settings)}
        {selected.isDeletable ? (
          <MaterialButton
            variant="contained"
            onClick={() => {
              actions.delete(selected.id);
            }}
          >
            Delete
          </MaterialButton>
        ) : null}
      </Grid>
    </Box>
  ) : null;
};
