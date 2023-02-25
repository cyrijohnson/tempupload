import React, { useState, useEffect } from "react";
import FlexBox from "components/FlexBox";
import DashboardLayout from "components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";
import CreditCard from "@mui/icons-material/CreditCard";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {
  Button,
  Card,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import Link from "next/link";
import axios from "utils/axios";

// Auth
import useAuth from "contexts/useAuth";

var creditCardType = require("credit-card-type");

const CardsList = () => {
  const { user, refreshUser } = useAuth();

  // credit cards ------------------------------------------------------------
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  // load initial data if present
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await axios.get("/cards");
        setPaymentMethodList(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user) loadData();
  }, [user]);
  // update cards when they change
  useEffect(() => {
    if (newPaymentMethod !== "") {
      if (!paymentMethodList.find((item) => item.number === newPaymentMethod)) {
        setPaymentMethodList([newPaymentMethod, ...paymentMethodList]);
      }
    }
  }, [newPaymentMethod]);

  const deletePaymentMethod = async (number) => {
    const toDelete = paymentMethodList.find(
      (paymentMethod) => paymentMethod.number === number
    );
    if (user) await axios.delete(`/cards/${toDelete.id}`);
    const newArr = paymentMethodList.filter((item) => item.number !== number);
    setPaymentMethodList(newArr);
  };

  return (
    <DashboardLayout>
      <DashboardPageHeader
        title="Payment Methods"
        icon={CreditCard}
        button={
          <Link href="/payment-methods/add">
            <a>
              <Button
                color="primary"
                sx={{
                  bgcolor: "primary.light",
                  px: "2rem",
                }}
              >
                Add New Payment Method
              </Button>
            </a>
          </Link>
        }
      />

      {paymentMethodList.map((card, ind) => (
        <TableRow
          sx={{
            my: "1rem",
            padding: "6px 18px",
          }}
          key={ind}
        >
          <FlexBox alignItems="center" m={0.75}>
            <Card
              sx={{
                width: "42px",
                height: "28px",
                mr: "10px",
                borderRadius: "2px",
              }}
            >
              <img
                src={`/assets/images/payment-methods/${
                  creditCardType(card.number)[0]?.type
                }.svg`}
                alt={creditCardType(card.number)[0]?.type}
                width="100%"
              />
            </Card>
            <H5 whiteSpace="pre" m={0.75}>
              {card.nameOnCard}
            </H5>
          </FlexBox>
          <Typography whiteSpace="pre" m={0.75}>
            {`**** **** **** ${card.number}`}
          </Typography>
          <Typography whiteSpace="pre" m={0.75}>
            {card.exp}
          </Typography>

          <Typography whiteSpace="pre" textAlign="center" color="grey.600">
            <Link href={`/payment-methods/${card.id}`}>
              <IconButton>
                <Edit fontSize="small" color="inherit" />
              </IconButton>
            </Link>
            <IconButton
              onClick={async (e) => {
                e.stopPropagation();
                await deletePaymentMethod(card.number);
                refreshUser();
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

export default CardsList;
