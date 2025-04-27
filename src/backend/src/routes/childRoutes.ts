import express, { Request, Response, NextFunction } from "express";
import upload from "../utils/upload";
import ChildModel from "../models/child";

const router = express.Router();

// إنشاء طفل جديد مع رفع صورة
router.post(
  "/children",
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        childName,
        fatherName,
        identityNumber,
        missingPlace,
        documentNumber,
        documentDate,
        missingDate,
      } = req.body;

      if (!req.file) {
        res.status(400).json({ message: "No image uploaded" });
        return;
      }

      const newChild = new ChildModel({
        childName,
        fatherName,
        identityNumber,
        missingPlace,
        documentNumber,
        documentDate,
        missingDate,
        imageUrl: req.file.filename, // نحفظ اسم الصورة المرفوعة
      });

      await newChild.save();

      res.status(201).json(newChild);
    } catch (error) {
      next(error); // نمرر الخطأ للـ Error Handler الخاص بـ Express
    }
  }
);

export default router;
