import React, { useState, useEffect, useMemo } from "react";

import { Button, Card, TextField, Grid, Snackbar } from "@mui/material";

// icons
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";

// custom components
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import DashboardPageHeader from "components/layout/DashboardPageHeader";

// image upload
import SmallDropZone from "components/SmallDropZone";

// utils
import { SERVER_URL, toolbarOptions } from "constant";
import axios from "utils/axios";
import TreeViewSelector from "components/TreeViewSelector";
import LoadingScreen from "components/loading-screen";

// hooks
import { useProducts } from "contexts/ProductsContext";

// text editor
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// handle dynamic import
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ClubShops = () => {
  const modules = useMemo(
    () => ({
      clipboard: {
        matchVisual: false,
      },
      toolbar: toolbarOptions,
    }),
    []
  );

  // context
  const { shops, addShop, refreshAdminData } = useProducts();

  // shops data
  const [selectedShop, setSelectedShop] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");

  // success alert
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (selectedShop) {
      setName(selectedShop.name);
      setDescription(selectedShop.description);
      setLogo(selectedShop.logo);
      setBanner(selectedShop.banner);
    }
  }, [selectedShop]);

  // Formik handlers
  const handleSubmit = async () => {
    try {
      if (name && name.length > 0 && description && description.length > 0) {
        // add shop data
        let updatedShop = await axios.put("/shops/" + selectedShop.id, {
          name,
          description,
        });

        updatedShop = updatedShop.data;

        // add logo
        if (selectedShop.logo != null && selectedShop.logo.id != null)
          await axios.delete("/clearImage/" + selectedShop.logo.id);
        if (logo) await uploadImage(logo, "shop", updatedShop.id, "logo");

        // add banner
        if (selectedShop.banner != null && selectedShop.banner.id != null)
          await axios.delete("/clearImage/" + selectedShop.banner.id);
        if (banner) await uploadImage(banner, "shop", updatedShop.id, "banner");

        await refreshAdminData();

        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewShop = async () => {
    let newShop = await addShop("New Club Shop", "");
    if (newShop) {
      setSelectedShop(newShop);
    }
  };

  const uploadImage = async (file, reference, refID, field) => {
    const formData = new FormData();

    formData.append("files", file);
    formData.append("ref", reference);
    formData.append("refId", refID);
    formData.append("field", field);

    await axios.post(SERVER_URL + "/upload", formData);
  };

  if (shops == null) return <LoadingScreen />;

  return (
    <VendorDashboardLayout>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Shop Added!"
      />
      {/* NEW CATEGORY */}
      <DashboardPageHeader title="Club Shops" icon={AlignHorizontalLeftIcon} />
      <Card
        sx={{
          p: "30px",
          marginBottom: "4em",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TreeViewSelector
              onlyFirstLevel
              height={600}
              categories={shops}
              onCategorySelected={(value) => {
                console.log(value);
                setSelectedShop(value);
              }}
              onNewCategory={() => {
                handleNewShop();
              }}
            />
          </Grid>
          <Grid item xs={9}>
            <Card
              sx={{
                p: "30px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <h2>Logo</h2>
                  <Grid item xs={12}>
                    <SmallDropZone
                      avatarSize={100}
                      square
                      preview={
                        logo
                          ? logo.preview
                            ? logo.preview
                            : SERVER_URL + logo.url
                          : ""
                      }
                      onChange={(files) => {
                        setLogo(files[0]);
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <h2>Banner</h2>
                  <Grid item xs={12}>
                    <SmallDropZone
                      avatarSize={100}
                      square
                      preview={
                        banner
                          ? banner.preview
                            ? banner.preview
                            : SERVER_URL + banner.url
                          : ""
                      }
                      onChange={(files) => {
                        setBanner(files[0]);
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <h2>Description</h2>
                  <Grid item xs={12}>
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={(val) => setDescription((prev) => val)}
                      modules={modules}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                mt: "25px",
              }}
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={!selectedShop}
              sx={{
                mt: "25px",
                ml: 2,
              }}
              onClick={async () => {
                if (selectedShop) {
                  if (confirm("Are you sure you want to delete this shop?")) {
                    await axios.delete("/shops/" + selectedShop.id);
                    await refreshAdminData();
                    setSelectedShop(null);
                  }
                }
              }}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Card>
    </VendorDashboardLayout>
  );
};

export default ClubShops;
