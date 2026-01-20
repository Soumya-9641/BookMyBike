// src/apis/user/index.ts
import { Router } from "express";

import authApi from "./auth.routes";


const router = Router();

// group user APIs
router.use("/auth", authApi);


export default router;
