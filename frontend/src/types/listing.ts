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
