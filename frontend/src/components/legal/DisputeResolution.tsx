import { Link, Typography } from "@mui/material";
import LegalLayout from "./LegalLayout";

const DisputeResolution = () => {
  return (
    <LegalLayout title="Dispute Resolution Policy" lastUpdated="01 January 2026">
      <Typography paragraph>
        RentMyBike (Trademarked & operated by RM Platforms AB, org.nr
        559542-5843) (“RentMyBike”, “we”, “us”, or “the Platform”)
      </Typography>

      <Typography paragraph>
        NOTE: To ensure consistent handling and documentation, disputes should
        be submitted through RentMyBike’s official dispute channels at
        disputes@rentmy.bike or through any designated dispute tools made
        available on the platform.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        1. Purpose
      </Typography>
      <Typography paragraph>
        This policy outlines how disputes between users (Owners & Renters) are
        handled. Our goal is to review disputes fairly, efficiently, and in
        good faith while complying with applicable consumer protection laws.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        2. Disputes
      </Typography>
      <Typography paragraph>
        If a disagreement arises between an Owner and Renter regarding a
        rental transaction (including bicycle condition, damage, theft,
        deposits, late returns, or rental conduct), users should first attempt
        to resolve the matter directly, or by email with disputes@rentmy.bike
        copied on the communication.
      </Typography>
      <Typography paragraph>
        If no resolution is reached:
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>
          Either party may submit a dispute to RentMyBike no later than 5 days
          after the rental completion date by contacting disputes@rentmy.bike
          or using any official dispute submission tools provided by the
          platform.
        </li>
        <li>Users should provide all reasonably available and relevant evidence supporting their position.</li>
        <li>RentMyBike may review relevant evidence submitted by both parties, including messages, photographs, timestamps, invoices, police reports, booking information, or other documentation.</li>
        <li>RentMyBike may request additional information or clarification from either party where reasonably necessary to support a good-faith determination.</li>
      </Typography>
      <Typography paragraph>
        RentMyBike may make a good-faith determination regarding refunds,
        deposits, or platform-related penalties based on the available
        evidence. Such determination does not limit any statutory or consumer
        rights available under applicable law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        3. Deposits and Damage Disputes
      </Typography>
      <Typography paragraph>
        If an Owner claims damage, theft, loss, missing accessories, excessive
        cleaning, or other rental-related losses:
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>The Owner should provide reasonably sufficient supporting evidence, which may include photographs, written explanations, repair estimates, invoices, police reports, or other documentation, within 5 days of the bicycle’s return.</li>
        <li>RentMyBike may evaluate the submitted evidence and determine whether part or all of the deposit should be temporarily withheld pending resolution.</li>
        <li>Both parties shall be given a reasonable opportunity to provide evidence or respond before a determination is made.</li>
      </Typography>
      <Typography paragraph>
        Where no verified claim is established, any remaining deposit amount
        will be released in accordance with the applicable payment processing
        timelines.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        4. Alternative Dispute Resolution (ADR)
      </Typography>
      <Typography paragraph>
        If users are dissatisfied with the handling of a dispute, they may seek
        assistance from recognized Alternative Dispute Resolution (ADR)
        bodies or consumer protection authorities where available under
        applicable law. RentMyBike will cooperate with lawful requests for
        information or evidence where required but is not responsible for the
        decisions, procedures, or outcomes of third-party dispute resolution
        bodies or courts.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        5. Governing Law & Jurisdiction
      </Typography>
      <Typography paragraph>
        This Policy is governed by the laws of Sweden, without prejudice to any
        mandatory consumer protection rights applicable in the user’s country
        of residence. Any legal proceedings shall be brought before the
        competent courts of Sweden unless otherwise required by applicable
        consumer protection or EU law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        6. Platform Role
      </Typography>
      <Typography paragraph>
        RentMyBike acts solely as an intermediary platform connecting Owners
        and Renters. RentMyBike is not a party to rental agreements between
        users and does not independently verify every claim, statement,
        listing, photograph, or item of evidence submitted during disputes.
        Users remain responsible for the accuracy and legality of the
        information they provide.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        Contact
      </Typography>
      <Typography paragraph>
        For support, dispute submissions, or legal inquiries, contact us at:
        <br />
        Email: <Link href="mailto:support@rentmy.bike">support@rentmy.bike</Link>
        <br />
        Disputes: <Link href="mailto:disputes@rentmy.bike">disputes@rentmy.bike</Link>
      </Typography>
    </LegalLayout>
  );
};

export default DisputeResolution;
