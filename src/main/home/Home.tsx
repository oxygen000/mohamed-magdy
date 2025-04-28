import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Button,
  useTheme,
  Box,
  CardContent,
} from "@mui/material";
import {
  FaSearch,
  FaPlus,
  FaChartBar,
  FaHandHoldingHeart,
} from "react-icons/fa";
import AnimatedCard from "../../components/AnimatedCard";
import AOS from "aos";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const slideUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Feature data
const features = [
  {
    title: "البحث عن المفقودين",
    description:
      "استخدم صورة للبحث عن الأشخاص المفقودين في قاعدة البيانات باستخدام تقنية التعرف على الوجوه.",
    icon: <FaSearch size={30} />,
    color: "#4361ee",
    link: "/search",
  },
  {
    title: "تسجيل شخص مفقود",
    description:
      "سجل حالات الفقدان الجديدة من خلال إضافة المعلومات الشخصية والصور.",
    icon: <FaPlus size={30} />,
    color: "#f72585",
    link: "/add",
  },
  {
    title: "إحصائيات وتقارير",
    description:
      "اطلع على أحدث الإحصائيات والتقارير حول حالات الفقدان والعثور.",
    icon: <FaChartBar size={30} />,
    color: "#4cc9f0",
    link: "/stats",
  },
];

// Stats data
const stats = [
  { value: 1250, label: "حالة مفقودين مسجلة" },
  { value: 830, label: "حالات تم العثور عليها" },
  { value: 92, label: "متطوع في فرق البحث" },
  { value: 18, label: "مركز بحث في المحافظات" },
];

const Home: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "80vh", md: "70vh" },
          width: "100%",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/back.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          color: "white",
          mb: 8,
        }}
      >
        <Container>
          <Box sx={{ display: "flex", flexWrap: "wrap", mx: -1.5 }}>
            <Box
              sx={{
                width: "100%",
                px: 1.5,
                mb: { xs: 4, md: 0 },
                flexBasis: { xs: "100%", md: "58.333%" },
              }}
            >
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: "linear-gradient(90deg, #fff, #4cc9f0)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  نظام البحث المتكامل عن المفقودين
                </Typography>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={slideUp}>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, color: "rgba(255,255,255,0.9)" }}
                >
                  استخدم تقنية الذكاء الاصطناعي والتعرف على الوجوه للمساعدة في
                  العثور على الأشخاص المفقودين وتوحيد شمل العائلات
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/search"
                    startIcon={<FaSearch />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontWeight: 600,
                      borderRadius: 2,
                      fontSize: "1rem",
                    }}
                  >
                    ابدأ البحث الآن
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    component={Link}
                    to="/add"
                    startIcon={<FaPlus />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontWeight: 600,
                      borderRadius: 2,
                      borderWidth: 2,
                      fontSize: "1rem",
                    }}
                  >
                    تسجيل حالة
                  </Button>
                </Box>
              </motion.div>
            </Box>

            <Box
              sx={{
                flexBasis: { xs: "100%", md: "41.667%" },
                width: "100%",
                px: 1.5,
                display: { xs: "none", md: "block" },
              }}
            >
              
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box
          sx={{
            py: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgba(67, 97, 238, 0.05), rgba(76, 201, 240, 0.05))",
          }}
          data-aos="fade-up"
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              mx: -1,
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  flexBasis: { xs: "50%", md: "25%" },
                  width: "100%",
                  px: 1,
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                  }}
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      background: "linear-gradient(135deg, #4361ee, #4cc9f0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}+
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Container sx={{ mb: 10 }}>
        <Box sx={{ mb: 6, textAlign: "center" }} data-aos="fade-up">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: "linear-gradient(90deg, #4361ee, #4cc9f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            خدماتنا المميزة
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            نوفر مجموعة من الخدمات المتكاملة للمساعدة في البحث عن المفقودين
            وتوثيق حالات الفقدان وتعزيز فرص العثور عليهم
          </Typography>
        </Box>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              mx: -1.5,
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  flexBasis: { xs: "100%", md: "33.333%" },
                  width: "100%",
                  px: 1.5,
                  mb: 3,
                }}
              >
                <AnimatedCard
                  animation="slideUp"
                  delay={index * 0.2}
                  hover
                  sx={{ height: "100%" }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                        color: "white",
                        background: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {feature.description}
                    </Typography>
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        variant="outlined"
                        component={Link}
                        to={feature.link}
                        sx={{
                          mt: 2,
                          borderColor: feature.color,
                          color: feature.color,
                          "&:hover": {
                            borderColor: feature.color,
                            backgroundColor: `${feature.color}10`,
                          },
                        }}
                      >
                        استكشف الخدمة
                      </Button>
                    </Box>
                  </CardContent>
                </AnimatedCard>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #4361ee, #3f37c9)",
          color: "white",
          textAlign: "center",
          mb: 10,
        }}
        data-aos="fade-up"
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <FaHandHoldingHeart size={50} />
          </Box>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            هل تعرف شخصاً مفقوداً؟
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, fontWeight: 400 }}>
            ساعدنا في جمع شمل العائلات من خلال الإبلاغ عن حالات الفقدان أو
            المساهمة في عمليات البحث
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              component={Link}
              to="/add"
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 600,
                borderRadius: 2,
                fontSize: "1rem",
                backgroundColor: "white",
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              }}
            >
              سجل حالة مفقود
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={Link}
              to="/search"
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 600,
                borderRadius: 2,
                borderWidth: 2,
                fontSize: "1rem",
              }}
            >
              البحث في قاعدة البيانات
            </Button>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container sx={{ mb: 10 }}>
        <Box sx={{ mb: 6, textAlign: "center" }} data-aos="fade-up">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 700,
            }}
          >
            كيف يعمل النظام؟
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            نظامنا يستخدم تقنيات متقدمة للتعرف على الوجوه للمساعدة في العثور على
            المفقودين بسرعة وكفاءة عالية
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            mx: -2,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[
            {
              title: "تحميل الصورة",
              description:
                "قم بتحميل صورة واضحة للشخص المفقود تظهر ملامح الوجه بشكل جيد.",
              number: "01",
            },
            {
              title: "تحليل الصورة",
              description:
                "يقوم النظام بتحليل الصورة واستخراج المميزات الخاصة بالوجه للمقارنة.",
              number: "02",
            },
            {
              title: "البحث في قاعدة البيانات",
              description:
                "مقارنة مميزات الوجه مع الصور المخزنة في قاعدة البيانات وتحديد التطابقات المحتملة.",
              number: "03",
            },
            {
              title: "عرض النتائج",
              description:
                "عرض الأشخاص المطابقين مرتبين حسب نسبة التطابق مع إمكانية الوصول إلى بياناتهم التفصيلية.",
              number: "04",
            },
          ].map((step, index) => (
            <Box
              key={index}
              sx={{
                flexBasis: { xs: "100%", sm: "50%", md: "25%" },
                width: "100%",
                px: 2,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  position: "relative",
                  p: 3,
                  borderRadius: 3,
                  background: "white",
                  boxShadow:
                    index % 2 === 0
                      ? "0 5px 20px rgba(67, 97, 238, 0.1)"
                      : "0 5px 20px rgba(76, 201, 240, 0.1)",
                }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Typography
                  variant="h2"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    opacity: 0.1,
                    fontWeight: 900,
                    fontSize: "4rem",
                  }}
                >
                  {step.number}
                </Typography>
                <Box sx={{ position: "relative", pt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
