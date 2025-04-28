import { useState } from "react"; // استيراد useState لإدارة الحالة في React
import { FaSearch, FaCloudUploadAlt } from "react-icons/fa"; // استيراد أيقونة البحث ورفع
import { IoIosArrowBack } from "react-icons/io"; // استيراد أيقونة العودة
import { Link, useNavigate } from "react-router-dom"; // استيراد Link للتنقل بين الصفحات و useNavigate
import TextField from "@mui/material/TextField"; // استيراد حقل الإدخال من مكتبة MUI
import Button from "@mui/material/Button"; // استيراد زر من مكتبة MUI
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material"; // استيراد مكونات من مكتبة MUI
import "./add-child.css"; // استيراد ملف CSS لتنسيق الصفحة
import { toast } from "react-toastify"; // استيراد دالة toast من المكتبة
import "react-toastify/dist/ReactToastify.css"; // استيراد ملف CSS الخاص بـ react-toastify
import { useAppContext } from "../../contexts/AppContext"; // استيراد useAppContext من ملف المكتبة

function AddChild() {
  const navigate = useNavigate();
  const { addPersonWithFace } = useAppContext();

  // حالات لتخزين قيم الحقول
  const [childName, setChildName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [lossLocation, setLossLocation] = useState("");
  const [lossDate, setLossDate] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [status, setStatus] = useState<
    "missing" | "found" | "under_investigation"
  >("missing");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!childName) newErrors.childName = "اسم الطفل مطلوب";
    if (!fatherName) newErrors.fatherName = "اسم الوالد مطلوب";
    if (!nationalID) newErrors.nationalID = "الرقم القومي مطلوب";
    if (!lossLocation) newErrors.lossLocation = "مكان الفقدان مطلوب";
    if (!lossDate) newErrors.lossDate = "تاريخ الفقدان مطلوب";
    if (!phoneNumber) newErrors.phoneNumber = "رقم الهاتف مطلوب";

    // Age validation
    if (
      age !== "" &&
      (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 18)
    ) {
      newErrors.age = "العمر يجب أن يكون بين 0 و 18";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // تأكد من أن الحقول المطلوبة مليئة
    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول الإلزامية بشكل صحيح!");
      return;
    }

    try {
      // Prepare child data
      const childData = {
        name: childName,
        fatherName: fatherName,
        nationalId: nationalID,
        lostLocation: lossLocation,
        lostDate: lossDate,
        documentNumber: documentID,
        documentDate: documentDate,
        imageUrl: image || "/dataimg/child-placeholder.jpg",
        registrationDate: new Date().toISOString().split("T")[0],
        gender,
        age: age !== "" ? Number(age) : 0,
        lastSeenDate: lossDate, // Use loss date as the last seen date
        status,
        phoneNumber,
        reporterId: "user-" + Date.now(), // Generate a temporary reporter ID
      };

      // Add the child using the context function
      await addPersonWithFace(childData, image || undefined);

      toast.success("تم إضافة الطفل بنجاح!");

      // Reset form after successful submission
      setChildName("");
      setFatherName("");
      setNationalID("");
      setLossLocation("");
      setLossDate("");
      setDocumentID("");
      setDocumentDate("");
      setAge("");
      setPhoneNumber("");
      setImage(null);

      // Redirect to home page after delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error adding child:", error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء إضافة الطفل"
      );
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <section className="fade-in">
      {" "}
      {/* إضافة تأثير التلاشي عند تحميل الصفحة */}
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
              error={!!errors.childName}
              helperText={errors.childName}
            />

            {/* حقل إدخال "اسم الوالد" */}
            <TextField
              label="اسم الوالد"
              variant="outlined"
              fullWidth
              required
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              error={!!errors.fatherName}
              helperText={errors.fatherName}
            />

            {/* حقل إدخال "الرقم القومي" */}
            <TextField
              label="الرقم القومي"
              variant="outlined"
              fullWidth
              required
              value={nationalID}
              onChange={(e) => setNationalID(e.target.value)}
              error={!!errors.nationalID}
              helperText={errors.nationalID}
            />

            {/* حقل إدخال "رقم الهاتف" */}
            <TextField
              label="رقم الهاتف"
              variant="outlined"
              fullWidth
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />

            {/* حقل إدخال "مكان الفقدان" */}
            <TextField
              label="مكان الفقدان"
              variant="outlined"
              fullWidth
              required
              value={lossLocation}
              onChange={(e) => setLossLocation(e.target.value)}
              error={!!errors.lossLocation}
              helperText={errors.lossLocation}
            />

            {/* حقل إدخال "تاريخ الفقدان" */}
            <TextField
              label="تاريخ الفقدان"
              variant="outlined"
              type="date" // نوع الحقل تاريخ
              InputLabelProps={{ shrink: true }} // يعرض التاريخ بشكل صحيح
              fullWidth
              required
              value={lossDate}
              onChange={(e) => setLossDate(e.target.value)}
              error={!!errors.lossDate}
              helperText={errors.lossDate}
            />

            {/* حقل إدخال "العمر" */}
            <TextField
              label="العمر"
              variant="outlined"
              type="number"
              fullWidth
              value={age}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : "")
              }
              error={!!errors.age}
              helperText={errors.age}
            />

            {/* حقل إدخال "الجنس" */}
            <FormControl fullWidth>
              <InputLabel id="gender-label">الجنس</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="الجنس"
                onChange={(e) => setGender(e.target.value as "male" | "female")}
              >
                <MenuItem value="male">ذكر</MenuItem>
                <MenuItem value="female">أنثى</MenuItem>
              </Select>
            </FormControl>

            {/* حقل إدخال "الحالة" */}
            <FormControl fullWidth>
              <InputLabel id="status-label">الحالة</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="الحالة"
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "missing"
                      | "found"
                      | "under_investigation"
                  )
                }
              >
                <MenuItem value="missing">مفقود</MenuItem>
                <MenuItem value="found">تم العثور عليه</MenuItem>
                <MenuItem value="under_investigation">قيد التحقيق</MenuItem>
              </Select>
            </FormControl>

            {/* حقل إدخال "رقم الوثيقة" */}
            <TextField
              label="رقم الوثيقة"
              variant="outlined"
              fullWidth
              value={documentID}
              onChange={(e) => setDocumentID(e.target.value)}
            />

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
                  className="relative flex items-center justify-center bg-gray-100 border rounded-md cursor-pointer hover:bg-gray-200 p-6"
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
                <FormHelperText>
                  صورة واضحة للوجه تساعد في عملية البحث والتعرف
                </FormHelperText>
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
