
import { Router, Request, Response } from "express";
import stripe from "../../Utils/stripe";
import { authMiddleware } from "../../Middlewares/auth.middleware";
import { completeBookingService, createBookingPaymentService, payoutToOwnerService, refundDepositService } from "./stripe.service";
import { AuthRequest } from "../../types/auth-request";
import Booking from "../../Models/Booking";
import User from "../../Models/User";
const router = Router();


router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Node.js and Express Book"
            },
            unit_amount: 50 * 100
          },
          quantity: 1
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "JavaScript T-Shirt"
            },
            unit_amount: 20 * 100
          },
          quantity: 2
        }
      ],

      mode: "payment",

      success_url: `${process.env.BASE_URL}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/api/checkout/cancel`
    });

    res.json({
      checkoutUrl: session.url
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Stripe checkout failed",
      error: error.message
    });
  }
});


router.get("/success", (req, res) => {
  res.send("Payment successful!");
});

router.get("/cancel", (req, res) => {
  res.send("Payment cancelled.");
});


router.post("/create", authMiddleware, async (req: AuthRequest, res: Response) => {
  const result = await createBookingPaymentService({
    listingId: req.body.listingId,
    renterId: req.user!.userId.toString(),
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    hours: req.body.hours
  });

  res.json(result);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.json(booking);
});

router.post("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const result = await completeBookingService(req.params.id);
    res.json(result);
  } catch (err: any) {
    console.log(err)
    return res.status(500).json({ message: "Could not complete booking", error: err.message });
  }

});

router.post("/createcustomer", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.stripeCustomerId) {
      return res.json({
        stripeCustomerId: user.stripeCustomerId,
        message: "Stripe customer already exists"
      });
    }


    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user._id.toString()
      }
    });

    user.stripeCustomerId = customer.id;
    await user.save();

    res.json({
      stripeCustomerId: customer.id,
      message: "Stripe customer created successfully"
    });

  } catch (err: any) {
    console.log(err)
    return res.status(500).json({ message: "Could not create customer", error: err.message });
  }
})

router.post(
  "/dev/complete-payment",
  async (req: Request, res: Response) => {
    // if (process.env.NODE_ENV === "production") {
    //   return res.status(403).json({ message: "Disabled in production" });
    // }

    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const user = await User.findById(booking.renterId);
    if (!user || !user.stripeCustomerId) {
      throw new Error("Stripe customer missing");
    }


    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_visa" // ⭐ SAFE TEST METHOD
      }
    })
    console.log(paymentMethod)
    // 2️⃣ Attach to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: user.stripeCustomerId
    });

    // 3️⃣ Confirm EXISTING PaymentIntent
    const intent = await stripe.paymentIntents.confirm(
      booking.stripePaymentIntentId,
      {
        payment_method: 'pm_card_visa',
        // return_url: 'https://www.example.com',
      }
    );
    console.log(intent)
    res.json({
      message: "Payment completed",
      paymentIntentId: intent.id,
      status: intent.status
    });
  }
);


router.post(
  "/:id/refund-deposit",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await refundDepositService(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.post(
  "/dev/owners/create-connect-account", authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      // if (process.env.NODE_ENV === "production") {
      //       return res.status(403).json({ message: "Disabled in production" });
      //     }

      const user = await User.findById(req.user?.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.businessProfile?.stripeIdentityId) {
        return res.json({
          message: "Connect account already exists",
          stripeAccountId: user.businessProfile.stripeIdentityId
        });
      }

      const account = await stripe.accounts.create({
        
        email: user.email,
        controller: {
          fees: {
            payer: 'application',
          },
          losses: {
            payments: 'application',
          },
          stripe_dashboard: {
            type: 'express',
          },
        },
      });
    //  const account = await stripe.v2.core.accounts.create({
//   contact_email: 'jenny.rosen@example.com',
//   display_name: 'Jenny Rosen',
//   dashboard: 'full',
//   identity: {
//     business_details: {
//       registered_name: 'Furever',
//     },
//     country: 'us',
//     entity_type: 'company',
//   },
//   configuration: {
//     customer: {
//       capabilities: {
//         automatic_indirect_tax: {
//           requested: true,
//         },
//       },
//     },
//     merchant: {
//       capabilities: {
//         card_payments: {
//           requested: true,
//         },
//       },
//     },
//   },
//   defaults: {
//     currency: 'usd',
//     responsibilities: {
//       fees_collector: 'stripe',
//       losses_collector: 'stripe',
//     },
//     locales: ['en-US'],
//   },
//   include: [
//     'configuration.customer',
//     'configuration.merchant',
//     'identity',
//     'requirements',
//   ],
// });
      console.log(account)


      if (user.businessProfile) {
        user.businessProfile.stripeIdentityId = account.id;
      }
      await user.save();

      res.json({
        message: "Stripe Connect account created (dev)",
        stripeAccountId: account.id
      });
    } catch (err: any) {
      console.log(err)
      return res.status(500).json({ message: "Could not create connect account", error: err.message });
    }

  }
);

router.post(
  "/dev/owners/add-bank",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Disabled in production" });
    }

    const user = await User.findById(req.user?.userId);
    if (!user || !user.businessProfile?.stripeIdentityId) {
      return res.status(404).json({ message: "Owner or Stripe account missing" });
    }

    // Attach test bank account
    const bankAccount = await stripe.accounts.createExternalAccount(
      user.businessProfile?.stripeIdentityId,
      {
        external_account: "btok_us_verified" // ⭐ TEST BANK
      }
    );

    res.json({
      message: "Test bank account attached",
      bankAccountId: bankAccount.id
    });
  }
);

router.post("/api/bookings/dev/payout-ownerer", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {

    const bookingId = req.user?.userId.toString() || "";
    const result = await payoutToOwnerService(bookingId);
    res.json(result);

  } catch (err: any) {
    console.log(err)
    return res.status(500).json({ message: "Could not payout owner", error: err.message });
  }
})

export default router;
