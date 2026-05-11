import { ObjectId } from "mongoose";
import Listing from "../../Models/Listing";
import { Types } from "mongoose";
import Booking from "../../Models/Booking";
import { haversineDistance } from "../../Utils/haversine";
interface CreateListingInput {
  ownerId:Types.ObjectId;

  title: string;
  description?: string;
  photos?: string[];

  brand: string;
  modelbike: string;
  size: string;
  category: string;
  pickupPoint?: string;
  accessories?: string[];

  rates: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
  };

  depositAmount: number;

 location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
    address?: string;
    city: string;
  };
}

interface SearchParams {
  city?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  page?: number;
  limit?: number;
}

interface FilterPayload {
  filters?: {
    category?: string[];
    brand?: string[];
    modelbike?: string[];
    city?: string[];
  };
  page?: number;
  limit?: number;
}

export const createListingService = async (
  data: CreateListingInput
) => {
  // ✅ At least one rate must exist
  if (
    !data.rates ||
    (!data.rates.hourly &&
      !data.rates.daily &&
      !data.rates.weekly &&
      !data.rates.monthly)
  ) {
    throw new Error("At least one rate is required");
  }

  const listing = await Listing.create({
    ownerId: data.ownerId,

    title: data.title,
    description: data.description,
    photos: data.photos || [],

    brand: data.brand,
    modelbike: data.modelbike,
    size: data.size,
    category: data.category,
      pickupPoint: data.pickupPoint?.trim() || undefined,
    accessories: data.accessories || [],

    rates: data.rates,
    depositAmount: data.depositAmount,
    location: data.location,

    isPublished: true
  });

  return listing;
};


export const searchListingsService = async (params: SearchParams) => {
  const {
    city,
    category,
    page = 1,
    limit = 10
  } = params;

  const skip = (page - 1) * limit;

  const query: any = {
    isPublished: true
  };


  if (city) {
    query["location.city"] = {
      $regex: `^${city}$`,
      $options: "i"
    };
  }


  if (category) {
    query.category = category;
  }

  const listings = await Listing.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Listing.countDocuments(query);

  return {
    total,
    page,
    limit,
    results: listings
  };
};


export const getFirstFourBikesService = async () => {
  const bikes = await Listing.find({ isPublished: true })
    .sort({ createdAt: -1 }) // latest first
    .limit(4);

  return bikes;
};

export const filterListingsService = async (payload: FilterPayload) => {
  const {
    filters = {},
    page = 1,
    limit = 9
  } = payload;

  const skip = (page - 1) * limit;

  const query: any = {
    isPublished: true
  };


  if (filters.category?.length) {
    query.category = { $in: filters.category };
  }

  if (filters.brand?.length) {
    query.brand = { $in: filters.brand };
  }

 
  if (filters.modelbike?.length) {
    query.modelbike = { $in: filters.modelbike };
  }

  if (filters.city?.length) {
    query["location.city"] = { $in: filters.city };
  }

  const listings = await Listing.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Listing.countDocuments(query);

  return {
    total,
    page,
    limit,
    results: listings
  };
};



export const searchAvailableBikesService = async ({
  lat,
  lng,
  startDate,
  endDate
}: {
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
}) => {

   const unavailableBikeIds = await Booking.find({
    status: "confirmed",
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) }
  }).distinct("bikeId");


  const bikes = await Listing.find({
    isPublished: true,
    _id: { $nin: unavailableBikeIds }
  }).lean();

  
  const availableBikes = bikes
    .map(bike => {
      const [bikeLng, bikeLat] = bike.location.coordinates;

      const distanceKm = haversineDistance(
        lat,
        lng,
        bikeLat,
        bikeLng
      );

      return {
        ...bike,
        distanceInKm: Number(distanceKm.toFixed(2))
      };
    })
    .filter(bike => bike.distanceInKm <= 8)
    .sort((a, b) => a.distanceInKm - b.distanceInKm);
 const filters = {
    category:  [...new Set(availableBikes.map((b) => b.category).filter(Boolean))],
    brand:     [...new Set(availableBikes.map((b) => b.brand).filter(Boolean))],
    modelbike: [...new Set(availableBikes.map((b) => b.modelbike).filter(Boolean))],
    city:      [...new Set(availableBikes.map((b) => b.location?.city).filter(Boolean))],
  };
return { bikes: availableBikes, filters };
};

export const getAllListingsService = async () => {
  const bikes = await Listing.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean();

  const latestBrands: string[] = [];
  for (const bike of bikes) {
    if (bike.brand && !latestBrands.includes(bike.brand)) {
      latestBrands.push(bike.brand);
    }
    if (latestBrands.length === 10) break;
  }

  const cityCount: Record<string, number> = {};
  for (const bike of bikes) {
    const city = bike.location?.city;
    if (city) {
      cityCount[city] = (cityCount[city] ?? 0) + 1;
    }
  }
  const topCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])      
    .slice(0, 10)                        
    .map(([city]) => city);              

  const filters = {
    category:  [...new Set(bikes.map((b) => b.category).filter(Boolean))],
    modelbike: [...new Set(bikes.map((b) => b.modelbike).filter(Boolean))],
    brand:     latestBrands,             
    city:      topCities,                 
  };

  return { bikes, filters };
};

export const getListingByIdService = async (listingId: string) => {
  if (!Types.ObjectId.isValid(listingId)) {
    return null;
  }

  return await Listing.findOne({
    _id: listingId,
    isPublished: true
  }).lean();
};

export const requestRideStartService = async (bookingId: string, renterId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.renterId.toString() !== renterId) {
    throw new Error("Only the renter can request ride start");
  }

  if (booking.status !== "upcoming") {
    throw new Error(`Cannot request start. Current status: ${booking.status}`);
  }

  const updated = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: "startRequested",
      startRequestedAt: new Date(),
      renterRequestedStart: true,
      startRequestedBy: renterId,
    },
    { new: true }
  );

  return updated;
};
export const acceptRideStartService = async (bookingId: string, ownerId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.ownerId.toString() !== ownerId) {
    throw new Error("Only the owner can accept ride start");
  }

  if (booking.status !== "startRequested") {
    throw new Error(`Cannot accept start. Current status: ${booking.status}`);
  }

  const updated = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: "inprogress",
      startAcceptedAt: new Date(),
      actualStartTime: new Date(),
      ownerAcceptedStart: true,
    },
    { new: true }
  );

  return updated;
};

export const requestRideCompletionService = async (bookingId: string, ownerId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.ownerId.toString() !== ownerId) {
    throw new Error("Only the owner can mark ride as complete");
  }

  if (booking.status !== "inprogress") {
    throw new Error(`Cannot mark complete. Current status: ${booking.status}`);
  }

  const updated = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: "completionRequested",
      completionRequestedAt: new Date(),
      completionRequestedBy: ownerId,
        ownerRequestedCompletion: true,
    },
    { new: true }
  );

  return updated;
};

export const confirmRideCompletionService = async (bookingId: string, renterId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.renterId.toString() !== renterId) {
    throw new Error("Only the renter can confirm completion");
  }
  if (booking.status !== "completionRequested") {
    throw new Error(`Cannot confirm completion. Current status: ${booking.status}`);
  }
  if (!booking.ownerRequestedCompletion) {
    throw new Error("Owner has not requested completion yet");
  }
  if (booking.renterConfirmedCompletion) {
    throw new Error("You have already confirmed completion");
  }

  // ... your existing stripe payout + refund logic ...

  const updated = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status:                    "completed",
       renterConfirmedCompletion: true,   
      completionConfirmedAt:     new Date(),
      actualEndTime:             new Date(),
      payoutStatus:              "pending",
      depositRefundStatus:       "pending",
    },
    { new: true }
  );

  return updated;
};

export const updateListingService = async (
  listingId: string,
  ownerId: string,
  body: Partial<{
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
      weekly?: number;
      monthly?: number;
    };
    depositAmount: number;
    pickupPoint: string;
    location: {
      type: "Point";
      coordinates: [number, number];
      address: string;
      city: string;
    };
    photos: string[];
  }>
) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new Error("Listing not found");

  // Only owner can edit
  if (listing.ownerId.toString() !== ownerId) {
    throw new Error("You are not authorized to edit this listing");
  }

  const updated = await Listing.findByIdAndUpdate(
    listingId,
    { $set: body },
    { new: true }
  );

  return updated;
};