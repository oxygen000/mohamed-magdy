import { Link } from "react-router-dom"; // استيراد مكون Link من مكتبة react-router-dom للتنقل بين الصفحات

function Nav() {
  return (
    <nav className="shadow-md bg-white "> {/* شريط التنقل مع إضافة الظل ولون الخلفية الأبيض */}
      <div className="flex items-center justify-between h-20 w-full px-6"> {/* تقسيم الشريط إلى جزئين باستخدام flex */}
        
        <ul className="flex items-center gap-4"> {/* قائمة أفقية لعرض الشعارين بجانب بعض */}
          <li>
            <img
              src="./nav/logo2.png" // مصدر الصورة لشعار 2
              alt="logo2" // النص البديل للصورة
              className="w-16 h-16 object-contain" // تنسيق الصورة (القياس، والاحتفاظ بالنسبة الأصلية)
            />
          </li>
          <li>
            <img
              src="./nav/logo1.png" // مصدر الصورة لشعار 1
              alt="logo1" // النص البديل للصورة
              className="w-16 h-16 object-contain" // تنسيق الصورة (القياس، والاحتفاظ بالنسبة الأصلية)
            />
          </li>
        </ul>

        {/* الجزء الذي يحتوي على النص والذي يتم محاذاته إلى اليمين */}
        <div className="text-end ">
          {/* رابط يؤدي إلى الصفحة الرئيسية */}
          <Link to={"/"} className="text-lg font-black text-blue-900">
            وزارة الداخلية <br/>
            قطاع أمن الجيزة <br/>
            مكتب مساعد الوزير
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
