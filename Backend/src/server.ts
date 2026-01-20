

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";



import app from "./app";
import connectDB from "./db";

connectDB();

const PORT = process.env.PORT || 5000;
app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});
app.use(express.json());
// serve frontend
app.use(express.static(path.join(__dirname, "../../frontend/build")));

// app.get("/*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "../../frontend/build/index.html")
//   );
// });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
