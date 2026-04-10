import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  startDateTime: Dayjs;
  endDateTime: Dayjs;
  onClose: () => void;
  onApply: (start: Dayjs, end: Dayjs) => void;
  disablePast?: boolean; // ✅ NEW
}

const DateTimeDialog = ({
  open,
  startDateTime,
  endDateTime,
  onClose,
  onApply,
  disablePast = false,
}: Props) => {
  const now = dayjs();

  const [start, setStart] = useState(startDateTime);
  const [end, setEnd] = useState(endDateTime);

  useEffect(() => {
    setStart(startDateTime);
    setEnd(endDateTime);
  }, [startDateTime, endDateTime, open]);

  const minStartDate = disablePast ? now.startOf("day") : undefined;
  const minStartTime =
    disablePast && start.isSame(now, "day") ? now : undefined;

  const handleStartDateChange = (date: Dayjs | null) => {
    if (!date) return;

    const updated = date
      .hour(start.hour())
      .minute(start.minute());

    if (disablePast && updated.isBefore(now)) return;

    setStart(updated);

    if (end.isBefore(updated)) {
      setEnd(updated.add(1, "hour"));
    }
  };

  const handleStartTimeChange = (time: Dayjs | null) => {
    if (!time) return;

    const updated = start
      .hour(time.hour())
      .minute(time.minute());

    if (disablePast && updated.isBefore(now)) return;

    setStart(updated);

    if (end.isBefore(updated)) {
      setEnd(updated.add(1, "hour"));
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (!date) return;

    const updated = date
      .hour(end.hour())
      .minute(end.minute());

    if (updated.isBefore(start)) return;

    setEnd(updated);
  };

  const handleEndTimeChange = (time: Dayjs | null) => {
    if (!time) return;

    const updated = end
      .hour(time.hour())
      .minute(time.minute());

    if (updated.isBefore(start)) return;

    setEnd(updated);
  };

  const isApplyDisabled =
    (disablePast && start.isBefore(now)) ||
    end.isBefore(start) ||
    end.isSame(start);

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogContent>
        <Typography fontWeight={700} mb={2}>
          Select Trip Date & Time
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          {/* Start */}
          <Stack spacing={2}>
            <Typography fontWeight={600}>Start</Typography>

            <DateCalendar
              value={start}
              minDate={minStartDate}
              onChange={handleStartDateChange}
            />

            <TimePicker
              value={start}
              minutesStep={30}
              minTime={minStartTime}
              onChange={handleStartTimeChange}
            />
          </Stack>

          {/* End */}
          <Stack spacing={2}>
            <Typography fontWeight={600}>End</Typography>

            <DateCalendar
              value={end}
              minDate={start.startOf("day")}
              onChange={handleEndDateChange}
            />

            <TimePicker
              value={end}
              minutesStep={30}
              minTime={start}
              onChange={handleEndTimeChange}
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
            disabled={isApplyDisabled}
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