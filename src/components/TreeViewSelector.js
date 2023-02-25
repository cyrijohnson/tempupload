import React, { useState, useEffect } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import TreeItem from "@mui/lab/TreeItem";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function TreeViewSelector({
  categories,
  height,
  width,
  onCategorySelected,
  onNewCategory,
  onItemSelected,
  onNewItem,
  onlyFirstLevel,
}) {
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState([]);

  //   useEffect(() => {
  //     setExpanded([]);
  //   }, [categories]);

  return (
    <TreeView
      aria-label="tree view navigator"
      sx={{
        height: height ?? 400,
        flexGrow: 1,
        maxWidth: width ?? 400,
        overflowY: "auto",
      }}
      expanded={expanded}
      selected={selected}
      //   onNodeToggle={(e, ids) => setExpanded(ids)}
      onNodeSelect={(e, ids) => {
        let isCategory = categories.find((c) => c.id == ids);
        if (!isCategory) return;
        if (!expanded.includes(ids) && !onlyFirstLevel)
          setExpanded([...expanded, ids]);
      }}
    >
      {!onlyFirstLevel && (
        <Grid container justifyContent="space-between">
          <Button
            onClick={() => {
              setExpanded(categories.map((c, i) => c.id.toString()));
            }}
          >
            Expand All
          </Button>
          <Button
            onClick={() => {
              setExpanded([]);
            }}
          >
            Collapse All
          </Button>
        </Grid>
      )}
      {categories?.map((category, index) => (
        <TreeItem
          collapseIcon={<ExpandMoreIcon />}
          expandIcon={<ChevronRightIcon />}
          key={category.id}
          nodeId={category.id ? category.id.toString() : index.toString()}
          label={category.name}
          onClick={() => {
            // console.log(category.id);
            setSelected([category.id.toString()]);
            if (onCategorySelected) onCategorySelected(category);
          }}
        >
          {!onlyFirstLevel &&
            category.items?.map((item, ind) => (
              <TreeItem
                collapseIcon={null}
                expandIcon={null}
                key={item.id}
                nodeId={item.id ? item.id.toString() : ind.toString()}
                label={item.name}
                onClick={() => {
                  setSelected([item.id.toString()]);
                  if (onItemSelected) onItemSelected(item);
                }}
              >
                {item.name}
              </TreeItem>
            ))}
          <TreeItem
            expandIcon={<AddIcon />}
            key={`${category.name}-new`}
            nodeId={`${category.name}-new`}
            label={"Add new"}
            onClick={() => {
              if (onNewItem) onNewItem(category);
            }}
          >
            {"Add new"}
          </TreeItem>
        </TreeItem>
      ))}
      <TreeItem
        expandIcon={<AddIcon />}
        nodeId={`category-new`}
        label={"Add new"}
        onClick={() => {
          if (onNewCategory) {
            if (onNewCategory) onNewCategory();
            setSelected(null);
          }
        }}
      >
        {"Add new"}
      </TreeItem>
    </TreeView>
  );
}
