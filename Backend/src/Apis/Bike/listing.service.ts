import { ObjectId } from "mongoose";
import Listing from "../../Models/Listing";
import { Types } from "mongoose";
import Booking from "../../Models/Booking";
import { haversineDistance } from "../../Utils/haversine";
import { sendEmail } from "../../Utils/sendEmail";
import User from "../../Models/User";
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
const renter         = await User.findById(booking.renterId);
  const firstName      = renter?.personalProfile?.firstName ?? "there";
  const bookingShortId = booking._id.toString().slice(-8).toUpperCase();
  const startedAt      = new Date().toLocaleDateString("en-SE", { day: "numeric", month: "long", year: "numeric" });

  await sendEmail(
    renter?.email!,
    "Rental Started 🚲",
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rental Started</title>
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
    </head>
    <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
      <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
        <thead>
          <tr>
            <th>
              <img alt="Logo"
                src="${process.env.LOGO_URL}"
                width="140"
                style="display:block; margin:0 auto;">
            </th>
          </tr>
        </thead>
        <tbody style="width:100%">
          <tr style="width:100%">
            <td>
              <div style="background:#F6F6F6; padding:30px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">

                <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                  Hi ${firstName},
                </h3>
                <p style="font-size:20px; font-weight:400; margin:5px 0 10px;">
                  Time to start exploring!
                </p>
                <h2 style="font-size:36px; font-weight:400; margin:5px 0 20px; text-transform:capitalize">
                  Rental Started 🚲
                </h2>
                <p style="font-size:18px; font-weight:400; color:#444; margin:0 0 24px;">
                  Your rental has officially started. Enjoy your ride!
                </p>

                <!-- Details Card -->
                <table style="width:100%; max-width:500px; margin:20px auto; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Booking ID
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      #${bookingShortId}
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Started At
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${startedAt}
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left;">
                      Status
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:700; color:#17a34a; text-align:right;">
                      In Progress
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; color:#999999; margin:20px 0 10px;">
                  If you have any questions, please contact our support team.
                </p>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`
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
const renter         = await User.findById(booking.renterId);
  const firstName      = renter?.personalProfile?.firstName ?? "there";
  const bookingShortId = booking._id.toString().slice(-8).toUpperCase();
  const startedAt      = new Date().toLocaleDateString("en-SE", { day: "numeric", month: "long", year: "numeric" });

  await sendEmail(
    renter?.email!,
    "Rental Completed 🚲",
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rental Completed</title>
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
    </head>
    <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
      <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
        <thead>
          <tr>
            <th>
              <img alt="Logo"
                src="${process.env.LOGO_URL}"
                width="140"
                style="display:block; margin:0 auto;">
            </th>
          </tr>
        </thead>
        <tbody style="width:100%">
          <tr style="width:100%">
            <td>
              <div style="background:#F6F6F6; padding:30px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">

                <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                  Hi ${firstName},
                </h3>
                <p style="font-size:20px; font-weight:400; margin:5px 0 10px;">
                  Time to start exploring!
                </p>
                <h2 style="font-size:36px; font-weight:400; margin:5px 0 20px; text-transform:capitalize">
                  Rental Completed 🚲
                </h2>
                <p style="font-size:18px; font-weight:400; color:#444; margin:0 0 24px;">
                   Your rental is completed. We hope you had a great ride! If you have any feedback, please let us know.Your deposit/payout will be processed shortly.
                </p>

                <!-- Details Card -->
                <table style="width:100%; max-width:500px; margin:20px auto; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Booking ID
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      #${bookingShortId}
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Started At
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${startedAt}
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; color:#999999; margin:20px 0 10px;">
                  If you have any questions, please contact our support team.
                </p>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`
  );
   const owner          = await User.findById(booking.ownerId);
  const listing        = await Listing.findById(booking.bikeId).lean();
  const ownerFirstName = owner?.personalProfile?.firstName ?? "there";
  const bikeName       = listing?.title ?? "Your bike";
   await sendEmail(
    owner?.email!,
    "Rental Completed – Your Bike Has Been Returned 🚲",
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rental Completed</title>
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
    </head>
    <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
      <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
        <thead>
          <tr>
            <th>
              <img alt="Logo"
                src="${process.env.LOGO_URL}"
                width="140"
                style="display:block; margin:0 auto;">
            </th>
          </tr>
        </thead>
        <tbody style="width:100%">
          <tr style="width:100%">
            <td>
              <div style="background:#F6F6F6; padding:30px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">

                <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                  Hi ${ownerFirstName},
                </h3>
                <p style="font-size:20px; font-weight:400; margin:5px 0 10px;">
                  Your bike has been returned and the rental is now complete 🚲
                </p>
                <h2 style="font-size:36px; font-weight:400; margin:5px 0 20px; text-transform:capitalize">
                  Rental Completed
                </h2>

                <!-- Details Card -->
                <table style="width:100%; max-width:500px; margin:20px auto; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Booking ID
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      #${bookingShortId}
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Bike
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${bikeName}
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Completed At
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${new Date().toLocaleDateString("en-SE", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left;">
                      Payout Status
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:700; color:#17a34a; text-align:right;">
                      Processing
                    </td>
                  </tr>
                </table>

                <p style="font-size:16px; font-weight:400; color:#444; margin:20px 0 6px;">
                  If no issues are reported, your payout will be processed shortly.
                </p>
                <p style="font-size:15px; color:#999999; margin:0 0 6px;">
                  Please allow <strong>5–7 business days</strong> for payments to appear.
                </p>
                <p style="font-size:15px; color:#999999; margin:0 0 10px;">
                  Thanks for using <strong>RentMyBike</strong>!
                </p>
                <p style="font-size:14px; color:#17a34a; font-weight:600; margin:0;">
                  RentMyBike Team
                </p>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`
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