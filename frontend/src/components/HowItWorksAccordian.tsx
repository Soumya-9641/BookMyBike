import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { StepItem } from "../constant/howItWorks";

const HowItWorksAccordion = ({ steps }: { steps: StepItem[] }) => {
  return (
    <Stack spacing={1}>
      {steps.map((step, index) => (
        <Accordion key={index} elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>
              {index + 1}. {step.title}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {step.desc}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
};

export default HowItWorksAccordion;