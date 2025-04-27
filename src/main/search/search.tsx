import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState } from "react";

function Search() {
  const [image, setImage] = useState<string | null>(null); // لتخزين الصورة المرفوعة
  const [isUploading, setIsUploading] = useState(false); // لمعرفة إذا كانت الصورة قيد التحميل

  // دالة لمعالجة رفع الصورة
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true); // بدأ التحميل
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsUploading(false); // انتهى التحميل
        setImage(reader.result as string); // تخزين الصورة
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <section>
        {/* شريط التنقل */}
        <nav className="flex flex-col items-end justify-center gap-4 mt-10 mr-10">
          {/* رابط إضافة */}
          <Link
            to="/add" // الرابط الذي يؤدي إلى صفحة إضافة
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            إضافة بيانات جديدة
            <IoMdAdd className="text-lg" /> {/* إضافة أيقونة إضافة بجانب النص */}
          </Link>
        </nav>

        <main>
          <div className="flex flex-col items-center justify-center gap-4 mt-10">
            <h1 className="text-2xl font-bold text-gray-800">البحث بالصورة</h1>
            <p className="text-gray-600">قم بتحميل الصورة للبحث عن البيانات المرتبطة بها.</p>

            {/* حقل رفع الصورة */}
            <input
              type="file"
              accept="image/*"
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleImageChange}
            />

            {/* عرض الصورة المرفوعة */}
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">معاينة الصورة:</p>
                <img src={image} alt="معاينة" className="w-48 h-48 object-cover mt-2 border rounded-md shadow-lg" />
              </div>
            )}

            {/* زر البحث */}
            <button
              className="mt-4 px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300"
              disabled={isUploading || !image} // تعطيل الزر أثناء التحميل أو إذا لم يتم رفع صورة
            >
              {isUploading ? "جاري التحميل..." : "بحث"}
            </button>
          </div>
        </main>
      </section>
    </>
  );
}

export default Search;
