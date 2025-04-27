import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// إعداد مكان حفظ الصور
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/"); // يحفظ الصور في مجلد uploads
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // اسم عشوائي + امتداد الصورة
  },
});

// ✅ هنا نحدد النوع بدقة بدل any
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // فقط صور
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
