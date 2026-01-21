import { ObjectId } from "mongoose";
import Listing from "../../Models/Listing";
import { Types } from "mongoose";
import Booking from "../../Models/Booking";
interface CreateListingInput {
  ownerId:Types.ObjectId;

  title: string;
  description?: string;
  photos?: string[];

  brand: string;
  modelbike: string;
  size: string;
  category: string;

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

  // 2️⃣ Geo + availability query
  const bikes = await Listing.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat]
        },
        distanceField: "distance",
        maxDistance: 8000, 
        spherical: true
      }
    },
    {
      $match: {
        _id: { $nin: unavailableBikeIds },
        isPublished: true
      }
    },
    {
      $addFields: {
        distanceInKm: { $round: [{ $divide: ["$distance", 1000] }, 2] }
      }
    }
  ]);

  return bikes;
};