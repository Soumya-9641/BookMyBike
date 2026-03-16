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
    city: string;
    coordinates: [number, number];
  };
  createdAt: string;
}

export interface GetAllBikesResponse {
  count: number;
  bikes: Bike[];
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
  status: "pending" | "in_progress" | "completed" | "refunded";
  startDate: string;
  endDate: string;
  createdAt: string;

  pricing: {
    totalAmount: number;
    securityDeposit: number;
  };

  payment: {
    status?: string;
  } | null;

  bike: {
    bikeId: string;
    title: string;
    modelbike: string;
    photos: string[];
    brand: string;
    category: string;
    size: string;
    location: {
      address: string;
      city: string;
    };
  };
  ride: {
    actualStartTime: string | null;
    actualEndTime: string | null;
    penaltyAmount: number;
    penaltyReason: string | null;
  },
  owner?: {
    firstName: string;
    lastName: string;
    email: string;
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