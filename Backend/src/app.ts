import express, { Application } from "express";
import cors from "cors";
//import testRoutes from "./routes/test.routes";
import userRoutes from "./Apis/User";
import comingSoonRoutes from "./Apis/General/comingsoon.routes";
import bikeRoutes from "./Apis/Bike";
import path from "path";
const app: Application = express();

app.use(cors());
app.use(express.json());

//app.use("/api", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api", comingSoonRoutes);
app.use("/api/bike", bikeRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);
export default app;
