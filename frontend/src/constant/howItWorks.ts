export interface StepItem {
  title: string;
  desc: string;
}
export const renterSteps: StepItem[] = [
  {
    title: "Sign Up & Verify Your Account",
    desc: "Create your account and complete identity verification.",
  },
  {
    title: "Choose a Bike",
    desc: "Browse the catalog and find the perfect bike for your ride.",
  },
  {
    title: "Select Your Rental Dates",
    desc: "Pick your desired rental period directly from the calendar.",
  },
  {
    title: "Complete Your Booking",
    desc:
      "Secure your booking with payment and a refundable deposit via Stripe.",
  },
  {
    title: "Start Ride",
    desc:
      'When you receive the bike, both renter and lister must confirm "Start Ride" in the app under "My Rides".',
  },
  {
    title: "Ride & Return",
    desc: "Enjoy your ride!",
  },
  {
    title: "End Ride",
    desc:
      'Once the bike is returned, both parties confirm "End Ride" to complete the rental and trigger payout processing.',
  },
];

export const listerSteps: StepItem[] = [
  {
    title: "Sign Up & Verify Your Identity",
    desc:
      "Create your account and complete identity verification with Stripe to start listing bikes.",
  },
  {
    title: "Create Your Listing",
    desc:
      "Upload photos, add bike details, and set your rental price & deposit.",
  },
  {
    title: "Receive Booking Requests",
    desc:
      "Get notified, receive, and accept booking requests when your bike is requested.",
  },
  {
    title: "Handover & Start Ride",
    desc:
      'When handing over the bike, both renter and lister confirm "Start Ride" in the app under "My Rides".',
  },
  {
    title: "End Ride & Confirm Return",
    desc:
      'After the bike is returned, both parties confirm "End Ride" to complete the rental and trigger payout processing.',
  },
  {
    title: "Get Paid Securely",
    desc:
      "Payments are automatically released by Stripe after the rental is completed and confirmed by both parties.",
  },
];
