import mongoose from "mongoose";
import dotenv from "dotenv";

// تحميل الإعدادات من ملف .env
dotenv.config();

// إعداد الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || ""; // استخدام الرابط من متغير البيئة
    if (!uri) {
      throw new Error("رابط الاتصال بقاعدة البيانات مفقود");
    }
    await mongoose.connect(uri, {});
    console.log("تم الاتصال بقاعدة البيانات بنجاح");
  } catch (error) {
    console.error("فشل الاتصال بقاعدة البيانات:", (error as Error).message);
    process.exit(1); // إيقاف التطبيق في حال فشل الاتصال
  }
};

export default connectDB;
