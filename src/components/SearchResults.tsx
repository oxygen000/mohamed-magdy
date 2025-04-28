import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button,
  Badge,
  Alert,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import ProfileGrid from "./ProfileGrid";
import { FiFilter, FiRefreshCw, FiDownload } from "react-icons/fi";

// Define the search result interface
interface SearchResult {
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

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error?: string;
  query?: string;
  onExport?: () => void;
  onRefresh?: () => void;
  onFilter?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  query,
  onExport,
  onRefresh,
  onFilter,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

  // Filter results based on active tab
  useEffect(() => {
    if (results.length === 0) {
      setFilteredResults([]);
      return;
    }

    if (activeTab === 0) {
      // All results
      setFilteredResults(results);
    } else if (activeTab === 1) {
      // High confidence results (above 70%)
      setFilteredResults(
        results.filter((r) => r.confidence && r.confidence >= 70)
      );
    } else if (activeTab === 2) {
      // Medium confidence results (40-70%)
      setFilteredResults(
        results.filter(
          (r) => r.confidence && r.confidence >= 40 && r.confidence < 70
        )
      );
    } else if (activeTab === 3) {
      // Low confidence results (below 40%)
      setFilteredResults(
        results.filter((r) => r.confidence && r.confidence < 40)
      );
    }
  }, [results, activeTab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Prepare tab labels with counts
  const allCount = results.length;
  const highCount = results.filter(
    (r) => r.confidence && r.confidence >= 70
  ).length;
  const mediumCount = results.filter(
    (r) => r.confidence && r.confidence >= 40 && r.confidence < 70
  ).length;
  const lowCount = results.filter(
    (r) => r.confidence && r.confidence < 40
  ).length;

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            py: 8,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            جاري البحث...
          </Typography>
          {query && (
            <Typography variant="body2" color="text.secondary">
              البحث عن: {query}
            </Typography>
          )}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert
          severity="error"
          sx={{ mt: 4 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={onRefresh}
              startIcon={<FiRefreshCw />}
            >
              إعادة المحاولة
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        {/* Search information */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              نتائج البحث
            </Typography>
            {query && (
              <Typography variant="body2" color="text.secondary">
                البحث عن: {query}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {onFilter && (
              <Button
                variant="outlined"
                startIcon={<FiFilter />}
                onClick={onFilter}
                size="small"
              >
                تصفية
              </Button>
            )}

            {onRefresh && (
              <IconButton onClick={onRefresh} color="primary" size="small">
                <FiRefreshCw />
              </IconButton>
            )}

            {onExport && results.length > 0 && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FiDownload />}
                onClick={onExport}
                size="small"
              >
                تصدير
              </Button>
            )}
          </Box>
        </Box>

        {/* Results tabs */}
        <Paper variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 0 }}
          >
            <Tab
              label={
                <Badge color="default" badgeContent={allCount} max={999}>
                  <Typography sx={{ px: 1 }}>الكل</Typography>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge color="success" badgeContent={highCount} max={999}>
                  <Typography sx={{ px: 1 }}>ثقة عالية</Typography>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge color="warning" badgeContent={mediumCount} max={999}>
                  <Typography sx={{ px: 1 }}>ثقة متوسطة</Typography>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge color="error" badgeContent={lowCount} max={999}>
                  <Typography sx={{ px: 1 }}>ثقة منخفضة</Typography>
                </Badge>
              }
            />
          </Tabs>
          <Divider />

          {/* Results count */}
          <Box sx={{ p: 2, bgcolor: "background.default" }}>
            <Typography variant="body2" color="text.secondary">
              {filteredResults.length === 0
                ? "لا توجد نتائج"
                : filteredResults.length === 1
                ? "نتيجة واحدة"
                : `${filteredResults.length} نتيجة`}
            </Typography>
          </Box>
        </Paper>

        {/* Results grid */}
        <ProfileGrid
          profiles={filteredResults}
          loading={loading}
          itemsPerPage={12}
          showPagination={true}
        />
      </Container>
    </motion.div>
  );
};

export default SearchResults;
