export interface Location {
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  brand: string;
  modelbike: string;
  size: string;
  category: string;
  accessories: string[];
  pickupPoint: string;
  rates: {
    hourly?: number;
    daily?: number;
  };
  depositAmount: number;
  location: Location;
  photos: File[];
}

export interface Bike {
  _id: string;
  title: string;
  description?: string;
  photos: string[];
  brand: string;
  modelbike: string;
  size: string;
  category: string;
  pickupPoint: string;
  accessories: string[];
  rates: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  depositAmount: number;
  location: {
    address?: string;
    city?: string;
    country?: string;
    street?: string;
    coordinates: [number, number];
  };
  createdAt: string;
}

export interface GetAllBikesResponse {
  count: number;
  bikes: Bike[];
  filters: {
    category: string[];
    brand: string[];
    city: string[];
  };
}

// types/bike.ts
export interface BikeLocation {
  type: "Point";
  coordinates: [number, number];
  address: string;
  city: string;
}

export interface BikeRates {
  daily: number;
}

export interface BikeDetails {
  _id: string;
  ownerId: string;
  title: string;
  description: string;
  photos: string[];
  brand: string;
  modelbike: string;
  size: string;
  category: string;
  accessories: string[];
  rates: BikeRates;
  depositAmount: number;
  location: BikeLocation;
  isPublished: boolean;
  createdAt: string;
}

export interface Booking {
  bookingId: string;
  status: "upcoming" | "inprogress" | "completed" | "cancelled" | "refunded" |
  "startRequested"
  | "completionRequested"
  | "rejected";

  startDate: string;
  endDate: string;
  totalDays: number;
  notes?: string | null;
  createdAt: string;

  pricing: {
    pricePerDay: number;
    totalAmount: number;
    securityDeposit: number;
    currency: string;
  };
  dispute: {
    disputeId: string,
    type: string,
    disputeAmount: number,
    reason: string,
    date: string,
    time: string,
  },
  ride: {
    actualStartTime: string | null;
    actualEndTime: string | null;
    penaltyAmount?: number;
    penaltyReason?: string | null;
  };

  flags: {
    renterRequestedStart: boolean;
    ownerAcceptedStart: boolean;
    ownerRequestedCompletion: boolean;
    renterConfirmedCompletion: boolean;
    isSettlementDone: boolean;
    isDisputeCreated: boolean;
  };

  cancellation?: {
    cancelledBy: "renter" | "owner";
    cancellationReason?: string;
    cancelledAt: string;
  };

  owner?: {
    ownerId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  renter?: {
    renterId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };

  bike: {
    bikeId: string;
    title: string;
    photos: string[];
    brand: string;
    modelbike: string;
    category: string;
    size?: string;
    rates?: {
      hourly?: number;
      daily?: number;
    };
    depositAmount?: number;
    location: {
      address: string;
      city: string;
      coordinates?: [number, number];
    };
    pickupPoint?: string;
  };

  /** ✅ NORMAL PAYMENT (completed rides) */
  payment?: {
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
    depositAmount: number;
    platformFee: number;
    vatAmount: number;
    platformNet: number;
    ownerPayout: number;
    stripePaymentIntentId: string;
    refundAmount?: number;
    refundReason?: string;
    refundedAt?: string;
    paidAt: string;
  };

  /** ✅ REFUND FLOW (cancelled bookings) */
  refund?: {
    paymentStatus: "refunded";
    amountCharged: number;
    depositAmount: number;
    refundAmount: number;
    refundReason: string;
    refundedAt: string;
    stripeRefundId: string;
    paidAt: string;
  };
}

export interface CreateBookingPayload {
  listingId: string;
  startDate: string;
  endDate: string;
  hours: number;
}

export interface CreateBookingResponse {
  bookingId: string;
  clientSecret: string;
  customerId: string;
}

export interface ProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  isVerified: boolean;
  isStripeConnected: boolean;
}

export interface UserProfileUpdatePayload {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface PriceBreakdownResponse {
  success: boolean;
  breakdown: {
    hours: number;
    totalDays: number;
    pricePerDay: number;
    rentalAmount: number;
    depositAmount: number;
    chargeAmount: number;

    platformFee: number;
    vatAmount: number;
    platformNet: number;

    ownerPayout: number;
    currency: string;
  };
}