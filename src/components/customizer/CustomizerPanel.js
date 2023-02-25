import React, { useState, useEffect } from "react";

import { Grid, Card, Button, Dialog, Slide } from "@mui/material";

// utils
import ctx from "contexts/Customization";
import { useCart } from "react-use-cart";

// components
import CustomStepper from "components/stepper/CustomStepper";
import CustomizationSelector from "components/customizer/CustomizationSelector";
import CustomizationAreaSelector from "components/customizer/CustomizationAreaSelector";
import ChipStack from "components/ChipStack";

const Customizer = ({ open, onClose, product }) => {
  const { removeCustomization } = ctx.useCustomizations();
  const { items } = useCart();

  const [selectedStep, setSelectedStep] = useState(1);
  const [steps, setSteps] = useState([
    {
      title: "Customization",
      disabled: false,
    },
    {
      title: "Details",
      disabled: true,
    },
  ]);

  useEffect(() => {
    if (product && product.customizations.length > 0) {
      setSteps([
        ...steps.slice(0, 1),
        {
          title: "Details",
          disabled: false,
        },
        ...steps.slice(2),
      ]);
    } else {
      setSteps([
        ...steps.slice(0, 1),
        {
          title: "Details",
          disabled: true,
        },
        ...steps.slice(2),
      ]);
    }
  }, [product?.customizations]);

  const calculateNextEnabled = () => {
    if (!product) return false;
    return (
      (selectedStep == 1 && product.customizations.length > 0) ||
      (selectedStep == 2 &&
        product.customizations.every(
          (c) =>
            c.area &&
            ((c.uploadedImage && c.uploadedImage.name) ||
              (c.uploadedText && c.uploadedText.length > 0))
        ))
    );
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        if (onClose) onClose();
      }}
    >
      {product && (
        <Grid container>
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                console.log(items);
                if (onClose) onClose();
              }}
              sx={{
                zIndex: 100,
                borderRadius: "50%",
                width: "3em",
                height: "3em",
              }}
            >
              X
            </Button>
          </div>
          <CustomStepper
            stepperSteps={steps}
            onStepSelected={setSelectedStep}
            nextEnabled={calculateNextEnabled()}
          >
            {selectedStep == 1 && <CustomizationSelector product={product} />}
            {selectedStep == 2 && (
              <CustomizationAreaSelector product={product} />
            )}
          </CustomStepper>
          <Grid item xs={12}>
            <ChipStack
              items={
                product &&
                items
                  .find((x) => x.id == product.id)
                  .customizations.map((c) => c.name)
              }
              onDelete={(i) => {
                removeCustomization(product, product.customizations[i]);
                if (product.customizations.length == 0) {
                  setSelectedStep(1);
                }
              }}
            />
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
};

export default Customizer;
