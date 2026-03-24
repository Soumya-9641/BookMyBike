import express, { Application } from "express";
import cors from "cors";
//import testRoutes from "./routes/test.routes";
import userRoutes from "./Apis/User";
import comingSoonRoutes from "./Apis/General/comingsoon.routes";
import bikeRoutes from "./Apis/Bike";
import checkoutRoutes from "./Apis/Checkout/stripe.routes";
import DashboardRoutes from "./Apis/Dashboard/dashboard.routes";
import AdminRoutes from "./Apis/User/adminAuth.routes";
import AdminStatRoutes from "./Apis/Admin/admin.routes"
import path from "path";
import stripeWebhook from "./Apis/Checkout/stripe.webhook";
const app: Application = express();
app.use("/api/webhooks", stripeWebhook);
app.use(cors());




app.use(express.json());

//app.use("/api", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api", comingSoonRoutes);
app.use("/api/bike", bikeRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin",AdminRoutes);
app.use("/api/dashboard",DashboardRoutes);
app.use("/api/adminstats",AdminStatRoutes);
app.use(
  
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);
export default app;
