import { useState, useEffect, useMemo } from "react";
import create from "react-easy-contexts";
import axios from "utils/axios";
import { useCart } from "react-use-cart";

const ctx = create({
  // hooks
  useCustomizations() {
    // context
    const { items, updateItem } = useCart();

    // state
    const [customizations, setCustomizations] = useState([]);
    const [areas, setAreas] = useState([]);

    // custom methods
    const loadData = async () => {
      console.log("Loading Customizations");
      const { data } = await axios.get("/customization-types");
      setCustomizations(data);

      const { data: areas } = await axios.get("/customization-areas");
      setAreas(areas);
    };

    const refreshCustomizations = async () => {
      await loadData();
    };

    const addCustomization = (item, customization) => {
      const toUpdate = items.find((i) => i.id === item.id);
      // add customization if not already added
      if (!toUpdate.customizations.find((c) => c.id === customization.id)) {
        toUpdate.customizations.push(customization);
        updateItem(toUpdate.id, toUpdate);
      }
    };

    const removeCustomization = (item, customization) => {
      const toUpdate = items.find((i) => i.id === item.id);
      toUpdate.customizations = toUpdate.customizations.filter(
        (c) => c.id !== customization.id
      );
      updateItem(toUpdate.id, toUpdate);
    };

    const addAreaToCustomization = (item, customization, area) => {
      const toUpdate = items.find((i) => i.id === item.id);
      toUpdate.customizations.find((c) => c.id === customization.id).area =
        area;
      updateItem(toUpdate.id, toUpdate);
    };

    const removeAreaFromCustomization = (item, customization, area) => {
      const toUpdate = items.find((i) => i.id === item.id);
      toUpdate.customizations.find((c) => c.id === customization.id).area =
        null;
      updateItem(toUpdate.id, toUpdate);
    };

    const setColorForCustomization = (item, customization, color) => {
      const toUpdate = items.find((i) => i.id === item.id);
      toUpdate.customizations.find((c) => c.id === customization.id).color =
        color;
      updateItem(toUpdate.id, toUpdate);
    };

    const setImageForCustomization = (item, customization, file) => {
      const toUpdate = items.find((i) => i.id === item.id);
      toUpdate.customizations.find(
        (c) => c.id === customization.id
      ).uploadedImage = file;
      updateItem(toUpdate.id, toUpdate);
    };

    const setTextForCustomization = (item, customization, text) => {
      const toUpdate = items.find((i) => i.id === item.id);
      toUpdate.customizations.find(
        (c) => c.id === customization.id
      ).uploadedText = text;
      updateItem(toUpdate.id, toUpdate);
    };

    // effects
    useEffect(() => {
      loadData();
    }, []);

    // exported members, methods and dependancies for updates
    return useMemo(
      () => ({
        customizations,
        areas,
        addCustomization,
        refreshCustomizations,
        removeCustomization,
        addAreaToCustomization,
        removeAreaFromCustomization,
        setColorForCustomization,
        setImageForCustomization,
        setTextForCustomization,
      }),
      [customizations, areas]
    );
  },
});

export default ctx;
