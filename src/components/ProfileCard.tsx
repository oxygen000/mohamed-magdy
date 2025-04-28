import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  styled,
  Button,
  CardActionArea,
  CardActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FiExternalLink, FiDownload } from "react-icons/fi";

// Define the type for the ProfileCard props
interface ProfileCardProps {
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
  onClick?: () => void;
  onViewDetails?: () => void;
  onExport?: () => void;
}

const ConfidenceBar = styled(LinearProgress)(({ theme, value = 0 }) => ({
  height: 8,
  borderRadius: 5,
  ".MuiLinearProgress-bar": {
    backgroundColor:
      value < 40
        ? theme.palette.error.main
        : value < 70
        ? theme.palette.warning.main
        : theme.palette.success.main,
  },
}));

const ProfileImage = styled("img")({
  width: "100%",
  height: 200,
  objectFit: "cover",
  objectPosition: "center 15%",
});

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
  gender,
  location,
  imageUrl,
  confidence,
  lastSeen,
  isMissing = true,
  comparisonData,
  onClick,
  onViewDetails,
  onExport,
}) => {
  // Get confidence color based on value
  const getConfidenceColor = (value?: number) => {
    if (!value) return "default";
    if (value < 40) return "error";
    if (value < 70) return "warning";
    return "success";
  };

  // Format confidence display
  const confidenceDisplay =
    confidence !== undefined ? `${Math.round(confidence)}%` : "غير محدد";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card
        elevation={2}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {isMissing && (
          <Chip
            label="مفقود"
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
              fontWeight: "bold",
              px: 1,
            }}
          />
        )}

        <CardActionArea onClick={onClick} sx={{ flexGrow: 1 }}>
          <ProfileImage src={imageUrl} alt={name} />

          {confidence !== undefined && (
            <Box sx={{ px: 2, mt: -1, position: "relative", zIndex: 1 }}>
              <ConfidenceBar variant="determinate" value={confidence} />
            </Box>
          )}

          <CardContent sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Typography variant="h6" component="h3" noWrap title={name}>
                {name}
              </Typography>

              {confidence !== undefined && (
                <Chip
                  label={confidenceDisplay}
                  color={getConfidenceColor(confidence)}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {age && (
                <Typography variant="body2" color="text.secondary">
                  العمر: {age} سنة
                </Typography>
              )}

              {gender && (
                <Typography variant="body2" color="text.secondary">
                  الجنس:{" "}
                  {gender === "male"
                    ? "ذكر"
                    : gender === "female"
                    ? "أنثى"
                    : gender}
                </Typography>
              )}

              {location && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  الموقع: {location}
                </Typography>
              )}

              {lastSeen && (
                <Typography variant="body2" color="text.secondary">
                  آخر ظهور: {lastSeen}
                </Typography>
              )}

              {comparisonData && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    المطابقة: {comparisonData.matchedFeatures}/
                    {comparisonData.totalFeatures} سمة
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    التشابه: {Math.round(comparisonData.similarityScore * 100)}%
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </CardActionArea>

        <CardActions>
          {onViewDetails && (
            <Button
              size="small"
              startIcon={<FiExternalLink />}
              onClick={onViewDetails}
              fullWidth
            >
              التفاصيل
            </Button>
          )}

          {onExport && (
            <Tooltip title="تصدير البيانات">
              <IconButton size="small" onClick={onExport}>
                <FiDownload />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
