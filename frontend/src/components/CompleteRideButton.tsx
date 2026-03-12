import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useCompleteRideMutation } from "../services/stripeApi";
import { toast } from "react-hot-toast";

const CompleteRideButton = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [completeRide, { isLoading }] = useCompleteRideMutation();

  if (!bookingId) {
    return null;
  }

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
      onClick={handleCompleteRide}
      disabled={isLoading}
    >
      {isLoading ? "Completing..." : "Complete Ride"}
    </Button>
  );
};

export default CompleteRideButton;