import { Link } from "react-router-dom"; // استيراد مكون Link من مكتبة react-router-dom للتنقل بين الصفحات
import { FaSearch } from "react-icons/fa"; // استيراد أيقونة البحث من مكتبة react-icons

function add() {
  return (
    <>
      <section>
        {/* شريط التنقل */}
        <nav className="flex flex-col items-end justify-center gap-4 mt-10 mr-10">
          {/* رابط البحث */}
          <Link
            to="/search" // الرابط الذي يؤدي إلى صفحة البحث
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            بحث جديد
            <FaSearch className="text-lg " /> {/* إضافة أيقونة البحث بجانب النص */}
          </Link>
        </nav>

        <main className="flex flex-col md:flex-row items-center gap-3 justify-center mt-10">
          {/* زر "ذوي الاحتياجات" وهو زر غير قابل للتفاعل */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-400 text-white font-medium shadow-md transition-all duration-300 ease-in-out cursor-not-allowed"
            onClick={(e) => e.preventDefault()} // منع تفاعل الزر
          >
            ذوي الاحتياجات
          </button>

          {/* رابط لإضافة بيانات شخص */}
          <Link
            to={"add-people"} // الرابط الذي يؤدي إلى صفحة إضافة بيانات شخص
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            اضافة بيانات شخص
          </Link>

          {/* رابط لإضافة بيانات طفل */}
          <Link
            to={"add-child"} // الرابط الذي يؤدي إلى صفحة إضافة بيانات طفل
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            اضافة بيانات طفل
          </Link>
        </main>
      </section>
    </>
  );
}

export default add;
