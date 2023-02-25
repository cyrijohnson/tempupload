const useStorage = () => {
  const storageType = (type) => `${type ?? "session"}Storage`;

  const isBrowser = (() => typeof window !== "undefined")();

  const getItem = (key, type) => {
    let item = isBrowser ? window[storageType(type)][key] : "";
    if (item) {
      if (isJson(item)) item = JSON.parse(item);
    }
    return item;
  };

  const setItem = (key, value, type) => {
    if (isBrowser) {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      window[storageType(type)].setItem(key, value);
      return true;
    }

    return false;
  };

  const removeItem = (key, type) => {
    window[storageType(type)].removeItem(key);
  };

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  return {
    getItem,
    setItem,
    removeItem,
  };
};

export default useStorage;
