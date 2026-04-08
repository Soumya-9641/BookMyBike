// src/apis/user/auth.api.ts
import { Router, Request, Response } from "express";

import { authMiddleware } from "../../Middlewares/auth.middleware";

import { createListingService, searchListingsService, getFirstFourBikesService, filterListingsService, 
  searchAvailableBikesService, getAllListingsService, getListingByIdService ,
  requestRideStartService,acceptRideStartService,requestRideCompletionService,
  updateListingService} from "./listing.service";
import { uploadBikeImages } from "../../Middlewares/upload.middleware";
import { AuthRequest } from "../../types/auth-request";
import User from "../../Models/User";


const router = Router();


router.post(
  "/listnewbike",
  authMiddleware,

  uploadBikeImages.array("photos", 6), // max 6 images
  async (req: AuthRequest, res: Response) => {
    try {

      const ownerId = req.user!.userId.toString();

      // ── Block check before creating listing ──
      const user = await User.findById(ownerId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.isBlocked) {
        res.status(401).json({
          success: false,
          message: "Your account has been blocked. Please contact support.",
        });
        return;
      }

      const {
        title,
        description,
        brand,
        modelbike,
        size,
        category,
        accessories,
        rates,
        depositAmount,
        location,
         pickupPoint,
      } = req.body;

      const files = req.files as Express.Multer.File[];

      if (
        !title ||
        !brand ||
        !modelbike ||
        !size ||
        !category ||
        !depositAmount ||
        !location ||
        !files?.length
      ) {
        return res.status(400).json({
          message: "Missing required fields"
        });
      }


      const photos = files.map(
        file => `/uploads/bikes/${file.filename}`
      );
      const parsedLocation = JSON.parse(location);
      const listing = await createListingService({
        ownerId: req.user!.userId,
        title,
        description,
        photos,
        brand,
        modelbike,
        size,
        category,
        accessories: accessories ? JSON.parse(accessories) : [],
        rates: rates ? JSON.parse(rates) : {},
        depositAmount,
         pickupPoint: pickupPoint?.trim() || undefined,
        location: {
          type: "Point",
          coordinates: [
            parsedLocation.lng,
            parsedLocation.lat
          ],
          address: parsedLocation.address,
          city: parsedLocation.city
        }
      });


      res.status(201).json({
        message: "Listing created successfully",
        listing
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to create listing"
      });
    }
  }
);


router.get(
  "/bikes/home",
  async (req: Request, res: Response) => {
    try {
      const bikes = await getFirstFourBikesService();

      res.status(200).json({
        count: bikes.length,
        bikes
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to fetch bikes"
      });
    }
  }
);

// router.get(
//   "/listings",
//   async (req: Request, res: Response) => {

//     try {
//       const {
//       city,
//       category,
//       model,
//       lat,
//       lng,
//       radius,
//       page,
//       limit
//     } = req.query;

//     const data = await searchListingsService({
//       city: city as string | undefined,
//       category: category as string | undefined,
//       model: model as string | undefined,
//       lat: lat ? Number(lat) : undefined,
//       lng: lng ? Number(lng) : undefined,
//       radius: radius ? Number(radius) : undefined,
//       page: page ? Number(page) : undefined,
//       limit: limit ? Number(limit) : undefined
//     });

//     res.json(data);
//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message || "Failed to retrieve listings"
//       });
//     }
//   }
// );

// router.get("/search", async (req: Request, res: Response) => {
//   try {
//     const data = await searchListingsService({
//       city: req.query.city as string,
//       startDate: req.query.startDate as string,
//       endDate: req.query.endDate as string,
//       category: req.query.category as string,
//       page: req.query.page ? Number(req.query.page) : 1,
//       limit: req.query.limit ? Number(req.query.limit) : 10
//     });

//     res.json(data);
//   } catch (error: any) {
//     res.status(500).json({
//       message: "Search failed",
//       error: error.message
//     });
//   }
// });



router.post("/filter", async (req: Request, res: Response) => {
  try {
    const data = await filterListingsService(req.body);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to filter listings",
      error: error.message
    });
  }
});

router.post("/search", async (req: Request, res: Response) => {
  try {
     const { bikes, filters } = await searchAvailableBikesService(req.body);

    res.status(200).json({
      count: bikes.length,
      bikes,
      filters
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Search failed"
    });
  }
});


router.put(
  "/:listingId/edit",
  authMiddleware,
  uploadBikeImages.array("photos", 6),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ownerId = req.user!.userId.toString();

      // ── Block check ──
      const user = await User.findById(ownerId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (user.isBlocked) {
        res.status(401).json({
          success: false,
          message: "Your account has been blocked. Please contact support.",
        });
        return;
      }

      const {
        title,
        description,
        brand,
        modelbike,
        size,
        category,
        accessories,
        rates,
        depositAmount,
        pickupPoint,
        location,
      } = req.body;

      // Build update object with only provided fields
      const updateData: Record<string, any> = {};

      if (title)        updateData.title        = title;
      if (description)  updateData.description  = description;
      if (brand)        updateData.brand        = brand;
      if (modelbike)    updateData.modelbike    = modelbike;
      if (size)         updateData.size         = size;
      if (category)     updateData.category     = category;
      if (depositAmount) updateData.depositAmount = depositAmount;
      if (accessories)  updateData.accessories  = JSON.parse(accessories);
      if (rates)        updateData.rates        = JSON.parse(rates);
      if (pickupPoint !== undefined) {
        updateData.pickupPoint = pickupPoint?.trim() || undefined;
      }
      if (location) {
        const parsedLocation = JSON.parse(location);
        updateData.location = {
          type: "Point",
          coordinates: [parsedLocation.lng, parsedLocation.lat],
          address: parsedLocation.address,
          city: parsedLocation.city,
        };
      }

      // If new photos uploaded, replace photos array
      const files = req.files as Express.Multer.File[];
      if (files?.length) {
        updateData.photos = files.map(
          (file) => `/uploads/bikes/${file.filename}`
        );
      }

      const listing = await updateListingService(
        req.params.listingId,
        ownerId,
        updateData
      );

      res.status(200).json({
        message: "Listing updated successfully",
        listing,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to update listing",
      });
    }
  }
);

router.post("/getall",async(req:Request, res:Response)=>{
  try{
      const { bikes, filters }=await getAllListingsService();
      res.status(200).json({
        count: bikes.length,
        bikes,
        filters
      });
  }catch(error:any){
    res.status(500).json({
      message: error.message || "fetch failed"
    });
  }
})


router.get("/:id", async (req, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await getListingByIdService(id);

    if (!listing) {
      return res.status(404).json({
        message: "Bike not found"
      });
    }

    res.json(listing);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch bike",
      error: error.message
    });
  }
});

router.patch(
  "/:bookingId/request-start",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const booking = await requestRideStartService(
        req.params.bookingId,
        req.user!.userId.toString()
      );
      res.status(200).json({ success: true, message: "Ride start requested", booking });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.patch(
  "/:bookingId/accept-start",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const booking = await acceptRideStartService(
        req.params.bookingId,
        req.user!.userId.toString()
      );
      res.status(200).json({ success: true, message: "Ride started successfully", booking });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.patch(
  "/:bookingId/request-completion",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const booking = await requestRideCompletionService(
        req.params.bookingId,
        req.user!.userId.toString()
      );
      res.status(200).json({ success: true, message: "Completion requested, waiting for renter confirmation", booking });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export default router;