// src/apis/user/index.ts
import { Router } from "express";

import listApi from "./listing.routes";


const router = Router();

// group user APIs
router.use("/listing", listApi);


export default router;