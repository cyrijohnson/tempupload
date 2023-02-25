import React, { useState, useEffect } from "react";
import FlexBox from "components/FlexBox";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";
import {
  Button,
  Card,
  Paper,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  TextField,
  Typography,
  Grid,
  Snackbar,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import axios from "utils/axios";
import { Formik } from "formik";
import * as yup from "yup";

// Utils
import EditableButton from "components/EditableButton";
import InputConfirmer from "components/InputConfirmer";
import DialogMenu from "components/DialogMenu";

// Products
import { useProducts } from "contexts/ProductsContext";

const Attributes = () => {
  // context
  const {
    attributeTypes,
    attributes,
    addAttributeType,
    addAttribute,
    refreshAttributes,
  } = useProducts();
  // attributes types and attributes
  const [selectedType, setSelectedType] = useState(null);
  const [editingSelectedType, setEditingSelectedType] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [addingType, setAddingType] = useState(false);
  const [addingAttribute, setAddingAttribute] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [editingAttribute, setEditingAttribute] = useState(false);
  // success alert
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const getAttributeTypeFromID = (id) => {
    return attributeTypes.find((type) => type.id === id);
  };

  // Add Handlers ------------------------------------------------------------

  const handleAddAttributeType = async (name) => {
    if (name && name.length > 0) {
      await addAttributeType(name);
      setAddingType(false);
      setOpen(true);
    }
  };

  // const handleAddAttribute = async (content) => {
  //   if (content && content.length > 0) {
  //     await addAttribute(content, selectedType);
  //     setAddingAttribute(false);
  //     setOpen(true);
  //   }
  // };

  // Edit Handlers ------------------------------------------------------------

  const handleEditAttributeType = async (name) => {
    if (name && name.length > 0) {
      await axios.put("/attribute-types/" + selectedType, { name: name });
      await refreshAttributes();
      setOpen(true);
    }
  };

  const handleEditAttribute = async (content, id) => {
    if (content && content.length > 0) {
      await axios.put("/attributes/" + id, { content: content });
      await refreshAttributes();
      setOpen(true);
    }
  };

  // handle the attributes related to the selected type
  useEffect(() => {
    let attribs = attributes.filter(
      (attrib) => attrib.type.id === selectedType
    );
    setSelectedAttributes(attribs);
  }, [selectedType, attributes]);

  const renderAttributesList = () => (
    <>
      <Card
        sx={{
          p: "30px",
          marginBottom: "4em",
        }}
      >
        <Grid container sx={{ marginBottom: "1em" }}>
          <Grid item xs={6}>
            <H5 ml={7} color="grey.600" textAlign="left">
              Attribute Type
            </H5>
          </Grid>
          <Grid item xs={6}>
            <H5 ml={7} color="grey.600" textAlign="left">
              Attributes
            </H5>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ height: "40vh" }}>
          <Grid item xs={6} sx={{ height: "100%" }}>
            <Card style={{ height: "100%", overflowY: "scroll" }}>
              <List>
                {attributeTypes &&
                  attributeTypes.map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        my: ".1rem",
                        padding: "6px 18px",
                      }}
                    >
                      {item.type == "colour" && <ColorLensOutlinedIcon />}
                      {item.type == "select" && <ListOutlinedIcon />}
                      {item.type == "sizer" && <StraightenOutlinedIcon />}
                      {item.type == "button" && (
                        <AutoAwesomeMotionOutlinedIcon />
                      )}
                      <Button
                        onClick={() => {
                          setSelectedType(item.id);
                        }}
                        color={selectedType == item.id ? "primary" : "inherit"}
                        fullWidth
                      >
                        {item.name}
                      </Button>
                      {selectedType == item.id && (
                        <IconButton
                          onClick={() => {
                            setSelectedType(item.id);
                            setEditingSelectedType(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                <ListItem
                  sx={{
                    width: "100%",
                  }}
                >
                  {addingType && (
                    <InputConfirmer
                      text=""
                      onChangeComplete={async (name) => {
                        await handleAddAttributeType(name);
                        setSelectedType(
                          attributeTypes[attributeTypes.length - 1].id + 1
                        );
                      }}
                      onCancel={() => {
                        setAddingType(false);
                      }}
                    />
                  )}
                </ListItem>
                <ListItem
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setAddingType(true);
                    }}
                  >
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item xs={6} sx={{ height: "100%" }}>
            <Card style={{ height: "100%", overflowY: "scroll" }}>
              {selectedAttributes &&
                selectedAttributes.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      my: ".1rem",
                      padding: "6px 18px",
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={() => {
                        console.log(item);
                        setSelectedAttribute(item);
                        setEditingAttribute(true);
                        // handleEditAttribute(value, item.id);
                      }}
                    >
                      {item.content}
                    </Button>
                  </ListItem>
                ))}

              {/* <ListItem
                sx={{
                  width: "100%",
                }}
              >
                {addingAttribute && (
                  <InputConfirmer
                    text=""
                    onChangeComplete={async (content) => {
                      await handleAddAttribute(content);
                    }}
                    onCancel={() => {
                      setAddingAttribute(false);
                    }}
                  />
                )}
              </ListItem> */}
              <ListItem
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {selectedType && (
                  <IconButton
                    onClick={() => {
                      setSelectedAttribute({ name: "", price: 0 });
                      setEditingAttribute(true);
                      setAddingAttribute(true);
                    }}
                  >
                    <AddBoxOutlinedIcon />
                  </IconButton>
                )}
              </ListItem>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </>
  );

  return (
    <VendorDashboardLayout>
      {selectedType && getAttributeTypeFromID(selectedType) && (
        <DialogMenu
          title="Edit Attribute Type"
          open={editingSelectedType}
          onClose={async (data) => {
            setEditingSelectedType(false);
            if (!data) return;
            await axios.put("/attribute-types/" + selectedType, {
              name: data[0].selected,
              type: data[1].selected.name,
            });
            refreshAttributes();
          }}
          data={[
            {
              name: getAttributeTypeFromID(selectedType).name,
              label: "Attribute Type",
              type: "text",
            },
            {
              name: "Category",
              type: "select",
              options: "colour,select,sizer,button"
                .split(",")
                .map((item, index) => ({
                  id: index,
                  name: item,
                })),
              selected: "colour,select,sizer,button"
                .split(",")
                .findIndex(
                  (item) => item === getAttributeTypeFromID(selectedType).type
                ),
            },
          ]}
        />
      )}
      {selectedType && selectedAttribute && (
        <DialogMenu
          title="Edit Attribute"
          open={editingAttribute}
          onClose={async (data) => {
            setEditingAttribute(false);
            if (!data || !data[0].selected || data[0].selected.length == 0)
              return;
            if (addingAttribute) {
              await addAttribute(
                {
                  content: data[0].selected,
                },
                selectedType
              );
              setAddingAttribute(false);
            } else {
              await axios.put("/attributes/" + selectedAttribute.id, {
                content: data[0].selected,
              });
            }
            refreshAttributes();
          }}
          data={[
            {
              name: selectedAttribute.content,
              label: "Attribute Name",
              type: "text",
            },
          ]}
        />
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Changes Saved!"
      />
      {/* NEW CATEGORY */}
      <DashboardPageHeader title="Attributes" icon={AlignHorizontalLeftIcon} />
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} md={10}>
          {renderAttributesList()}
        </Grid>
      </Grid>
    </VendorDashboardLayout>
  );
};

const initialValues = {
  name: "",
};
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});

export default Attributes;
