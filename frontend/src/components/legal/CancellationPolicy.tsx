import { Link, Typography } from "@mui/material";
import LegalLayout from "./LegalLayout";

const CancellationPolicy = () => {
  return (
    <LegalLayout title="Cancellation Policy" lastUpdated="01 January 2026">
      <Typography paragraph>
        RentMyBike (Trademarked & operated by RM Platforms AB, org.nr
        559542-5843) (“RentMyBike”, “we”, “us”, or “the Platform”)
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        1. Purpose
      </Typography>
      <Typography paragraph>
        This policy applies to all users (Owners and Renters) of RentMyBike’s
        bicycle rental marketplace. It forms part of the User (Rental)
        Agreement and Terms of Service.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        2. Cancellation by Renter
      </Typography>
      <Typography paragraph>
        Before rental start:
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>
          Cancellations made at least 24 hours before the rental period start
          time are fully refundable (minus platform admin fees), including any
          deposit.
        </li>
        <li>
          Cancellations within 24 hours of rental start time are
          non-refundable.
        </li>
      </Typography>
      <Typography variant="h6" fontWeight={600} mt={3}>
        No-show
      </Typography>
      <Typography paragraph>
        If the Renter fails to collect or use the bicycle, no refund will be
        issued unless otherwise agreed by the Owner.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        3. Cancellation by Owner
      </Typography>
      <Typography paragraph>
        Owners must notify Renters and RentMyBike as soon as possible if a
        booking cannot be honoured. In case of last-minute cancellations by the
        Owner, the Renter will receive a full refund, including any deposit.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        4. Refunds
      </Typography>
      <Typography paragraph>
        Refunds are processed by Stripe via the original payment method used by
        the Renter – handling times vary. Any transaction fees charged by
        payment processors may not be refundable.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        5. Modifications
      </Typography>
      <Typography paragraph>
        Any modification of the rental period, location, or bicycle details
        must be agreed upon by both parties and inform the platform. Changes
        may be treated as a cancellation and rebooking, subject to case and the
        rules above.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        6. Special Cases
      </Typography>
      <Typography paragraph>
        Exceptional circumstances (e.g., accidents, theft, or force majeure)
        will be considered individually. RentMyBike may mediate in accordance
        with the Dispute Resolution Policy.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        Contact
      </Typography>
      <Typography paragraph>
        If you have questions or concerns, contact us at:
        <br />
        Email: <Link href="mailto:support@rentmy.bike">support@rentmy.bike</Link>
        <br />
        RM Platforms AB
      </Typography>
    </LegalLayout>
  );
};

export default CancellationPolicy;
