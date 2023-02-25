import { alpha, useTheme } from "@mui/material";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useOrders } from "contexts/OrdersContext";

const datasetOptions = {
  fill: true,
  borderWidth: 1,
  pointRadius: 2,
  tension: 0.4,
  pointBorderWidth: 4,
};
const options = {
  plugins: {
    legend: {
      display: false,
    },
    tooltips: {
      displayColors: false,
      callbacks: {
        title: () => "",
        filter: () => false,
        label: (tooltipItem) => {
          let label = tooltipItem.label;

          if (label) {
            label += " - ";
          }

          return `${label}$${Math.round(tooltipItem.yLabel * 100) / 100}`;
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        beginAtZero: true,
      },
    },
    y: {
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        beginAtZero: true,
      },
    },
  },
};

const VendorAnalyticsChart = () => {
  const { orders } = useOrders();

  const [data, setData] = useState(null);
  const { palette: colors } = useTheme();

  const datasetData = orders.map((order) => order.finalPrice);

  useEffect(() => {
    // create label for 30 days (dummy date)
    let labelList = orders.map((order) => {
      let date = new Date(order.created_at);
      return format(date, "MMM dd");
    });
    setData({
      labels: labelList,
      datasets: [
        {
          label: "Sales",
          data: datasetData,
          backgroundColor: alpha(colors.primary.main, 0.2),
          borderColor: colors.primary.main,
          ...datasetOptions,
        },
      ],
    });
  }, []);

  return <>{data && <Line data={data} options={options} />}</>;
};

export default VendorAnalyticsChart;
