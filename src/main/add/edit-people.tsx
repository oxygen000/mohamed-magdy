import { Button, TextField } from "@mui/material";
import { FaCloudUploadAlt, FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext, Person } from "../../contexts/AppContext";
import { toast } from "react-toastify";

function EditPeople() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPerson, updatePerson, deletePerson, setIsLoading } =
    useAppContext();

  const [formData, setFormData] = useState<Partial<Person>>({});
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load person data
  useEffect(() => {
    const loadPersonData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const person = getPerson(id);
          if (person) {
            setFormData({
              id: person.id,
              name: person.name,
              fatherName: person.fatherName,
              nationalId: person.nationalId,
              lostLocation: person.lostLocation,
              lostDate: person.lostDate,
              documentNumber: person.documentNumber,
              documentDate: person.documentDate,
              additionalInfo: person.additionalInfo,
            });
            setImage(person.imageUrl);
          } else {
            toast.error("لم يتم العثور على الشخص المطلوب");
            navigate("/search");
          }
        }
      } catch (error) {
        console.error("Error loading person data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonData();
  }, [id, getPerson, navigate, setIsLoading]);

  // Handle image upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsUploading(false);
        setImage(reader.result as string);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof Person, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.name || !formData.nationalId || !formData.lostLocation) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    try {
      setIsLoading(true);

      // Create updated person object
      const updatedPerson: any = {
        id: formData.id || "",
        name: formData.name || "",
        fatherName: formData.fatherName || "",
        nationalId: formData.nationalId || "",
        lostLocation: formData.lostLocation || "",
        lostDate: formData.lostDate || new Date().toISOString().split("T")[0],
        documentNumber: formData.documentNumber,
        documentDate: formData.documentDate,
        imageUrl: formData.imageUrl || image || "",
        registrationDate:
          formData.registrationDate || new Date().toISOString().split("T")[0],
        additionalInfo: formData.additionalInfo || {},
        gender: formData.gender || "male",
        age: formData.age || 0,
        lastSeenDate:
          formData.lastSeenDate ||
          formData.lostDate ||
          new Date().toISOString().split("T")[0],
        status: formData.status || "missing",
        phoneNumber: formData.additionalInfo?.phoneNumber || "",
        reporterId: formData.reporterId || "anonymous",
      };

      // Update person in context
      updatePerson(updatedPerson);

      toast.success("تم تحديث البيانات بنجاح");

      // Navigate back to details page
      setTimeout(() => {
        navigate(`/details/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Error updating person:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      toast.warning("اضغط على زر الحذف مرة أخرى للتأكيد");
      return;
    }

    try {
      setIsLoading(true);

      if (id) {
        // Delete person from context
        deletePerson(id);

        toast.success("تم حذف البيانات بنجاح");

        // Navigate back to search page
        setTimeout(() => {
          navigate("/search");
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting person:", error);
      toast.error("حدث خطأ أثناء حذف البيانات");
    } finally {
      setIsLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <section className="fade-in">
      {/* Navigation */}
      <nav className="flex flex-row items-center justify-between p-6 gap-6 mt-10">
        <Link
          to={`/details/${id}`}
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-blue-700 text-white font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaArrowLeft />
          العودة
        </Link>

        <div className="flex gap-3">
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            startIcon={<FaTrash />}
            className={`${confirmDelete ? "animate-pulse" : ""}`}
          >
            {confirmDelete ? "تأكيد الحذف" : "حذف"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            startIcon={<FaSave />}
          >
            حفظ التغييرات
          </Button>
        </div>
      </nav>

      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-2xl font-bold text-blue-900">تعديل بيانات شخص</h1>
      </div>

      {/* Form */}
      <main className="flex justify-center mt-10 px-4" dir="rtl">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* Person Name Field */}
            <TextField
              label="اسم الشخص"
              variant="outlined"
              fullWidth
              required
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            {/* Father Name Field */}
            <TextField
              label="اسم الوالد"
              variant="outlined"
              fullWidth
              required
              value={formData.fatherName || ""}
              onChange={(e) => handleInputChange("fatherName", e.target.value)}
            />

            {/* National ID Field */}
            <TextField
              label="الرقم القومي"
              variant="outlined"
              fullWidth
              required
              value={formData.nationalId || ""}
              onChange={(e) => handleInputChange("nationalId", e.target.value)}
            />

            {/* Lost Location Field */}
            <TextField
              label="مكان الفقدان"
              variant="outlined"
              fullWidth
              required
              value={formData.lostLocation || ""}
              onChange={(e) =>
                handleInputChange("lostLocation", e.target.value)
              }
            />

            {/* Lost Date Field */}
            <TextField
              label="تاريخ الفقدان"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.lostDate || ""}
              onChange={(e) => handleInputChange("lostDate", e.target.value)}
            />

            {/* Document Number Field */}
            <TextField
              label="رقم الوثيقة"
              variant="outlined"
              fullWidth
              value={formData.documentNumber || ""}
              onChange={(e) =>
                handleInputChange("documentNumber", e.target.value)
              }
            />

            {/* Document Date Field */}
            <TextField
              label="تاريخ الوثيقة"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.documentDate || ""}
              onChange={(e) =>
                handleInputChange("documentDate", e.target.value)
              }
            />

            {/* Image Upload */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-semibold text-gray-700">
                صورة الشخص
              </label>
              <div className="relative w-full">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  {image && (
                    <div className="relative">
                      <img
                        src={image}
                        alt={formData.name || "صورة الشخص"}
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                      />
                    </div>
                  )}

                  <div
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 border rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري التحميل...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaCloudUploadAlt className="text-xl text-blue-500" />
                        <span>تغيير الصورة</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              معلومات إضافية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <TextField
                label="رقم الهاتف"
                variant="outlined"
                fullWidth
                value={formData.additionalInfo?.phoneNumber || ""}
                onChange={(e) => {
                  const additionalInfo = { ...(formData.additionalInfo || {}) };
                  additionalInfo.phoneNumber = e.target.value;
                  setFormData((prev) => ({ ...prev, additionalInfo }));
                }}
              />

              {/* Last Seen */}
              <TextField
                label="آخر مشاهدة"
                variant="outlined"
                fullWidth
                value={formData.additionalInfo?.lastSeen || ""}
                onChange={(e) => {
                  const additionalInfo = { ...(formData.additionalInfo || {}) };
                  additionalInfo.lastSeen = e.target.value;
                  setFormData((prev) => ({ ...prev, additionalInfo }));
                }}
              />

              {/* Clothing Description */}
              <TextField
                label="وصف الملابس"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.additionalInfo?.clothingDescription || ""}
                onChange={(e) => {
                  const additionalInfo = { ...(formData.additionalInfo || {}) };
                  additionalInfo.clothingDescription = e.target.value;
                  setFormData((prev) => ({ ...prev, additionalInfo }));
                }}
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Submit Button for Mobile */}
          <div className="flex justify-center mt-8 md:hidden">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              startIcon={<FaSave />}
              fullWidth
            >
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </main>
    </section>
  );
}

export default EditPeople;
