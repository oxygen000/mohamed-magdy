import { useState } from "react"; // استيراد useState لإدارة الحالة في React
import { FaCloudUploadAlt } from "react-icons/fa"; // استيراد أيقونة رفع من مكتبة react-icons

interface UpImageProps {
  label?: string; // النص الذي سيظهر بجانب حقل الرفع (اختياري)
  onImageUpload?: (image: string) => void; // دالة سيتم استدعاؤها عند رفع الصورة
}

function UpImage({ label = "رفع صورة", onImageUpload }: UpImageProps) {
  const [image, setImage] = useState<string | null>(null); // حالة لتخزين الصورة
  const [isUploading, setIsUploading] = useState(false); // حالة لمعرفة إذا كان يتم تحميل صورة أم لا

  // دالة لمعالجة رفع الصورة
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true); // بدأ التحميل
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsUploading(false); // انتهى التحميل
        setImage(reader.result as string); // تخزين الصورة
        if (onImageUpload) {
          onImageUpload(reader.result as string); // استدعاء الدالة المرسلة إذا كانت موجودة
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center gap-4">
        {/* حقل رفع الصورة */}
        <div className="flex flex-col items-start gap-2">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          
          {/* حقل إدخال الملف مع التأثيرات */}
          <div className="relative w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer" // تأكد من أن input قابل للنقر
              id="file-upload"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-100 border rounded-md cursor-pointer hover:bg-gray-200">
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> {/* عرض أيقونة تحميل أثناء الرفع */}
                  <span>جاري التحميل...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaCloudUploadAlt className="text-xl text-blue-500" />
                  <span>اضغط لرفع صورة</span>
                </div>
              )}
            </div>
          </div>
          
          {/* عرض معاينة الصورة بعد رفعها */}
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
      </div>
    </section>
  );
}

export default UpImage;
