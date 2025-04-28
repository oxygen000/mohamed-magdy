import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";
import { useAppContext, Person } from "../../contexts/AppContext";

function Details() {
  const { id } = useParams<{ id: string }>();
  const {
    getPerson,
    isLoading: contextLoading,
    setIsLoading,
  } = useAppContext();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        setIsLoading(true);

        // In a real application, this would be an API call
        // For now, we'll simulate a network request
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Get person data from context
        if (id) {
          const personData = getPerson(id);

          if (personData) {
            setPerson(personData);
          } else {
            setError("معرف الشخص غير موجود");
            toast.error("معرف الشخص غير موجود");
          }
        } else {
          setError("معرف الشخص غير موجود");
          toast.error("معرف الشخص غير موجود");
        }
      } catch (err) {
        console.error("Error fetching person details:", err);
        setError("حدث خطأ أثناء جلب بيانات الشخص");
        toast.error("حدث خطأ أثناء جلب بيانات الشخص");
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id, getPerson, setIsLoading]);

  const handleEdit = () => {
    // Navigate to edit page - in a real app, this would go to an edit form
    toast.info("سيتم توجيهك إلى صفحة تعديل البيانات");
    // Navigate to edit page after a short delay to show the toast
    setTimeout(() => {
      navigate(`/add/edit-people/${id}`);
    }, 1000);
  };

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ</h2>
          <p className="text-gray-700 mb-6">
            {error || "لا يمكن العثور على بيانات الشخص المطلوب"}
          </p>
          <Link
            to="/search"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            العودة إلى صفحة البحث
          </Link>
        </div>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      {/* Navigation */}
      <nav className="container mx-auto px-4 mb-8 flex justify-between items-center">
        <Link
          to="/search"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white font-medium shadow-md hover:bg-blue-800 transition-colors"
        >
          <IoIosArrowBack />
          العودة للبحث
        </Link>

        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition-colors"
        >
          <FaEdit />
          تعديل البيانات
        </button>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header section with image and name */}
          <div className="bg-blue-700 text-white p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-3xl font-bold">{person.name}</h1>
              <p className="mt-2 text-blue-100">
                تم التسجيل في: {formatDate(person.registrationDate)}
              </p>
            </div>
          </div>

          {/* Personal information section */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              البيانات الشخصية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <FaUser className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">اسم الوالد</p>
                  <p className="font-medium text-gray-800">
                    {person.fatherName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <FaIdCard className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">الرقم القومي</p>
                  <p className="font-medium text-gray-800">
                    {person.nationalId}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">مكان الفقدان</p>
                  <p className="font-medium text-gray-800">
                    {person.lostLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <FaCalendarAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">تاريخ الفقدان</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(person.lostDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Document information section */}
          {(person.documentNumber || person.documentDate) && (
            <div className="p-6 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                معلومات الوثائق
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {person.documentNumber && (
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                      <FaFileAlt className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">رقم الوثيقة</p>
                      <p className="font-medium text-gray-800">
                        {person.documentNumber}
                      </p>
                    </div>
                  </div>
                )}

                {person.documentDate && (
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                      <FaCalendarAlt className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تاريخ الوثيقة</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(person.documentDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional information section */}
          {person.additionalInfo &&
            Object.keys(person.additionalInfo).length > 0 && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  معلومات إضافية
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(person.additionalInfo).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                        <span className="block w-5 h-5 text-center font-bold">
                          {key.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {key === "phoneNumber"
                            ? "رقم الهاتف"
                            : key === "lastSeen"
                            ? "آخر مشاهدة"
                            : key === "clothingDescription"
                            ? "وصف الملابس"
                            : key}
                        </p>
                        <p className="font-medium text-gray-800">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}

export default Details;
