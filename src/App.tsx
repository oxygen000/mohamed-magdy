import { Routes, Route } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { AppProvider } from "./contexts/AppContext";

import theme from "./theme/theme";
import Layout from "./components/Layout";

// Import pages
import Search from "./main/search/search";
import Home from "./main/home/Home";
import Add from "./main/add/add";
import Details from "./main/details/details";
// Comment out missing imports until their components are created
// import Stats from "./main/stats/stats";
// import Profile from "./main/profile/Profile";
// import Login from "./main/auth/Login";

// Create rtl cache for RTL support
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/add" element={<Add />} />
                <Route path="/details/:id" element={<Details />} />
                {/* Comment out routes for missing components */}
                {/* <Route path="/stats" element={<Stats />} /> */}
                {/* <Route path="/profile" element={<Profile />} /> */}
                {/* <Route path="/login" element={<Login />} /> */}
              </Routes>
            </Layout>
            <ToastContainer
              position="bottom-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Slide}
            />
          </AppProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}

export default App;
