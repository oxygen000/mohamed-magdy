import { Link } from "react-router-dom";
import { IoMdCloudUpload } from "react-icons/io";

function Main() {
  return (
    <main
      className="h-dvh flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('./background.png')",
      }}
    >
      <div className=" gap-9 flex flex-row ">
        <Link
          to={"/add"}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          اضف بيانات
          <IoMdCloudUpload className="text-lg "/>
        </Link>
        <Link
          to={"/search"}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          البحث بالصورة
          <IoMdCloudUpload className="text-lg "/>
        </Link>
      </div>
    </main>
  );
}

export default Main;
