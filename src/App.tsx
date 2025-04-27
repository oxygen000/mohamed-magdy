import { Routes, Route } from "react-router-dom";
import Layout from "./main/layout";
import Main from "./main/main";
import Add from "./main/add/add";
import Search from "./main/search/search";
import AddChild from "./main/add/add-child";
import AddPeople from "./main/add/add-people";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // يجب استيراد الـ CSS الخاص بالمكتبة


function App() {

  return (
    <>
 <Routes>
    <Route path="/" element={<Layout />}>
    <Route index element={<Main />} />
    <Route path="/add" element={< Add />} />
    <Route path="/add/add-child" element={< AddChild />} />
    <Route path="/add/add-people" element={< AddPeople />} />
    <Route path="/search" element={< Search />} />
  </Route>
  </Routes>
  <ToastContainer />

    </>
  )
}

export default App
