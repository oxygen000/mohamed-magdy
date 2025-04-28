import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material"; // استيراد مكونات Button و TextField و FormControl و InputLabel و MenuItem و Select و FormHelperText من مكتبة MUI
import { FaCloudUploadAlt, FaSearch } from "react-icons/fa"; // استيراد أيقونة البحث من مكتبة react-icons
import { IoIosArrowBack } from "react-icons/io"; // استيراد أيقونة العودة من مكتبة react-icons
import "./add-child.css"; // استيراد ملف CSS لتنسيق الصفحة

import { Link, useNavigate } from "react-router-dom"; // استيراد Link و useNavigate من مكتبة react-router-dom لإدارة التنقل بين الصفحات
import { useState } from "react"; // استيراد useState من React لإدارة حالة المكونات
import { useAppContext } from "../../contexts/AppContext"; // استيراد useAppContext من ملف AppContext
import { toast } from "react-toastify"; // استيراد toast من مكتبة react-toastify
import "react-toastify/dist/ReactToastify.css"; // استيراد ملف CSS لتنسيق toast

function AddPeople() {
  const navigate = useNavigate();
  const { addPersonWithFace } = useAppContext();

  // State for form fields
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [lostLocation, setLostLocation] = useState("");
  const [lostDate, setLostDate] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [status, setStatus] = useState<
    "missing" | "found" | "under_investigation"
  >("missing");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [lastSeenDate, setLastSeenDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle image upload
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

  // Handle click on the file upload button
  const handleClick = () => {
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = "اسم الشخص مطلوب";
    if (!fatherName) newErrors.fatherName = "اسم الوالد مطلوب";
    if (!nationalId) newErrors.nationalId = "الرقم القومي مطلوب";
    if (!lostLocation) newErrors.lostLocation = "مكان الفقدان مطلوب";
    if (!lostDate) newErrors.lostDate = "تاريخ الفقدان مطلوب";
    if (!phoneNumber) newErrors.phoneNumber = "رقم الهاتف مطلوب";

    // Age validation
    if (
      age !== "" &&
      (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 120)
    ) {
      newErrors.age = "العمر يجب أن يكون بين 0 و 120";
    }

    // Height validation
    if (
      height !== "" &&
      (isNaN(Number(height)) || Number(height) < 0 || Number(height) > 250)
    ) {
      newErrors.height = "الطول يجب أن يكون بين 0 و 250";
    }

    // Weight validation
    if (
      weight !== "" &&
      (isNaN(Number(weight)) || Number(weight) < 0 || Number(weight) > 300)
    ) {
      newErrors.weight = "الوزن يجب أن يكون بين 0 و 300";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول الإلزامية بشكل صحيح");
      return;
    }

    try {
      // Prepare the person data
      const personData = {
        name,
        fatherName,
        nationalId,
        lostLocation,
        lostDate,
        documentNumber,
        documentDate,
        imageUrl: image || "/dataimg/placeholder.jpg", // Default image if none provided
        registrationDate: new Date().toISOString().split("T")[0],
        gender,
        age: age !== "" ? Number(age) : 0,
        lastSeenDate: lastSeenDate || lostDate, // Use lost date if last seen not provided
        status,
        height: height !== "" ? Number(height) : undefined,
        weight: weight !== "" ? Number(weight) : undefined,
        contactPerson,
        contactPhone,
        phoneNumber,
        reporterId: "user-" + Date.now(), // Generate a temporary reporter ID
      };

      // Call the API to add the person
      await addPersonWithFace(personData, image || undefined);

      toast.success("تم إضافة الشخص بنجاح!");

      // Redirect to home page after successful submission
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error adding person:", error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء إضافة الشخص"
      );
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />

            {/* حقل إدخال "اسم الوالد" */}
            <TextField
              label="اسم الوالد" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              error={!!errors.fatherName}
              helperText={errors.fatherName}
            />

            {/* حقل إدخال "الرقم القومي" */}
            <TextField
              label="الرقم القومي" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              error={!!errors.nationalId}
              helperText={errors.nationalId}
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
              label="مكان الفقدان" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required // يجعل الحقل مطلوباً
              value={lostLocation}
              onChange={(e) => setLostLocation(e.target.value)}
              error={!!errors.lostLocation}
              helperText={errors.lostLocation}
            />

            {/* حقل إدخال "تاريخ الفقدان" */}
            <TextField
              label="تاريخ الفقدان" // نص الحقل
              variant="outlined" // نوع الحقل
              type="date" // نوع الحقل تاريخ
              InputLabelProps={{ shrink: true }} // يجعل تاريخ الفقدان يعرض بشكل صحيح
              fullWidth // جعل الحقل يأخذ العرض الكامل
              required
              value={lostDate}
              onChange={(e) => setLostDate(e.target.value)}
              error={!!errors.lostDate}
              helperText={errors.lostDate}
            />

            {/* حقل إدخال "آخر تاريخ مشاهدة" */}
            <TextField
              label="آخر تاريخ مشاهدة"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={lastSeenDate}
              onChange={(e) => setLastSeenDate(e.target.value)}
            />

            {/* حقل إدخال "رقم الوثيقة" */}
            <TextField
              label="رقم الوثيقة" // نص الحقل
              variant="outlined" // نوع الحقل
              fullWidth // جعل الحقل يأخذ العرض الكامل
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
            />

            {/* حقل إدخال "تاريخ الوثيقة" */}
            <TextField
              label="تاريخ الوثيقة" // نص الحقل
              variant="outlined" // نوع الحقل
              type="date" // نوع الحقل تاريخ
              InputLabelProps={{ shrink: true }} // يجعل تاريخ الوثيقة يعرض بشكل صحيح
              fullWidth // جعل الحقل يأخذ العرض الكامل
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
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

            {/* حقل إدخال "الطول (سم)" */}
            <TextField
              label="الطول (سم)"
              variant="outlined"
              type="number"
              fullWidth
              value={height}
              onChange={(e) =>
                setHeight(e.target.value ? Number(e.target.value) : "")
              }
              error={!!errors.height}
              helperText={errors.height}
            />

            {/* حقل إدخال "الوزن (كج)" */}
            <TextField
              label="الوزن (كج)"
              variant="outlined"
              type="number"
              fullWidth
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value ? Number(e.target.value) : "")
              }
              error={!!errors.weight}
              helperText={errors.weight}
            />

            {/* حقل إدخال "شخص للاتصال" */}
            <TextField
              label="شخص للاتصال"
              variant="outlined"
              fullWidth
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />

            {/* حقل إدخال "هاتف جهة الاتصال" */}
            <TextField
              label="هاتف جهة الاتصال"
              variant="outlined"
              fullWidth
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />

            {/* حقل رفع الصورة */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-semibold text-gray-700">
                رفع صورة الشخص
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
                <FormHelperText>
                  صورة واضحة للوجه تساعد في عملية البحث
                </FormHelperText>
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
