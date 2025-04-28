function Footer() {
    const date = new Date(); // الحصول على تاريخ اليوم الحالي
    const Data = date.toLocaleDateString("en-EG", { // تنسيق التاريخ ليعرض السنة فقط بصيغة "رقمية" باستخدام التواريخ الخاصة بمنطقة "مصر"
      year: "numeric",
    });
  
    return (
      <footer className="w-full  bg-white  mt-4"> {/* الشريط السفلي مع حدود علوية رمادية وخلفية بيضاء وظل خفيف */}
        <div className="max-w-7xl mx-auto px-4"> {/* تحديد العرض الأقصى للشريط السفلي، وتوسيطه أفقياً داخل الصفحة مع إضافة مسافات داخلية */}
          <ul className="flex flex-col md:flex-row items-center justify-between p-4 font-semibold gap-2 text-center text-sm md:text-base"> 
            {/* قائمة عمودية على الأجهزة الصغيرة، تتحول إلى أفقية على الأجهزة الكبيرة باستخدام flex */}
            <li>
              <p>أشراف <br/>
                 مقدم / محمد مجدي حسنين</p> {/* أول عنصر في القائمة يعرض نص (اسم الشخص المشرف) */}
            </li>
            <li>
              Smart ID Face {Data} {/* عرض النص "Smart ID Facr Police Edition" مع السنة الحالية */}
            </li>
            <li>
              <p>برمجة<br/>
             مهندس / عبد الحميد رضا </p> {/* عنصر يعرض اسم الشخص المبرمج */}
            </li>
          </ul>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  