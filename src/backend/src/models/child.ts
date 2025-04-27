import { Schema, model, Document } from "mongoose";

// تعريف الواجهة (Interface) للطفل
export interface IChild extends Document {
  childName: string;
  fatherName: string;
  identityNumber: string;
  missingPlace: string;
  documentNumber: string;
  documentDate: Date;
  missingDate: Date;
  imageUrl: string; // اسم أو مسار الصورة المحفوظ
}

// إنشاء الـ Schema
const ChildSchema = new Schema<IChild>(
  {
    childName: {
      type: String,
      required: [true, "اسم الطفل مطلوب"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "اسم الأب مطلوب"],
      trim: true,
    },
    identityNumber: {
      type: String,
      required: [true, "رقم الهوية مطلوب"],
      unique: true,
      trim: true,
    },
    missingPlace: {
      type: String,
      required: [true, "مكان الفقدان مطلوب"],
      trim: true,
    },
    documentNumber: {
      type: String,
      required: [true, "رقم الوثيقة مطلوب"],
      unique: true,
      trim: true,
    },
    documentDate: {
      type: Date,
      required: [true, "تاريخ الوثيقة مطلوب"],
    },
    missingDate: {
      type: Date,
      required: [true, "تاريخ الفقدان مطلوب"],
    },
    imageUrl: {
      type: String,
      required: [true, "الصورة مطلوبة"],
    },
  },
  {
    timestamps: true, // يضيف حقول createdAt و updatedAt تلقائياً
  }
);

// إنشاء الموديل
const ChildModel = model<IChild>("Child", ChildSchema);

export default ChildModel;
