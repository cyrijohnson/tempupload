import React, { useState, useEffect } from "react";
import FlexBox from "components/FlexBox";
import DashboardLayout from "components/layout/CustomerDashboardLayout";
import CustomerDashboardNavigation from "components/layout/CustomerDashboardNavigation";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import TableRow from "components/TableRow";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Place from "@mui/icons-material/Place";
import { Button, IconButton, Pagination, Typography } from "@mui/material";
import Link from "next/link";
import axios from "utils/axios";

import NewAddressForm from "components/checkout/NewAddressForm";
import EditAddressForm from "components/checkout/EditAddressForm";

// Auth
import useAuth from "contexts/useAuth";

const AddressList = () => {
  const { user, refreshUser } = useAuth();

  // addresses ---------------------------------------------------------------
  const [addressData, setAddressData] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  // load initial data if present
  const loadData = async () => {
    try {
      const { data } = await axios.get("/locations");
      setAddressData(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (user) loadData();
  }, [user]);
  // update addresses when they change
  useEffect(() => {
    if (newAddress !== "") {
      if (!addressData.find((item) => item.address === newAddress)) {
        setAddressData([newAddress, ...addressData]);
      }
    }
  }, [newAddress]);

  const deleteAddress = (name) => {
    const toDelete = addressData.find((address) => address.name === name);
    console.log(toDelete);
    axios.delete(`/locations/${toDelete.id}`);
    const newArr = addressData.filter((item) => item.name !== name);
    setAddressData(newArr);
    refreshUser();
  };

  const [openEditForm, setOpenEditForm] = useState(false);
  const [selected, setSelected] = useState(false);

  const editHandler = (value) => {
    const data = addressData.find((item) => item.name === value);
    setSelected(data);
    openEditForm ? setOpenEditForm(false) : setOpenEditForm(true);
  };

  return (
    <DashboardLayout>
      <DashboardPageHeader
        title="My Addresses"
        icon={Place}
        button={
          <NewAddressForm
            setNewAddress={setNewAddress}
            refreshData={loadData}
          />
          // <Button
          //   color="primary"
          //   sx={{
          //     bgcolor: "primary.light",
          //     px: "2rem",
          //   }}
          // >
          //   Add New Address
          // </Button>
        }
        navigation={<CustomerDashboardNavigation />}
      />

      {selected && (
        <EditAddressForm
          openEditForm={openEditForm}
          setOpenEditForm={setOpenEditForm}
          selected={selected}
          addressData={addressData}
          setAddressData={setAddressData}
          refreshData={loadData}
        />
      )}

      {addressData.map((address, ind) => (
        <TableRow
          sx={{
            my: "1rem",
            padding: "6px 18px",
          }}
          key={ind}
        >
          <Typography whiteSpace="pre" m={0.75} textAlign="left">
            {address.name}
          </Typography>
          <Typography flex="1 1 260px !important" m={0.75} textAlign="left">
            {address.address}
          </Typography>
          <Typography whiteSpace="pre" m={0.75} textAlign="left">
            {address.phone}
          </Typography>

          <Typography whiteSpace="pre" textAlign="center" color="grey.600">
            {/* <Link href={`/address/${address.id}`}> */}
            <IconButton onClick={() => editHandler(address.name)}>
              <Edit fontSize="small" color="inherit" />
            </IconButton>
            {/* </Link> */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                deleteAddress(address.name);
              }}
            >
              <Delete fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
        </TableRow>
      ))}

      {/* <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={5}
          onChange={(data) => {
            console.log(data);
          }}
        />
      </FlexBox> */}
    </DashboardLayout>
  );
};

export default AddressList;
