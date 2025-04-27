import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './Db/Db';
import User from './models/User';
import cors from "cors";
import path from 'path';



dotenv.config();

const app = express();

// إعداد Express لاستقبال JSON
app.use(express.json());
app.use(cors());
// الاتصال بقاعدة البيانات
connectDB();

// إضافة مستخدم جديد
app.post('/api/users', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('فشل إضافة المستخدم:', (error as Error).message);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// ميدل وير لمعالجة جميع الأخطاء يجب أن يكون آخر شيء

app.get("/api", (req, res) => {
  res.send("الخادم يعمل 🔥");
});

// بدء الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
