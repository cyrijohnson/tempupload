import { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Pagination from "@mui/material/Pagination";

import axios from "utils/axios";
import { SERVER_URL } from "constant";
import Image from "next/image";

export default ({ image, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (!open) return;
    getMedia();
  }, [page, open]);

  //   useEffect(() => {
  //     let img = media.find((m) => m.url && image == m.url);
  //     if (img) setSelected(img);
  //   }, [image, open]);

  const getMedia = async () => {
    setLoading(true);

    const { data } = await axios.get(
      `/upload/files?_start=${(page - 1) * 12}&_limit=12`
    );
    const { data: count } = await axios.get("/upload/files/count");

    setMedia(data);
    setPages(Math.ceil(count / 10));
    setLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (media) => {
    setSelected(media);
    if (onSelect) {
      onSelect(media);
    }
    handleClose();
  };

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  const uploadImages = async (files) => {
    const formData = new FormData();

    formData.append("field", "images");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // only upload blob files
      if (file.type && file.type.includes("image")) {
        formData.append(`files`, file, file.name);
      }
    }

    await axios.post(SERVER_URL + "/upload", formData);
  };

  return (
    <Grid padding={3}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          {selected && (
            <Image
              width="100%"
              height="100%"
              objectFit="contain"
              src={SERVER_URL + selected.url}
              alt={selected.name}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          {!selected && (
            <Button onClick={handleClickOpen}>Open Media Library</Button>
          )}
          {selected && (
            <Button
              onClick={() => {
                setSelected(null);
                if (onSelect) {
                  onSelect(null);
                }
                handleClose();
              }}
            >
              Clear Image
            </Button>
          )}
        </Grid>
      </Grid>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">
          <Grid container justifyContent="space-between">
            <Grid item xs={4}>
              Media library
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" color="secondary" component="label">
                Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple={true}
                  onChange={async (e) => {
                    console.log(e.target.files);
                    await uploadImages(e.target.files);
                    getMedia();
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <div className="media-library">
          {loading && <div className="loading">Loading...</div>}
          <Grid container spacing={1} padding={3}>
            {media.map((media) => (
              <Grid
                item
                xs={4}
                key={media.id}
                onClick={() => handleSelect(media)}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  transition: "all 0.15s ease-in-out",
                  "&:hover": {
                    boxShadow: 5,
                  },
                  borderRadius: "5px",
                }}
                container
                justifyContent="center"
                alignItems="center"
              >
                <Image
                  width="100%"
                  height="100%"
                  objectFit="contain"
                  src={SERVER_URL + media.url}
                  alt={media.name}
                />
              </Grid>
            ))}
          </Grid>
          <Grid container justifyContent="center" alignItems="center" mb={3}>
            <Pagination count={pages} page={page} onChange={handlePageChange} />
          </Grid>
        </div>
      </Dialog>
    </Grid>
  );
};
