import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/bikes");
  },
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  }
});


const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};


export const uploadBikeImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 
  }
});