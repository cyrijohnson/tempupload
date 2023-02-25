import React, { createContext, useContext, useEffect, useReducer } from "react"; // import { ContextDevTool } from "react-context-devtool";
import PropTypes from "prop-types";
import axios from "utils/axios";

import useAuth from "contexts/useAuth";

// import navigation data
import placeholderData from "../data/navigations";

// define initial state
const initialState = {
  navigator: null,
  storeInfo: null,
  categories: [],
  shops: [],
  attributeTypes: [],
  attributes: [],
  products: [],
  brands: [],
  tags: [],
  vouchers: [],
  kits: [],
  rjmColors: [],
  productsInitialized: false,
};
// define handlers
const handlers = {
  INITIALIZE: (state, action) => {
    const {
      storeInfo,
      categories,
      shops,
      attributeTypes,
      attributes,
      products,
      brands,
      tags,
      vouchers,
      kits,
      rjmColors,
      productsInitialized,
    } = action.payload;

    return {
      ...state,
      navigator: placeholderData,
      storeInfo,
      productsInitialized,
      categories,
      shops,
      attributeTypes,
      attributes,
      products,
      brands,
      tags,
      vouchers,
      kits,
      rjmColors,
    };
  },

  REFRESH_STORE_INFO: (state, action) => {
    const { storeInfo } = action.payload;

    return {
      ...state,
      storeInfo,
    };
  },

  ADD_CATEGORY: (state, action) => {
    const { categories } = action.payload;

    return {
      ...state,
      categories,
    };
  },

  ADD_VOUCHER: (state, action) => {
    const { vouchers } = action.payload;

    return {
      ...state,
      vouchers,
    };
  },

  ADD_KIT: (state, action) => {
    const { kits } = action.payload;

    return {
      ...state,
      kits,
    };
  },

  ADD_SHOP: (state, action) => {
    const { shops } = action.payload;

    return {
      ...state,
      shops,
    };
  },

  ADD_TAG: (state, action) => {
    const { tags } = action.payload;

    return {
      ...state,
      tags,
    };
  },

  ADD_BRAND: (state, action) => {
    const { brands } = action.payload;

    return {
      ...state,
      brands,
    };
  },

  REFRESH_ATTRIBUTES: (state, action) => {
    const { attributeTypes, attributes } = action.payload;

    return {
      ...state,
      attributeTypes,
      attributes,
    };
  },

  ADD_ATTRIBUTE_TYPE: (state, action) => {
    const { attributeTypes } = action.payload;

    return {
      ...state,
      attributeTypes,
    };
  },

  ADD_ATTRIBUTE: (state, action) => {
    const { attributes } = action.payload;

    return {
      ...state,
      attributes,
    };
  },

  ADD_PRODUCT: (state, action) => {
    const { products } = action.payload;

    return {
      ...state,
      products,
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
  addCategory: () => Promise.resolve(),
  addShop: () => Promise.resolve(),
  addTag: () => Promise.resolve(),
  addVoucher: () => Promise.resolve(),
  refreshVouchers: () => Promise.resolve(),
  refreshKits: () => Promise.resolve(),
  addBrand: () => Promise.resolve(),
  addAttributeType: () => Promise.resolve(),
  addAttribute: () => Promise.resolve(),
  addProduct: () => Promise.resolve(),
  refreshAttributes: () => Promise.resolve(),
  refreshProducts: () => Promise.resolve(),
  refreshAdminData: () => Promise.resolve(),
});

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  // useEffect(() => {
  //   console.log("Products Context State", state);
  // }, [state.productsInitialized]);

  useEffect(() => {
    const initialize = async () => {
      try {
        // fetch store info
        let res = await axios.get("/store-info");
        const storeInfo = res.data;
        // fetch brands
        const brandRes = await axios.get("/brands");
        const brands = brandRes.data;
        // fetch categories
        const catRes = await axios.get("/categories");
        const categories = catRes.data;
        // fetch shops
        const shopRes = await axios.get("/shops");
        const shops = shopRes.data;
        // fetch attribute types
        const attrTypeRes = await axios.get("/attribute-types");
        const attributeTypes = attrTypeRes.data;
        // fetch attributes
        const attrRes = await axios.get("/attributes");
        const attributes = attrRes.data;
        // fetch products
        const prodRes = await axios.get("/products");
        const products = prodRes.data;
        // fetch tags
        const tagRes = await axios.get("/tags");
        const tags = tagRes.data;
        // fetch rjmColors
        const colorRes = await axios.get("/colors");
        const rjmColors = colorRes.data;
        // fetch kits
        const kitRes = await axios.get("/kits");
        const kits = kitRes.data;
        // fetch vouchers
        let vouchers = [];
        if (user && user.role.type === "admin") {
          const voucherRes = await axios.get("/vouchers");
          vouchers = voucherRes.data;
        }

        console.log("initialized products context");
        dispatch({
          type: "INITIALIZE",
          payload: {
            productsInitialized: true,
            storeInfo,
            categories,
            shops,
            attributeTypes,
            attributes,
            products,
            brands,
            tags,
            vouchers,
            kits,
            rjmColors,
          },
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            productsInitialized: false,
            storeInfo: null,
            categories: [],
            shops: [],
            attributeTypes: [],
            attributes: [],
            products: [],
            brands: [],
            tags: [],
            vouchers: [],
            kits: [],
            rjmColors: [],
          },
        });
      }
    };
    initialize();
    if (user)
      console.log(
        `%c Initializing products context for: ${user.role.type}`,
        "background: #222; color: #bada55"
      );
  }, []);

  const refreshAdminData = async () => {
    // fetch store info
    let res = await axios.get("/store-info");
    const storeInfo = res.data;
    // fetch brands
    const brandRes = await axios.get("/brands");
    const brands = brandRes.data;
    // fetch categories
    const catRes = await axios.get("/categories");
    const categories = catRes.data;
    // fetch shops
    const shopRes = await axios.get("/shops");
    const shops = shopRes.data;
    // fetch attribute types
    const attrTypeRes = await axios.get("/attribute-types");
    const attributeTypes = attrTypeRes.data;
    // fetch attributes
    const attrRes = await axios.get("/attributes");
    const attributes = attrRes.data;
    // fetch tags
    const tagRes = await axios.get("/tags");
    const tags = tagRes.data;
    // fetch rjmColors
    const colorRes = await axios.get("/colors");
    const rjmColors = colorRes.data;
    // fetch kits
    const kitRes = await axios.get("/kits");
    const kits = kitRes.data;
    // fetch vouchers
    let vouchers = [];
    if (user && user.role.type === "admin") {
      const voucherRes = await axios.get("/vouchers");
      vouchers = voucherRes.data;
    }
    dispatch({
      type: "INITIALIZE",
      payload: {
        storeInfo,
        categories,
        shops,
        attributeTypes,
        attributes,
        brands,
        tags,
        vouchers,
        kits,
        rjmColors,
      },
    });
  };

  // update store info if data changes on the backend
  const updateStoreInfo = async () => {
    try {
      const res = await axios.get("/store-info");
      const storeInfo = res.data;
      dispatch({
        type: "REFRESH_STORE_INFO",
        payload: {
          storeInfo,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Categories, Tags and Brands -------------------------------------------------
  const addCategory = async (name) => {
    await axios.post("/categories", {
      name,
    });

    let res = await axios.get("/categories");

    const categories = res.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_CATEGORY",
      payload: {
        categories,
      },
    });
  };

  const addShop = async (name, description) => {
    let shopRes = await axios.post("/shops", {
      name,
      description,
    });

    let res = await axios.get("/shops");

    const shops = res.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_SHOP",
      payload: {
        shops,
      },
    });

    return shopRes.data;
  };

  const addTag = async (name) => {
    await axios.post("/tags", {
      name,
    });

    let res = await axios.get("/tags");

    const tags = res.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_TAG",
      payload: {
        tags,
      },
    });
  };

  const addVoucher = async (
    code,
    percentage,
    categories,
    products,
    from,
    to,
    isFreeShipping
  ) => {
    let voucherRes = await axios.post("/vouchers", {
      code,
      percentage,
      categories,
      products,
      from,
      to,
      isFreeShipping,
    });

    let res = await axios.get("/vouchers");

    const vouchers = res.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_VOUCHER",
      payload: {
        vouchers,
      },
    });

    return voucherRes.data;
  };

  const refreshVouchers = async () => {
    // fetch vouchers
    const voucherRes = await axios.get("/vouchers");
    const vouchers = voucherRes.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_VOUCHER",
      payload: {
        vouchers,
      },
    });
  };

  const refreshKits = async () => {
    // fetch kits
    const kitRes = await axios.get("/kits");
    const kits = kitRes.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_KIT",
      payload: {
        kits,
      },
    });
  };

  const addBrand = async (name) => {
    await axios.post("/brands", {
      name,
    });

    let res = await axios.get("/brands");

    const brands = res.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_BRAND",
      payload: {
        brands,
      },
    });
  };

  // Attributes -------------------------------------------------

  const addAttributeType = async (name) => {
    await axios.post("/attribute-types", {
      name,
    });

    let res = await axios.get("/attribute-types");

    const attributeTypes = res.data;

    updateStoreInfo();
    refreshAttributes();

    dispatch({
      type: "ADD_ATTRIBUTE_TYPE",
      payload: {
        attributeTypes,
      },
    });
  };

  const addAttribute = async (attribs, type) => {
    console.log("Attribs", attribs);
    await axios.post("/attributes", {
      content: attribs.content,
      price: attribs.price,
      type,
    });

    let res = await axios.get("/attributes");

    const attributes = res.data;

    updateStoreInfo();
    refreshAttributes();

    dispatch({
      type: "ADD_ATTRIBUTE",
      payload: {
        attributes,
      },
    });
  };

  const refreshAttributes = async () => {
    // fetch attribute types
    const attrTypeRes = await axios.get("/attribute-types");
    const attributeTypes = attrTypeRes.data;
    // fetch attributes
    const attrRes = await axios.get("/attributes");
    const attributes = attrRes.data;

    dispatch({
      type: "REFRESH_ATTRIBUTES",
      payload: {
        attributeTypes,
        attributes,
      },
    });
  };

  // Products -------------------------------------------------

  const addProduct = async (productData) => {
    let prodRes = await axios.post("/products", productData);

    let res = await axios.get("/products");

    const products = res.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_PRODUCT",
      payload: {
        products,
      },
    });

    return prodRes.data;
  };

  const refreshProducts = async () => {
    let res = await axios.get("/products");

    const products = res.data;

    updateStoreInfo();

    dispatch({
      type: "ADD_PRODUCT",
      payload: {
        products,
      },
    });
  };

  // Context Provider ---------------------------------------------------------------
  return (
    <Context.Provider
      value={{
        ...state,
        addCategory,
        addShop,
        addTag,
        addVoucher,
        refreshVouchers,
        refreshKits,
        addBrand,
        addAttributeType,
        addAttribute,
        addProduct,
        refreshAttributes,
        refreshProducts,
        refreshAdminData,
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
export const useProducts = () => useContext(Context);
export { Context };
