// src/apis/user/auth.api.ts
import { Router, Request, Response } from "express";

import { authMiddleware } from "../../Middlewares/auth.middleware";

import { createListingService, searchListingsService, getFirstFourBikesService, filterListingsService, searchAvailableBikesService, getAllListingsService, getListingByIdService } from "./listing.service";
import { uploadBikeImages } from "../../Middlewares/upload.middleware";
import { AuthRequest } from "../../types/auth-request";


const router = Router();


router.post(
  "/listnewbike",
  authMiddleware,

  uploadBikeImages.array("photos", 6), // max 6 images
  async (req: AuthRequest, res: Response) => {
    try {
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
        location
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
export default router;