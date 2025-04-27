import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/nav";

 function Layout() {

  return (
   <>
    <div className="min-h-screen flex flex-col">
     <Nav/>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer/>
    </div>
   </>
  );
}

export default Layout;
