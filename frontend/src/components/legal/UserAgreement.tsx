import { Typography, Box } from "@mui/material";
import LegalLayout from "./LegalLayout";

const UserAgreement = () => {
  return (
    <LegalLayout title="User (Rental) Agreement" lastUpdated="01 January 2026">
      <Typography paragraph>
        RentMyBike (Trademarked & operated by RM Platforms AB, org.nr
        559542-5843) (“RentMyBike”, “we”, “us”, or “the Platform”).
      </Typography>

      <Typography paragraph>
        NOTE: RentMyBike (RM Platforms AB) is an intermediary only.
        RentMyBike (RM Platforms AB) facilitates listings, bookings, payments,
        and deposits between Owners and Renters but is not a party to the rental
        contract.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        1. Purpose
      </Typography>
      <Typography paragraph>
        This User (Rental) Agreement (“Agreement”) governs each individual
        bicycle rental transaction between a Bicycle Owner (“Owner”) and a
        Renter (“Renter”) conducted through the platform operated by RM Platforms
        AB (“RentMyBike”, “we”, “us”, or “the Platform”).
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        2. Parties to the Agreement
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          <strong>Owner:</strong> The individual or entity offering a bicycle for
          rent on the platform.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Renter:</strong> The individual or entity renting a bicycle
          through the platform.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={3}>
        3. Formation of the Rental Agreement
      </Typography>
      <Typography paragraph>
        A binding rental agreement is formed when:
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          a) The Renter makes a booking via the platform; and
        </Typography>
        <Typography component="li" paragraph>
          b) The Owner accepts the booking.
        </Typography>
      </Box>
      <Typography paragraph>
        At that moment, both Owner and Renter agree to comply with this
        Agreement, the Terms of Service, the Cancellation Policy, and the Dispute
        Resolution Policy.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        4. Owner Responsibilities
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          Provide a bicycle that is reasonably safe, maintained in a condition
          suitable for normal intended use, and compliant with applicable local
          regulations.
        </Typography>
        <Typography component="li" paragraph>
          Ensure the listing information (photos, description, pricing) is
          accurate and up to date.
        </Typography>
        <Typography component="li" paragraph>
          Deliver the bicycle at the agreed time and location.
        </Typography>
        <Typography component="li" paragraph>
          Report any damage, loss, or dispute to RentMyBike within 5 days of the
          bicycle’s return.
        </Typography>
        <Typography component="li" paragraph>
          Maintain suitable insurance coverage where applicable and comply with
          local safety and registration requirements.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={3}>
        5. Renter Responsibilities
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          Use the bicycle responsibly and only for lawful purposes.
        </Typography>
        <Typography component="li" paragraph>
          Return the bicycle in the same condition, ordinary wear and tear
          excepted.
        </Typography>
        <Typography component="li" paragraph>
          Not permit any third party to use the bicycle without the Owner’s
          consent.
        </Typography>
        <Typography component="li" paragraph>
          Immediately notify the Owner and RentMyBike of any theft, accident, or
          damage.
        </Typography>
        <Typography component="li" paragraph>
          Unless insurance is added or purchased, be financially responsible for
          any loss or damage occurring during the rental period up to the amount
          of the pre-agreed deposit or verified repair costs.
        </Typography>
        <Typography component="li" paragraph>
          Comply with all applicable traffic, safety, and bicycle laws,
          including helmet and lighting requirements where applicable.
        </Typography>
        <Typography component="li" paragraph>
          Acknowledge that cycling involves inherent risks of injury, accident,
          theft, and property damage.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={3}>
        6. Payments and Deposit
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          All payments and deposits are processed securely through Stripe. Payment
          processing services are provided by Stripe and subject to Stripe’s own
          terms and privacy practices.
        </Typography>
        <Typography component="li" paragraph>
          A security deposit may be pre-authorized at the time of booking.
        </Typography>
        <Typography component="li" paragraph>
          Upon safe return and no reported issues within 5 days of completion,
          the deposit is automatically released.
        </Typography>
        <Typography component="li" paragraph>
          In the event of a claim or dispute, RentMyBike (RM Platforms AB) may
          review evidence submitted by both parties in good faith and determine
          whether to release or withhold all or part of the deposit. Evidence may
          include photographs, timestamps, repair invoices, police reports,
          communication records, and other relevant documentation.
        </Typography>
        <Typography component="li" paragraph>
          Both Owner and Renter shall be given a reasonable opportunity to
          provide evidence before a determination is made.
        </Typography>
        <Typography component="li" paragraph>
          RentMyBike may make a good-faith determination regarding deposit
          allocation based on available evidence. This determination does not
          limit any statutory rights users may have under applicable law.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={3}>
        7. Cancellations and Refunds
      </Typography>
      <Typography paragraph>
        Cancellations and refund eligibility are governed by our Cancellation
        Policy, which forms an integral part of this Agreement.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        8. Insurance
      </Typography>
      <Typography paragraph>
        Owners are strongly advised to maintain suitable coverage against theft,
        damage, and liability. Renters should confirm whether their personal or
        travel insurance covers bicycle use.
      </Typography>
      <Typography paragraph>
        RentMyBike may offer optional insurance coverage via a third-party
        provider that can be purchased at checkout. Any insurance product
        offered through the platform is provided by a third-party insurer and
        subject to separate policy terms, conditions, exclusions, and eligibility
        requirements.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        9. Damage, Theft, and Liability
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          The Renter is responsible for loss, theft or damage during the rental
          period unless caused by a mechanical fault unrelated to their use.
        </Typography>
        <Typography component="li" paragraph>
          In the event of theft, the Renter must immediately report the incident
          to local authorities and provide a police report.
        </Typography>
        <Typography component="li" paragraph>
          The Owner must submit any claim or damage report promptly with
          supporting evidence within 5 days of the rental completion.
        </Typography>
        <Typography component="li" paragraph>
          RentMyBike may use part or all of the deposit to cover verified costs.
        </Typography>
        <Typography component="li" paragraph>
          Ordinary wear and tear does not include crash damage, bent wheels,
          stolen accessories, water damage, intentional damage, or damage caused
          by misuse or negligence.
        </Typography>
        <Typography component="li" paragraph>
          Late returns may result in additional fees as specified in the
          listing, booking terms, or applicable platform policies.
        </Typography>
        <Typography component="li" paragraph>
          To the maximum extent permitted by applicable law, RentMyBike shall not
          be liable for indirect, incidental, special, or consequential damages.
          Nothing in this Agreement excludes or limits liability that cannot be
          excluded under applicable law.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={3}>
        10. Dispute Resolution
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          Users must first attempt to resolve disputes directly through the
          platform’s communication system or email with disputes@rentmy.bike on CC
          for the entire conversation thread.
        </Typography>
        <Typography component="li" paragraph>
          If unresolved, RentMyBike may act as a neutral intermediary for the
          limited purpose of reviewing evidence submitted by both parties
          regarding deposit allocation or rental-related disputes.
        </Typography>
        <Typography component="li" paragraph>
          RentMyBike may make a good-faith determination on deposit allocation
          based on available evidence. Such determination does not limit any
          rights available under applicable consumer protection laws.
        </Typography>
        <Typography component="li" paragraph>
          Users may also use EU Online Dispute Resolution systems if available.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={3}>
        11. Termination
      </Typography>
      <Typography paragraph>
        The rental period ends when the bicycle is returned and confirmed as
        received via the platform. RentMyBike may cancel or hold deposits if
        fraudulent or unlawful activity is suspected.
      </Typography>
      <Typography paragraph>
        RentMyBike reserves the right to suspend or terminate user accounts,
        delay payouts, or retain deposits where fraudulent, abusive, unlawful,
        or suspicious activity is reasonably suspected.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        12. Governing Law and Jurisdiction
      </Typography>
      <Typography paragraph>
        This Agreement is governed by the laws of Sweden, without prejudice to
        any mandatory consumer protection laws in the user’s country of
        residence. Disputes shall be handled by the competent courts of Sweden
        unless otherwise required by EU law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        13. Acceptance
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" paragraph>
          Electronic acceptance on registration of this Agreement has the same
          legal effect as a signature.
        </Typography>
        <Typography component="li" paragraph>
          By accepting, registering or confirming a booking on the platform,
          both Owner and Renter acknowledge they have read, understood, and
          agreed to:
        </Typography>
      </Box>
      <Box component="ul" sx={{ pl: 6, mb: 2 }}>
        <Typography component="li" paragraph>
          this User (Rental) Agreement,
        </Typography>
        <Typography component="li" paragraph>
          the Terms of Service,
        </Typography>
        <Typography component="li" paragraph>
          the Privacy Policy,
        </Typography>
        <Typography component="li" paragraph>
          the Cancellation Policy,
        </Typography>
        <Typography component="li" paragraph>
          Dispute Resolution Policy.
        </Typography>
      </Box>

      <Typography paragraph>
        NOTE: RentMyBike (RM Platforms AB) is an intermediary only.
        RentMyBike (RM Platforms AB) facilitates listings, bookings, payments,
        and deposits between Owners and Renters but is not a party to the rental
        contract.
      </Typography>

      <Typography paragraph>
        Contact
        If you have questions or concerns, contact us at:
        Email: support@rentmy.bike
        RM Platforms AB
      </Typography>
    </LegalLayout>
  );
};

export default UserAgreement;
