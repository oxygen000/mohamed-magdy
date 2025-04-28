import React, { useState } from "react";
import {
  Box,
  Typography,
  Pagination,
  Container,
  useMediaQuery,
  useTheme,
  Skeleton,
} from "@mui/material";
import ProfileCard from "./ProfileCard";
import { motion } from "framer-motion";

// Define the type for the person profiles
interface Person {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  location?: string;
  imageUrl: string;
  confidence?: number;
  lastSeen?: string;
  isMissing?: boolean;
  comparisonData?: {
    similarityScore: number;
    matchedFeatures: number;
    totalFeatures: number;
  };
}

interface ProfileGridProps {
  title?: string;
  description?: string;
  profiles: Person[];
  loading?: boolean;
  itemsPerPage?: number;
  showPagination?: boolean;
  onPersonClick?: (person: Person) => void;
  onViewDetails?: (person: Person) => void;
  onExport?: (person: Person) => void;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ProfileGrid: React.FC<ProfileGridProps> = ({
  title,
  description,
  profiles,
  loading = false,
  itemsPerPage = 12,
  showPagination = true,
  onPersonClick,
  onViewDetails,
  onExport,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(1);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate total pages
  const totalPages = Math.ceil(profiles.length / itemsPerPage);

  // Get current page profiles
  const currentProfiles = profiles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {title && (
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 1,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: "800px",
            mx: "auto",
            textAlign: "center",
          }}
        >
          {description}
        </Typography>
      )}

      <motion.div variants={container} initial="hidden" animate="visible">
        <Box sx={{ display: "flex", flexWrap: "wrap", mx: -1.5 }}>
          {loading ? (
            // Show loading skeletons
            Array.from(new Array(itemsPerPage)).map((_, index) => (
              <Box
                key={`skeleton-${index}`}
                sx={{
                  flexBasis: {
                    xs: "100%",
                    sm: "50%",
                    md: "33.333%",
                    lg: "25%",
                  },
                  width: "100%",
                  px: 1.5,
                  mb: 3,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  height={400}
                  sx={{
                    borderRadius: "16px",
                    transformOrigin: "0 0",
                    transform: "scale(1, 1)",
                  }}
                />
              </Box>
            ))
          ) : currentProfiles.length > 0 ? (
            // Show profiles
            currentProfiles.map((profile) => (
              <Box
                key={profile.id}
                sx={{
                  flexBasis: {
                    xs: "100%",
                    sm: "50%",
                    md: "33.333%",
                    lg: "25%",
                  },
                  width: "100%",
                  px: 1.5,
                  mb: 3,
                }}
              >
                <ProfileCard
                  name={profile.name}
                  age={profile.age}
                  gender={profile.gender}
                  location={profile.location}
                  imageUrl={profile.imageUrl}
                  confidence={profile.confidence}
                  lastSeen={profile.lastSeen}
                  isMissing={profile.isMissing}
                  onClick={() => onPersonClick?.(profile)}
                  onViewDetails={() => onViewDetails?.(profile)}
                  onExport={() => onExport?.(profile)}
                />
              </Box>
            ))
          ) : (
            // Show no results
            <Box sx={{ width: "100%", px: 1.5 }}>
              <Box
                sx={{
                  py: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  لا توجد نتائج
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  لم يتم العثور على نتائج مطابقة للبحث
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </motion.div>

      {showPagination && totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            size={isMobile ? "small" : "medium"}
            color="primary"
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
          />
        </Box>
      )}
    </Container>
  );
};

export default ProfileGrid;
