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
