
import { Router, Request, Response } from "express";
import Waitlist from "../../Models/Waitlist";

const router = Router();


router.post("/comingsoon", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log(email)
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const result = await addToWaitlistService(email);

    if (result.alreadyExists) {
      return res.json({
        message: "You are already on the waitlist"
      });
    }

    res.status(201).json({
      message: "You have been added to the waitlist"
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to join waitlist",
      error: error.message
    });
  }
});

 const addToWaitlistService = async (email: string) => {
  const existing = await Waitlist.findOne({ email });

  if (existing) {
    return { alreadyExists: true };
  }

  await Waitlist.create({ email });

  return { alreadyExists: false };
};

export default router;
