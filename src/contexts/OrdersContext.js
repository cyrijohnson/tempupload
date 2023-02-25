import React, { createContext, useContext, useEffect, useReducer } from "react"; // import { ContextDevTool } from "react-context-devtool";
import PropTypes from "prop-types";
import axios from "utils/axios";

import useAuth from "contexts/useAuth";

// define initial state
const initialState = {
  orders: [],
  taxes: null,
  shippingOptions: [],
  ordersInitialized: false,
};
// define handlers
const handlers = {
  INITIALIZE: (state, action) => {
    const { orders, taxes, shippingOptions, ordersInitialized } =
      action.payload;

    return {
      ...state,
      orders,
      taxes,
      shippingOptions,
      ordersInitialized,
    };
  },

  REFRESH_ORDERS_INFO: (state, action) => {
    const { orders } = action.payload;

    return {
      ...state,
      orders,
    };
  },

  REFRESH_SHIPPING_INFO: (state, action) => {
    const { shippingOptions } = action.payload;

    return {
      ...state,
      shippingOptions,
    };
  },

  ADD_ORDER: (state, action) => {
    const { orders } = action.payload;

    return {
      ...state,
      orders,
    };
  },

  ADD_SHIPPING_OPTION: (state, action) => {
    const { shippingOptions } = action.payload;

    return {
      ...state,
      shippingOptions,
    };
  },
};

// add the handlers to the reducer
const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

//create the context
const Context = createContext({
  ...initialState,
  dispatch: () => {},
  addOrder: () => Promise.resolve(),
  refreshOrders: () => Promise.resolve(),
  addShippingOption: () => Promise.resolve(),
  refreshShippingOptions: () => Promise.resolve(),
});

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  //   useEffect(() => {
  //     console.log("Orders Context State", state);
  //   }, [state.ordersInitialized]);

  useEffect(() => {
    const initialize = async () => {
      try {
        let orders = [];
        if (user) {
          // fetch orders
          let res = await axios.get("/orders");
          orders = res.data;
        }

        // fetch shipping options
        let res = await axios.get("/shippings");
        const shippingOptions = res.data;

        // fetch taxes
        res = await axios.get("/taxes");
        const taxes = res.data[0];

        console.log("initialized orders context");
        dispatch({
          type: "INITIALIZE",
          payload: {
            ordersInitialized: true,
            orders,
            taxes,
            shippingOptions,
          },
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            ordersInitialized: false,
            orders: [],
            taxes: null,
            shippingOptions: [],
          },
        });
      }
    };
    initialize();
    if (user)
      console.log(
        `%c Initializing orders context for: ${user.role.type}`,
        "background: #222; color: #bada55"
      );
  }, [user]);

  // update store info if data changes on the backend
  const updateOrdersInfo = async () => {
    try {
      const res = await axios.get("/orders");
      const orders = res.data;
      dispatch({
        type: "REFRESH_ORDERS_INFO",
        payload: {
          orders,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateShippingInfo = async () => {
    try {
      const res = await axios.get("/shippings");
      const shippingOptions = res.data;
      dispatch({
        type: "REFRESH_SHIPPING_INFO",
        payload: {
          shippingOptions,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addOrder = async (orderData) => {
    await axios.post("/orders", orderData);

    let res = await axios.get("/orders");
    const orders = res.data;

    updateOrdersInfo();

    dispatch({
      type: "ADD_ORDER",
      payload: {
        orders,
      },
    });

    return res.data;
  };

  const addShippingOption = async (shippingOptionData) => {
    await axios.post("/shippings", shippingOptionData);

    let res = await axios.get("/shippings");
    const shippingOptions = res.data;

    updateShippingInfo();

    dispatch({
      type: "ADD_SHIPPING_OPTION",
      payload: {
        shippingOptions,
      },
    });

    return res.data;
  };

  const refreshOrders = async () => {
    let res = await axios.get("/orders");

    const orders = res.data;

    updateOrdersInfo();

    dispatch({
      type: "ADD_ORDER",
      payload: {
        orders,
      },
    });
  };

  const refreshShippingOptions = async () => {
    let res = await axios.get("/shippings");

    const shippingOptions = res.data;

    updateShippingInfo();

    dispatch({
      type: "ADD_SHIPPING_OPTION",
      payload: {
        shippingOptions,
      },
    });
  };

  // Context Provider ---------------------------------------------------------------
  return (
    <Context.Provider
      value={{
        ...state,
        addOrder,
        refreshOrders,
        addShippingOption,
        refreshShippingOptions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// setup prop types
Provider.propTypes = {
  children: PropTypes.node,
};

// export a hook into the context
export const useOrders = () => useContext(Context);
export { Context };
