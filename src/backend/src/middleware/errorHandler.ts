import { Request, Response } from "express";

// هذا ميدل وير مركزي لمعالجة جميع الأخطاء
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response
): Response => {
  console.error("حدث خطأ:", err);

  // إذا الخطأ كان كائن وفيه رسالة نطبعها
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }

  // في حال خطأ غير معروف
  return res.status(500).json({ message: "حدث خطأ غير متوقع" });
};
