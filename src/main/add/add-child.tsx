import { useState } from "react"; // استيراد useState لإدارة الحالة في React
import { FaSearch, FaCloudUploadAlt } from "react-icons/fa"; // استيراد أيقونة البحث ورفع
import { IoIosArrowBack } from "react-icons/io"; // استيراد أيقونة العودة
import { Link } from "react-router-dom"; // استيراد Link للتنقل بين الصفحات
import TextField from "@mui/material/TextField"; // استيراد حقل الإدخال من مكتبة MUI
import Button from "@mui/material/Button"; // استيراد زر من مكتبة MUI
import "./add-child.css"; // استيراد ملف CSS لتنسيق الصفحة
import { toast } from "react-toastify"; // استيراد دالة toast من المكتبة
import "react-toastify/dist/ReactToastify.css"; // استيراد ملف CSS الخاص بـ react-toastify

function AddChild() {
  // حالات لتخزين قيم الحقول
  const [childName, setChildName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [lossLocation, setLossLocation] = useState("");
  const [lossDate, setLossDate] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsUploading(false);
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // تأكد من أن الحقول المطلوبة مليئة
    if (!childName || !fatherName || !nationalID || !lossLocation || !lossDate) {
      toast.error("يرجى ملء جميع الحقول الإلزامية!");
      return;
    }
  
    // منطق إرسال البيانات هنا (على سبيل المثال إرسالها إلى API)
    // على سبيل المثال:
    // ارسال البيانات إلى الخادم
  
    toast.success("تم إضافة الطفل بنجاح!");
  
    // بعد نجاح الإضافة، نقوم بإفراغ الحقول
    setChildName("");  // إفراغ حقل اسم الطفل
    setFatherName("");  // إفراغ حقل اسم الوالد
    setNationalID("");  // إفراغ حقل الرقم القومي
    setLossLocation("");  // إفراغ حقل مكان الفقدان
    setLossDate("");  // إفراغ حقل تاريخ الفقدان
    setDocumentID("");  // إفراغ حقل رقم الوثيقة
    setDocumentDate("");  // إفراغ حقل تاريخ الوثيقة
    setImage(null);  // إفراغ حقل الصورة
    
  };
  

  const handleClick = () => {
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };
  


  
  return (
    <section className="fade-in"> {/* إضافة تأثير التلاشي عند تحميل الصفحة */}
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

      {/* عنوان النموذج */}
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-2xl font-bold text-blue-900">إضافة بيانات طفل</h1>
      </div>

      {/* النموذج */}
      <main className="flex justify-center mt-10 px-4" dir="rtl">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {/* الحقول */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* حقل إدخال "اسم الطفل" */}
            <TextField
              label="اسم الطفل" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
              value={childName} // إضافة القيمة للحقل
              onChange={(e) => setChildName(e.target.value)} // تحديث القيمة في الحالة
            />

            {/* حقل إدخال "اسم الوالد" */}
            <TextField
              label="اسم الوالد"
              variant="outlined"
              fullWidth
              required
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
            />

            {/* حقل إدخال "الرقم القومي" */}
            <TextField
              label="الرقم القومي"
              variant="outlined"
              fullWidth
              required
              value={nationalID}
              onChange={(e) => setNationalID(e.target.value)}
            />

            {/* حقل إدخال "مكان الفقدان" */}
            <TextField
              label="مكان الفقدان"
              variant="outlined"
              fullWidth
              required
              value={lossLocation}
              onChange={(e) => setLossLocation(e.target.value)}
            />

            {/* حقل إدخال "تاريخ الفقدان" */}
            <TextField
              label="تاريخ الفقدان"
              variant="outlined"
              type="date" // نوع الحقل تاريخ
              InputLabelProps={{ shrink: true }} // يعرض التاريخ بشكل صحيح
              fullWidth
              value={lossDate}
              onChange={(e) => setLossDate(e.target.value)}
            />

            {/* حقل إدخال "رقم الوثيقة" */}
            <TextField label="رقم الوثيقة" variant="outlined" fullWidth
            value={documentID}
            onChange={(e) => setDocumentID(e.target.value)} />

            {/* حقل إدخال "تاريخ الوثيقة" */}
            <TextField
              label="تاريخ الوثيقة"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
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
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" // تأكد من إخفاء input
                />
                <div
                  onClick={handleClick}
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
                      <span>جاري التحميل...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaCloudUploadAlt className="text-xl text-blue-500" />{" "}
                      {/* أيقونة رفع صورة */}
                      <span>اضغط لرفع صورة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* عرض الصورة بعد رفعها */}
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">معاينة الصورة:</p>
                <img
                  src={image}
                  alt="معاينة"
                  className="w-48 h-48 object-cover mt-2 border rounded-md shadow-lg"
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
            onClick={handleSubmit} //
          >
            إرسال البيانات
          </Button>
        </div>
      </main>
      
    </section>
  );
}

export default AddChild;
