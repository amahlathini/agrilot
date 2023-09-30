import * as React from "react";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { StepIconProps } from "@mui/material/StepIcon";

const ColorlibStepIconRoot = styled("div")<{
  ownerState: {
    completed?: boolean;
    active?: boolean;
    backgroundColor?: number;
  };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active
    ? `hsl(${ownerState.backgroundColor}, 100%, 50%)`
    : `hsl(${ownerState.backgroundColor}, 60%, 10%)`,
  zIndex: 1,
  color: "#fff",
  width: 20,
  height: 20,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const colors: { [index: string]: number } = {
    1: 0,
    2: 39,
    3: 120,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{
        completed,
        active,
        backgroundColor: colors[String(props.icon)],
      }}
      className={className}
    />
  );
}

const steps = ["disconnected", "connectivity", "connected"];

type StepperProps = {
  activeStep: number;
};

export default function CustomizedSteppers(
  { activeStep }: StepperProps = { activeStep: 0 }
) {
  return (
    <Stepper alternativeLabel activeStep={activeStep} connector={null}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={ColorlibStepIcon}></StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
