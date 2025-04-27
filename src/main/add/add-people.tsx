import { Button, TextField } from "@mui/material"; // استيراد مكونات Button و TextField من مكتبة MUI
import { FaCloudUploadAlt, FaSearch } from "react-icons/fa"; // استيراد أيقونة البحث من مكتبة react-icons
import { IoIosArrowBack } from "react-icons/io"; // استيراد أيقونة العودة من مكتبة react-icons

import { Link } from "react-router-dom"; // استيراد Link من مكتبة react-router-dom لإدارة التنقل بين الصفحات
import { useState } from "react"; // استيراد useState من React لإدارة حالة المكونات

function AddPeople() {
  const [image, setImage] = useState<string | null>(null); // حالة لتخزين الصورة التي يتم تحميلها
  const [isUploading, setIsUploading] = useState(false); // حالة لمعرفة إذا كان يتم تحميل صورة أم لا

  // دالة لمعالجة رفع الصورة
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // الحصول على الملف الذي تم اختياره
    if (file) {
      setIsUploading(true); // بدأ التحميل
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsUploading(false); // انتهى التحميل
        setImage(reader.result as string); // تخزين الصورة بعد تحميلها
      };
      reader.readAsDataURL(file); // قراءة الملف وتحويله إلى بيانات URL
    }
  };

  // دالة لمحاكاة النقر على input عند النقر على الزر
  const handleClick = () => {
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement; // تحديد عنصر الإدخال
    if (fileInput) {
      fileInput.click(); // محاكاة النقر على input لاختيار الصورة
    }
  };

  // دالة لحفظ البيانات
  const handleSubmit = () => {
    // هنا يمكنك إضافة الكود لإرسال البيانات إلى الخادم (API)
    console.log("Data submitted!"); // طباعة رسالة عند إرسال البيانات
    console.log(image); // هنا نطبع الصورة في حالة كان تم تحميلها
  };

  return (
    <section>
      {/* شريط التنقل */}
      <nav className="flex flex-row items-center justify-between p-6 gap-6 mt-10">
        {/* رابط العودة */}
        <Link
          to="/add" // رابط العودة إلى الصفحة السابقة
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-blue-700 text-white font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <IoIosArrowBack /> {/* أيقونة العودة */}
          عودة
        </Link>

        {/* رابط البحث */}
        <Link
          to="/search" // رابط للبحث
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-blue-700 text-white font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaSearch className="text-lg" /> {/* أيقونة البحث */}
          بحث جديد
        </Link>
      </nav>

      <div className="flex flex-col gap-4 items-center justify-center">
        {/* عنوان النموذج */}
        <h1 className="text-2xl font-bold text-blue-900">إضافة بيانات شخص</h1>
      </div>

      {/* النموذج */}
      <main className="flex justify-center mt-10 px-4" dir="rtl">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {/* الحقول */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* حقل إدخال "اسم الشخص" */}
            <TextField
              label="اسم الشخص" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
            />

            {/* حقل إدخال "اسم الوالد" */}
            <TextField
              label="اسم الوالد" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
            />

            {/* حقل إدخال "الرقم القومي" */}
            <TextField
              label="الرقم القومي" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
            />

            {/* حقل إدخال "مكان الفقدان" */}
            <TextField
              label="مكان الفقدان" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
            />

            {/* حقل إدخال "تاريخ الفقدان" */}
            <TextField
              label="تاريخ الفقدان" // نص الحقل
              variant="outlined" // نوع الحقل
              type="date" // نوع الحقل تاريخ
              InputLabelProps={{ shrink: true }} // يجعل تاريخ الفقدان يعرض بشكل صحيح
              fullWidth // جعل الحقل يأخذ العرض الكامل
            />

            {/* حقل إدخال "رقم الوثيقة" */}
            <TextField
              label="رقم الوثيقة" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
            />

            {/* حقل إدخال "تاريخ الوثيقة" */}
            <TextField
              label="تاريخ الوثيقة" // نص الحقل
              variant="outlined" // نوع الحقل
              type="date" // نوع الحقل تاريخ
              InputLabelProps={{ shrink: true }} // يجعل تاريخ الوثيقة يعرض بشكل صحيح
              fullWidth // جعل الحقل يأخذ العرض الكامل
            />

            {/* حقل رفع الصورة */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-semibold text-gray-700">
                رفع صورة الطفل
              </label>
              <div className="relative w-full">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*" // يقتصر على الصور فقط
                  onChange={handleImageChange} // استدعاء الدالة عند تغيير الصورة
                  className="hidden" // تأكد من إخفاء input
                />
                <div
                  onClick={handleClick} // استدعاء الدالة عند النقر
                  className="relative flex items-center justify-center bg-gray-100 border rounded-md cursor-pointer hover:bg-gray-200"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          >
                            <path
                              strokeDasharray="2 4"
                              strokeDashoffset={6}
                              d="M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                dur="0.6s"
                                repeatCount="indefinite"
                                values="6;0"
                              ></animate>
                            </path>
                            <path
                              strokeDasharray={32}
                              strokeDashoffset={32}
                              d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9"
                            >
                              <animate
                                fill="freeze"
                                attributeName="stroke-dashoffset"
                                begin="0.1s"
                                dur="0.4s"
                                values="32;0"
                              ></animate>
                            </path>
                            <path
                              strokeDasharray={10}
                              strokeDashoffset={10}
                              d="M12 16v-7.5"
                            >
                              <animate
                                fill="freeze"
                                attributeName="stroke-dashoffset"
                                begin="0.5s"
                                dur="0.2s"
                                values="10;0"
                              ></animate>
                            </path>
                            <path
                              strokeDasharray={6}
                              strokeDashoffset={6}
                              d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
                            >
                              <animate
                                fill="freeze"
                                attributeName="stroke-dashoffset"
                                begin="0.7s"
                                dur="0.2s"
                                values="6;0"
                              ></animate>
                            </path>
                          </g>
                        </svg>
                      </span>{" "}
                      {/* رمز التحميل */}
                      <span>جاري التحميل...</span> {/* نص التحميل */}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaCloudUploadAlt className="text-xl text-blue-500" />{" "}
                      {/* أيقونة رفع الصورة */}
                      <span>اضغط لرفع صورة</span> {/* نص الزر */}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* معاينة الصورة في حالة رفعها */}
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">معاينة الصورة:</p>
                <img
                  src={image} // مصدر الصورة
                  alt="معاينة" // نص بديل للصورة
                  className="w-48 h-48 object-cover mt-2 border rounded-md shadow-lg" // تنسيق الصورة
                />
              </div>
            )}
          </div>

          {/* زر إرسال البيانات */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              height: "50px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            fullWidth
            onClick={handleSubmit} // عند النقر على الزر، سيتم إرسال البيانات
          >
            إرسال البيانات
          </Button>
        </div>
      </main>
    </section>
  );
}

export default AddPeople; // تصدير المكون ليتم استخدامه في أماكن أخرى
