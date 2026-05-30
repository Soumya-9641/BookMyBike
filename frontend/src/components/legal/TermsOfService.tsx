import { Box, Typography, Container, Link } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Terms of Service
      </Typography>

      <Typography variant="body2" color="text.secondary" fontWeight={600} mt={3}>
        Last updated: 01 January 2026
      </Typography>

      <Typography paragraph>
        RentMyBike (Trademarked & operated by RM Platforms AB, org.nr 559542-5843)
        (“RentMyBike”,”we”, “us”, or “the Platform”)
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        1. Introduction
      </Typography>
      <Typography paragraph>
        These Terms of Service (“Terms”) govern your access to and use of our
        peer-to-peer bicycle rental platform (the “Service”). By registering,
        listing, or renting a bicycle through our Service, you agree to be bound
        by and accept these Terms and our related policies. RM Platforms AB
        operates the platform as an intermediary connecting bicycle owners
        (“Owners”) and individuals or businesses seeking to rent bicycles
        (“Renters”). RentMyBike (or RM Platforms AB) does not own, sell,
        maintain, store, control, or manage any bicycles listed on the platform
        unless expressly stated otherwise. By accessing or using the platform,
        you also agree to our Privacy Policy, User (Rental) Agreement,
        Cancellation Policy, and any other policies referenced within these
        Terms.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        2. Eligibility
      </Typography>
      <Typography paragraph>
        Users must be legally capable of entering into binding contracts. Users
        under 18 may only use the platform with the consent and under the
        supervision of a parent or legal guardian, who must register the
        account and assume full legal and financial responsibility for all
        activities carried out through it. By using our platform, you confirm
        that you meet these requirements and agree to comply with all
        applicable laws. RentMyBike does not knowingly allow contracts with
        users under the age of 18 without verified parental or guardian consent
        and is not liable for any misuse resulting from false declarations of
        age or capacity. Users are responsible for ensuring that all
        information provided during registration or verification is accurate
        and up to date. RentMyBike may request identity verification or
        supporting documentation at any time for fraud prevention, safety, legal
        compliance, or dispute resolution purposes.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        3. Platform Role
      </Typography>
      <Typography paragraph>
        RentMyBike provides the digital marketplace infrastructure only. We are
        not a party to the rental agreement between Owners and Renters, except
        where expressly stated. Each rental transaction is governed by a
        separate User (Rental) Agreement between the Owner and Renter. Nothing
        in these Terms creates any partnership, employment, agency, or joint
        venture relationship between RentMyBike and any user.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        4. Account Registration
      </Typography>
      <Typography paragraph>
        You are responsible for maintaining accurate account information,
        safeguarding your login credentials, and all activities conducted
        through your account. You must notify RentMyBike immediately of any
        unauthorized access, suspected fraud, or security breach relating to
        your account.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        5. Listings and Rentals
      </Typography>
      <Typography paragraph>
        Owners may list bicycles for rent by providing accurate descriptions,
        photographs, pricing, and availability information. Owners are
        responsible for ensuring that listed bicycles are reasonably safe,
        maintained in a condition suitable for normal intended use, and
        compliant with applicable laws and regulations. Renters agree to return
        the bicycle in the same condition as received, subject to normal wear
        and tear. Renters are responsible for using bicycles lawfully, safely,
        and in accordance with applicable traffic and safety laws.
      </Typography>
      <Typography paragraph>
        RentMyBike (RM Platforms AB) does not inspect, guarantee, certify, or
        assume responsibility for the condition, legality, safety, maintenance,
        or suitability of bicycles listed on the platform. We reserve the right
        to moderate, suspend, or remove listings or accounts that breach these
        Terms, our policies, or applicable law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        6. Payments and Fees
      </Typography>
      <Typography paragraph>
        All payments and deposits are processed securely through Stripe, a
        third-party payment processor, and are subject to Stripe’s own terms
        and privacy practices. The platform may charge service fees,
        commissions, payment processing fees, or other charges, which will be
        disclosed before booking confirmation. By making or accepting a
        booking, you authorize RentMyBike and its payment providers to collect,
        hold, process, and disburse payments and deposits in accordance with
        the applicable transaction terms and platform policies.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        7. Cancellations and Refunds
      </Typography>
      <Typography paragraph>
        Cancellations and refund eligibility are governed by our Cancellation
        Policy, which forms part of these Terms.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        8. Insurance
      </Typography>
      <Typography paragraph>
        RentMyBike may offer optional insurance coverage through a third-party
        provider at checkout. Any insurance product is subject to separate
        policy terms, conditions, exclusions, and eligibility requirements
        established by the insurer. RentMyBike is not an insurer or insurance
        broker and makes no guarantees regarding coverage availability or claim
        outcomes.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        9. Deposit system & Disputes
      </Typography>
      <Typography paragraph>
        To help protect Owners and Renters, a security deposit may be required
        for rentals. The deposit amount will be displayed before booking
        confirmation and may be held or pre-authorized through Stripe at the
        time of booking. Deposits may be used, in whole or in part, to cover
        verified claims relating to damage, theft, loss, excessive cleaning,
        late returns, missing accessories, or breaches of the rental terms, in
        accordance with the User (Rental) Agreement and Dispute Resolution
        Policy.
      </Typography>
      <Typography paragraph>
        RentMyBike may review evidence submitted by both parties, including
        photographs, timestamps, invoices, communication records, police
        reports, or other relevant documentation before making a good-faith
        determination regarding deposit allocation. Both parties shall be given
        a reasonable opportunity to provide evidence before a determination is
        made.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        10. Prohibited Conduct
      </Typography>
      <Typography paragraph>
        Users must comply with all local laws. Prohibited activities include but
        are not limited to fraud, damage, misuse, unauthorized use, subletting,
        or use of bicycles for unlawful purposes. Prohibited conduct also
        includes:
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>providing false or misleading information,</li>
        <li>circumventing platform fees,</li>
        <li>attempting to complete rentals outside the platform,</li>
        <li>harassment or abusive conduct,</li>
        <li>uploading malicious software or harmful content,</li>
        <li>interfering with platform operations or security.</li>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={3}>
        11. Liability
      </Typography>
      <Typography paragraph>
        RentMyBike (RM Platforms AB) acts solely as an intermediary platform
        connecting Owners and Renters. To the maximum extent permitted by
        applicable law:
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>
          RentMyBike is not liable for damage, theft, injury, accidents, losses,
          disputes, or claims arising from rentals conducted through the
          platform;
        </li>
        <li>
          Owners are responsible for ensuring that bicycles are reasonably
          safe, functional, maintained, lawful, and insured where applicable;
        </li>
        <li>
          Renters are responsible for their use, handling, storage, and return
          of rented bicycles during the rental period.
        </li>
      </Box>
      <Typography paragraph>
        Nothing in these Terms excludes or limits liability that cannot be
        excluded under applicable law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        12. Intellectual Property
      </Typography>
      <Typography paragraph>
        All platform content, branding, and materials are the property of RM
        Platforms AB or its licensors. You may not reproduce, distribute, or
        create derivative works without written consent.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        13. Termination
      </Typography>
      <Typography paragraph>
        We may suspend, restrict, or terminate your account, listings, payouts,
        or access to the platform at any time where we reasonably believe you
        have breached these Terms, violated applicable law, engaged in
        fraudulent or abusive conduct, created safety risks, or exposed the
        platform or other users to potential harm or liability.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        14. Data Protection
      </Typography>
      <Typography paragraph>
        We process personal data in accordance with our Privacy Policy, in
        compliance with the EU General Data Protection Regulation (GDPR). Users
        acknowledge that certain personal information may be shared with
        payment processors, insurers, verification providers, authorities, or
        other users where necessary to facilitate rentals, comply with legal
        obligations, prevent fraud, or resolve disputes.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        15. Dispute Resolution
      </Typography>
      <Typography paragraph>
        In the event of a dispute submitted within 5 days of rental completion
        regarding deposits, damage, theft, loss, or other rental-related
        issues, users must first attempt to resolve the matter directly through
        the platform or designated support channels. If unresolved, RentMyBike
        may review evidence submitted by both parties and make a good-faith
        determination regarding deposit allocation or other platform-related
        matters. Evidence may include photographs, timestamps, invoices,
        communication records, police reports, or other relevant documentation.
        RentMyBike’s determination does not limit any statutory or consumer
        rights available under applicable law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        16. Electronic Acceptance
      </Typography>
      <Typography paragraph>
        Electronic acceptance of these Terms has the same legal effect as a
        signature.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        17. Force Majeure
      </Typography>
      <Typography paragraph>
        RentMyBike shall not be liable for delays, interruptions, or failures
        resulting from events beyond its reasonable control, including natural
        disasters, severe weather, internet or telecommunications failures, labor
        disputes, government actions, pandemics, cyberattacks, or failures of
        third-party service providers.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        18. Governing Law and Jurisdiction
      </Typography>
      <Typography paragraph>
        These Terms are governed by the laws of Sweden, without prejudice to any
        mandatory consumer protection rights applicable in the user’s country
        of residence. Disputes shall be submitted to the competent courts of
        Sweden unless otherwise required by applicable consumer protection or
        EU law.
      </Typography>

      <Typography variant="h6" fontWeight={600} mt={3}>
        Contact
      </Typography>
      <Typography paragraph>
        If you have questions or concerns, contact us at:
        <br />
        Email: <Link href="mailto:support@rentmy.bike">support@rentmy.bike</Link>
        <br />
        Disputes: <Link href="mailto:disputes@rentmy.bike">disputes@rentmy.bike</Link>
      </Typography>
    </Container>
  );
};

export default TermsOfService;