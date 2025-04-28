import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5"; // أيقونات العين
import { useAppContext } from "../../contexts/AppContext";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [isEyeOff, setIsEyeOff] = useState(true);
  
  const { login, isLoading } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/home");
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  const handleEyeClick = () => {
    setIsEyeOff(!isEyeOff);
  };

  return (
    <>
      <section
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1470&q=80')`,
        }}
      >
        {/* Progress Bar */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full">
            <div className="h-1 bg-blue-500 animate-pulse"></div>
          </div>
        )}

        <div className="bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <div className="relative">
              <input
                type={isEyeOff ? "password" : "text"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={handleEyeClick}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isEyeOff ? <IoEyeOff size={24} /> : <IoEye size={24} />}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-600 mb-2">
              استخدم اسم المستخدم: admin وكلمة المرور: admin
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex justify-center items-center gap-2 ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold py-3 rounded-lg transition-all duration-300`}
            >
              {isLoading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isLoading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login;
