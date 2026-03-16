import { Typography, Link } from "@mui/material";
import LegalLayout from "../../components/legal/LegalLayout";

const PrivacyPolicy = () => {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="01 Jan 2026">
      <Typography paragraph>
        RentMyBike (Trademarked & operated by RM Platforms AB, org.nr
        559542-5843) (“we”, “us”, or “the Platform”)
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        1. Introduction
      </Typography>
      <Typography paragraph>
        Your privacy is important to us. This Privacy Policy explains how RM
        Platforms AB (“we”, “us”, or “the Company”) collects, uses, and protects
        your personal data when you use our bicycle rental platform (the
        “Service”). We comply with the EU General Data Protection Regulation
        (GDPR).
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        2. Data Controller
      </Typography>
      <Typography paragraph>
        RM Platforms AB <br />
        Email: support@rentmy.bike <br />
        Company Registration Number: 559542-5843
      </Typography>

      <Typography paragraph>
        We use Stripe Payments Europe, Ltd. (“Stripe”) to process payments and
        payouts. Stripe acts as an independent data controller.
      </Typography>

      <Typography paragraph>
        Stripe Privacy Policy:{" "}
        <Link href="https://stripe.com/privacy" target="_blank">
          https://stripe.com/privacy
        </Link>
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        3. Data We Collect
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>Account information</li>
        <li>Verification data</li>
        <li>Transaction data</li>
        <li>Device and usage data</li>
        <li>Communication data</li>
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        4. How We Use Your Data
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>Provide and manage the platform</li>
        <li>Facilitate payments</li>
        <li>Prevent fraud</li>
        <li>Comply with legal obligations</li>
        <li>Improve services</li>
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        5. Data Sharing
      </Typography>
      <Typography paragraph>
        We may share data with other users, Stripe, insurance providers, IT
        providers, or authorities when legally required. We never sell your
        data.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        6. Data Retention
      </Typography>
      <Typography paragraph>
        Data is retained only as long as necessary or required by law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        7. Your Rights
      </Typography>
      <Typography paragraph>
        You have the right to access, correct, erase, restrict, or port your
        data and withdraw consent at any time.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        8. Contact
      </Typography>
      <Typography paragraph>
        Email: support@rentmy.bike <br />
        You may also lodge a complaint with Integritetsskyddsmyndigheten (IMY),
        Sweden.
      </Typography>
    </LegalLayout>
  );
};

export default PrivacyPolicy;