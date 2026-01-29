import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useState } from "react";

interface Props {
  open: boolean;
  startDateTime: Dayjs;
  endDateTime: Dayjs;
  onClose: () => void;
  onApply: (start: Dayjs, end: Dayjs) => void;
}

const DateTimeDialog = ({
  open,
  startDateTime,
  endDateTime,
  onClose,
  onApply,
}: Props) => {
  const [start, setStart] = useState(startDateTime);
  const [end, setEnd] = useState(endDateTime);

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogContent>
        <Typography fontWeight={700} mb={2}>
          Select Trip Date & Time
        </Typography>

        <Stack direction="row" spacing={4}>
          {/* Start */}
          <Stack spacing={2}>
            <Typography fontWeight={600}>Start</Typography>
            <DateCalendar
              value={start}
              onChange={(date) =>
                date && setStart(start.set("date", date.date()))
              }
            />
            <TimePicker
              value={start}
              onChange={(time) => time && setStart(time)}
            />
          </Stack>

          {/* End */}
          <Stack spacing={2}>
            <Typography fontWeight={600}>End</Typography>
            <DateCalendar
              value={end}
              minDate={start}
              onChange={(date) =>
                date && setEnd(end.set("date", date.date()))
              }
            />
            <TimePicker
              value={end}
              minTime={start}
              onChange={(time) => time && setEnd(time)}
            />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          mt={3}
          spacing={2}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#22a652" }}
            onClick={() => onApply(start, end)}
          >
            Apply
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DateTimeDialog;
