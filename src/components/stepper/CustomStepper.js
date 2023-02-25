import Stepper from "components/stepper/Stepper";
import { Grid, Card, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const CustomStepper = ({
  children,
  stepperSteps,
  onStepSelected,
  nextEnabled,
}) => {
  const [selectedStep, setSelectedStep] = useState(1);
  const [steps, setSteps] = useState(stepperSteps);

  useEffect(() => {
    setSteps(stepperSteps);
  }, [stepperSteps]);

  const handleStepChange = (step) => {
    setSelectedStep(step + 1);
    if (onStepSelected) onStepSelected(step + 1);
  };

  return (
    <Card sx={{ width: "100%" }}>
      <Grid
        container
        sx={{
          my: "2rem",
        }}
      >
        <Grid container justifyContent="center" sx={{ p: 3 }}>
          <Stepper
            stepperList={steps}
            selectedStep={selectedStep}
            onChange={handleStepChange}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ p: 3 }}>
        {children}
      </Grid>
      <Grid container sx={{ p: 5 }} justifyContent="flex-end">
        {nextEnabled && (
          <Button
            onClick={() => {
              if (selectedStep < steps.length) {
                setSelectedStep(selectedStep + 1);
                if (onStepSelected) onStepSelected(selectedStep + 1);
              }
            }}
          >
            Next
          </Button>
        )}
      </Grid>
    </Card>
  );
};

export default CustomStepper;
