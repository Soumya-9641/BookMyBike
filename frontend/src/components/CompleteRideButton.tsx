import { Button } from "@mui/material";
import { useCompleteRideMutation } from "../services/stripeApi";
import { toast } from "react-hot-toast";

interface Props {
  bookingId: string;
}

const CompleteRideButton = ({ bookingId }: Props) => {
  const [completeRide, { isLoading }] = useCompleteRideMutation();

  const handleCompleteRide = async () => {
    try {
      await completeRide(bookingId).unwrap();
      toast.success("Ride completed successfully 🚴");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to complete ride");
    }
  };

  return (
    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={handleCompleteRide}
      disabled={isLoading}
    >
      {isLoading ? "Completing..." : "Complete Ride"}
    </Button>
  );
};

export default CompleteRideButton;