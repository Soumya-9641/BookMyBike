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

