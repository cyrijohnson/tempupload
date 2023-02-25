import TableRow from "components/TableRow";
import { H5 } from "components/Typography";
import East from "@mui/icons-material/East";
import { Chip, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import Link from "next/link";
import React from "react"; // component props interface

const OrderRow = ({ item, user }) => {
  const getColor = (status) => {
    switch (status) {
      case "packaging":
        return "primary";

      case "shipping":
        return "secondary";

      case "delivering":
        return "secondary";

      case "complete":
        return "success";

      case "cancelled":
        return "error";

      default:
        return "";
    }
  };

  return (
    <Link
      href={
        user.role.type == "admin"
          ? "/vendor/orders/" + item.id
          : "/orders/" + item.id + "?pid=" + item.sessionID
      }
    >
      <a>
        <TableRow
          sx={{
            my: "1rem",
            padding: "6px 18px",
          }}
        >
          <H5 m={0.75} textAlign="left">
            {item.sessionID.substring(0, 8)}
          </H5>
          <Box m={0.75}>
            <Chip
              size="small"
              label={item.orderStatus}
              sx={{
                p: "0.25rem 0.5rem",
                fontSize: 12,
                color: !!getColor(item.orderStatus)
                  ? `${getColor(item.orderStatus)}.900`
                  : "inherit",
                backgroundColor: !!getColor(item.orderStatus)
                  ? `${getColor(item.orderStatus)}.100`
                  : "none",
              }}
            />
          </Box>
          <Typography className="pre" m={0.75} textAlign="left">
            {format(new Date(item.created_at), "MMM dd, yyyy")}
          </Typography>
          <Typography m={0.75} textAlign="left">
            £{item.finalPrice.toFixed(2)}
          </Typography>
          <Typography m={0.75} textAlign="left">
            {item.paid ? "Paid" : "Unpaid"}
          </Typography>

          <Typography
            textAlign="center"
            color="grey.600"
            sx={{
              flex: "0 0 0 !important",
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <IconButton>
              <East fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
        </TableRow>
      </a>
    </Link>
  );
};

export default OrderRow;
