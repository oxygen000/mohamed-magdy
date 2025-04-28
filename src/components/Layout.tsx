import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Container, useTheme } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import Nav from "./Nav/nav";
import Footer from "./Footer/Footer";
// Define animation variants for components
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      <Container>
        <Nav />
      </Container>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          pt: { xs: 8, sm: 9 },
          bgcolor: theme.palette.background.default,
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          style={{ height: "100%" }}
        >
          {children}
        </motion.div>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Footer />
        </Container>
      </Box>
    </>
  );
};

export default Layout;
