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
        When you create a Stripe account and verification or complete a
        transaction, certain personal data may be shared with Stripe where
        necessary to provide payment processing, identity verification, fraud
        prevention, payout, and regulatory compliance services.
      </Typography>
      <Typography paragraph>
        Stripe acts as an independent data controller for this processing. Your
        use of Stripe’s services is governed by their own Privacy Policy and
        Terms of Service, which are governed by Stripe’s own terms and privacy
        practices.
      </Typography>

      <Typography paragraph>
        You can view Stripe’s privacy policy at:{" "}
        <Link href="https://stripe.com/privacy" target="_blank">
          https://stripe.com/privacy
        </Link>
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        3. Data We Collect
      </Typography>
      <Typography paragraph>
        We may collect the following types of personal data:
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>
          name, email address, phone number, billing address, and account
          profile information.
        </li>
        <li>
          <strong>Verification data:</strong> identity verification data, such
          as government-issued identification documents, where required for
          verification, fraud prevention, safety, insurance, or legal compliance
          purposes.
        </li>
        <li>
          <strong>Transaction data:</strong> payment details, booking history,
          rental durations.
        </li>
        <li>
          <strong>Usage data:</strong> interactions with the platform, search
          activity, listing activity, and platform usage analytics.
        </li>
        <li>
          <strong>Device data:</strong> IP address, browser type, operating
          system, and cookies.
        </li>
        <li>
          <strong>Communications:</strong> messages between users and customer
          support interactions.
        </li>
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        4. How We Use Your Data
      </Typography>
      <Typography paragraph>We process your personal data to:</Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>Provide and manage the rental platform;</li>
        <li>Facilitate payments and communication between users;</li>
        <li>Verify user identities and prevent fraud;</li>
        <li>Comply with legal obligations;</li>
        <li>Send service and rental updates and safety notifications;</li>
        <li>Improve the platform and user experience;</li>
        <li>
          Maintain platform security, detect abuse, and enforce our Terms and
          policies.
        </li>
      </Typography>
      <Typography paragraph>
        Depending on the circumstances, we process personal data based on legal
        grounds including contract performance, legitimate interests, consent,
        legal obligations, and fraud prevention or security purposes.
      </Typography>
      <Typography variant="h6" fontWeight={600} mt={3}>
        4a. Legal Bases for Processing
      </Typography>
      <Typography paragraph>
        We process personal data under one or more of the following legal bases:
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>performance of a contract;</li>
        <li>compliance with legal obligations;</li>
        <li>
          legitimate interests, including fraud prevention, platform security,
          dispute handling, and service improvement;
        </li>
        <li>user consent where required;</li>
        <li>establishment, exercise, or defense of legal claims;</li>
      </Typography>
      <Typography variant="h6" fontWeight={600} mt={3}>
        4b. Automated Processing
      </Typography>
      <Typography paragraph>
        We may use automated tools or systems to assist with fraud prevention,
        account security, risk assessment, or platform moderation. Significant
        decisions are not based solely on automated processing without
        appropriate safeguards where required by law.
      </Typography>
      <Typography variant="h6" fontWeight={600} mt={3}>
        5. Data Sharing
      </Typography>
      <Typography paragraph>We may share personal data with:</Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>
          Other users where necessary to facilitate rental transactions,
          communication, pickup coordination, identity verification, or dispute
          resolution;
        </li>
        <li>Payment processors (i.e. Stripe);</li>
        <li>Insurance providers (when applicable);</li>
        <li>
          IT, hosting, and analytics providers under strict confidentiality;
        </li>
        <li>Law enforcement or authorities when legally required.</li>
      </Typography>
      <Typography paragraph>
        We do not sell personal data to third parties.
      </Typography>
      <Typography variant="h6" fontWeight={600} mt={3}>
        6. International Data Transfers
      </Typography>
      <Typography paragraph>
        If data is transferred outside the EEA, we ensure adequate safeguards,
        such as EU Standard Contractual Clauses or transfers to countries with
        approved adequacy decisions.
      </Typography>
      <Typography paragraph>
        Users may request additional information regarding applicable transfer
        safeguards by contacting us.
      </Typography>
      <Typography variant="h6" fontWeight={600} mt={3}>
        7. Data Retention
      </Typography>
      <Typography paragraph>
        We retain personal data only for as long as reasonably necessary for the
        purposes described in this Policy, including legal, accounting, fraud
        prevention, dispute resolution, insurance, tax, and regulatory
        obligations.
      </Typography>
      <Typography paragraph>
        Retention periods may vary depending on the type of data and applicable
        legal requirements.
      </Typography>
      <Typography variant="h6" fontWeight={600} mt={3}>
        8. Your Rights
      </Typography>
      <Typography paragraph>
        Under GDPR, you have the right to:
      </Typography>
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>Access your data;</li>
        <li>Correct inaccurate data;</li>
        <li>Erase your data (“right to be forgotten”);</li>
        <li>Restrict or object to processing;</li>
        <li>Data portability;</li>
        <li>Withdraw consent (where applicable).</li>
      </Typography>
      <Typography paragraph>
        In certain circumstances, these rights may be limited or subject to
        legal exceptions under applicable law. You may exercise these rights by
        contacting us at <Link href="mailto:support@rentmy.bike">support@rentmy.bike</Link>.
        You may also lodge a complaint with Integritetsskyddsmyndigheten (IMY),
        Sweden.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        9. Cookies
      </Typography>
      <Typography paragraph>
        Where legally required, we will request consent before placing
        non-essential cookies or similar technologies on your device. You can
        manage cookie preferences via your browser settings or through any
        cookie controls provided on the platform.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        10. Security
      </Typography>
      <Typography paragraph>
        We implement reasonable technical and organizational security measures
        designed to protect personal data against unauthorized access,
        disclosure, alteration, or destruction. While we strive to protect your
        data, no transmission or storage system can be guaranteed to be
        completely secure.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        11. Users
      </Typography>
      <Typography paragraph>
        Our services are intended for adults who are legally capable of entering
        into binding agreements. Minors may only use bicycles booked through the
        platform under the supervision and responsibility of a parent or legal
        guardian. We do not knowingly collect personal data directly from
        minors without appropriate authorization or legal basis.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        12. Updates to This Policy
      </Typography>
      <Typography paragraph>
        We may update this Privacy Policy from time to time. The latest version
        will always be dated and available on our website. Where legally
        required, we will provide notice of material changes. Please use the
        same process described in the "Your Rights" section to exercise any
        rights or make requests arising from updates to this Policy.
      </Typography>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
