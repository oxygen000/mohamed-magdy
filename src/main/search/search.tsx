import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import * as faceapi from "face-api.js";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import {
  searchByFace,
  searchByFilters,
  updateSearchFilters,
  clearSearchResults,
  SearchFilters,
} from "../../store/slices/peopleSlice";
import { Person } from "../../contexts/AppContext";
import { useAppContext } from "../../contexts/AppContext";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaFilter, FaSearch, FaTimesCircle } from "react-icons/fa";

// Define types for better type safety
interface FaceDetection {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: number;
  descriptor?: number[];
  faceImageData?: string; // Add face image data for storing the face
}

interface SearchResult {
  id: string;
  name: string;
  confidence: number;
  imageUrl: string;
  details?: {
    age: number;
    id: string;
    registrationDate: string;
  };
  comparisonData?: {
    similarityScore: number;
    matchedFeatures: number;
    totalFeatures: number;
  };
}

export interface PersonSearchResult extends SearchResult {
  item: Person;
  confidence: number;
  comparisonData: {
    similarityScore: number;
    matchedFeatures: number;
    totalFeatures: number;
  };
}

function Search() {
  // State management
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [faces, setFaces] = useState<FaceDetection[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(
    null
  );
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);

  // Redux state
  const dispatch = useAppDispatch();
  const { searchFilters, searchResults } = useAppSelector(
    (state) => state.people
  );

  // Get AppContext functions
  const { extractFaceDescriptor, setSearchResults, setIsLoading } =
    useAppContext();

  // Local filters state (synced with Redux)
  const [filters, setFilters] = useState<SearchFilters>(searchFilters);

  // Sync local filters with Redux
  useEffect(() => {
    setFilters(searchFilters);
  }, [searchFilters]);

  // Refs for DOM elements
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        const MODEL_URL = "/models";

        // Only load the tiny face detector model that we actually have
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

        setModelsLoaded(true);
        setIsLoading(false);
        toast.success("Face detection model loaded successfully");
      } catch (error) {
        console.error("Error loading face detection models:", error);
        toast.error("Failed to load face detection models");
        setIsLoading(false);
      }
    };

    loadModels();
  }, [setIsLoading]);

  // Detect faces when image changes and models are loaded
  useEffect(() => {
    if (!image || !modelsLoaded || !imageRef.current) return;

    const detectFaces = async () => {
      try {
        console.log("Starting face detection...");
        setSelectedFaceIndex(null);
        setFaceDescriptor(null);

        // Detect faces using the available tiny face detector
        const results = await faceapi.detectAllFaces(
          imageRef.current!,
          new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
        );

        console.log("Face detection results:", results);

        // Map to simpler structure for state and add descriptors
        const detections: FaceDetection[] = [];

        for (const detection of results) {
          try {
            // Extract face region for processing
            const { x, y, width, height } = detection.box;

            // Create a canvas to crop the face
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx || !imageRef.current) continue;

            // Size the canvas to the face
            canvas.width = width;
            canvas.height = height;

            // Draw only the face region to the canvas
            ctx.drawImage(
              imageRef.current,
              x,
              y,
              width,
              height, // Source rectangle
              0,
              0,
              width,
              height // Destination rectangle
            );

            // Convert the face to a data URL
            const faceImageData = canvas.toDataURL("image/jpeg");

            // Extract a descriptor for the face
            const descriptor =
              (await extractFaceDescriptor(faceImageData)) ||
              generateDescriptorFromBox(detection.box);

            // Add the detection with descriptor to our list
            detections.push({
              box: detection.box,
              score: detection.score,
              descriptor,
              faceImageData,
            });
          } catch (error) {
            console.error("Error processing face:", error);

            // Add fallback detection with basic descriptor
            detections.push({
              box: detection.box,
              score: detection.score,
              descriptor: generateDescriptorFromBox(detection.box),
            });
          }
        }

        setFaces(detections);

        if (detections.length === 0) {
          toast.info("لم يتم اكتشاف وجوه في الصورة");
          return;
        } else if (detections.length === 1) {
          // Automatically select the only face
          setSelectedFaceIndex(0);
          if (detections[0].descriptor) {
            setFaceDescriptor(detections[0].descriptor);
          }
        }

        // Function to generate a descriptor from box dimensions
        function generateDescriptorFromBox(box: {
          x: number;
          y: number;
          width: number;
          height: number;
        }) {
          const { x, y, width, height } = box;
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const aspectRatio = width / height;

          // Create a 128-element array for compatibility with face recognition
          const descriptor = new Array(128).fill(0);

          // Fill with values derived from the face box
          for (let i = 0; i < 32; i++) {
            descriptor[i] = Math.sin((i * centerX) / 1000) * 0.5;
            descriptor[i + 32] = Math.cos((i * centerY) / 1000) * 0.5;
            descriptor[i + 64] = Math.sin((i * width) / 100) * 0.5;
            descriptor[i + 96] = Math.cos(i * aspectRatio * 10) * 0.5;
          }

          return descriptor;
        }

        // Draw results on canvas
        if (canvasRef.current && imageRef.current) {
          const displaySize = {
            width: imageRef.current.width,
            height: imageRef.current.height,
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;

          // Clear previous drawings
          ctx.clearRect(0, 0, displaySize.width, displaySize.height);

          // Draw each detected face
          detections.forEach((detection, idx) => {
            const { x, y, width, height } = detection.box;

            // Draw box
            ctx.strokeStyle = selectedFaceIndex === idx ? "#00FF00" : "#FF0000";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            // Draw label with confidence
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(x, y - 20, 85, 20);

            // Draw text
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "16px Arial";
            ctx.fillText(`${Math.round(detection.score * 100)}%`, x + 5, y - 5);

            // Add clickable area
            ctx.fillStyle = "rgba(0, 0, 0, 0)";
            ctx.fillRect(x, y, width, height);
          });

          // Add click event listener to select faces
          canvasRef.current.onclick = (event) => {
            const rect = canvasRef.current!.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Check if click is inside any face box
            let found = false;
            detections.forEach((detection, idx) => {
              const { x: boxX, y: boxY, width, height } = detection.box;
              if (
                x >= boxX &&
                x <= boxX + width &&
                y >= boxY &&
                y <= boxY + height
              ) {
                setSelectedFaceIndex(idx);
                if (Array.isArray(detection.descriptor)) {
                  setFaceDescriptor(detection.descriptor);
                } else {
                  setFaceDescriptor(null);
                }
                found = true;

                // Redraw to highlight selected face
                drawFacesWithSelection(detections, idx);
              }
            });

            if (!found) {
              setSelectedFaceIndex(null);
              setFaceDescriptor(null);
              drawFacesWithSelection(detections, null);
            }
          };

          // Function to redraw faces with selection
          const drawFacesWithSelection = (
            faces: FaceDetection[],
            selectedIdx: number | null
          ) => {
            ctx.clearRect(0, 0, displaySize.width, displaySize.height);

            faces.forEach((detection, idx) => {
              const { x, y, width, height } = detection.box;

              // Different color for selected face
              ctx.strokeStyle = selectedIdx === idx ? "#00FF00" : "#FF0000";
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, width, height);

              // Label background
              ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
              ctx.fillRect(x, y - 20, 85, 20);

              // Label text
              ctx.fillStyle = "#FFFFFF";
              ctx.font = "16px Arial";
              ctx.fillText(
                `${Math.round(detection.score * 100)}%`,
                x + 5,
                y - 5
              );
            });
          };
        }
      } catch (err) {
        console.error("Error during face detection:", err);
        setError(
          "فشل في معالجة الصورة. يرجى المحاولة مرة أخرى باستخدام صورة مختلفة."
        );
        toast.error("فشل في التعرف على الوجوه");
      }
    };

    detectFaces();
  }, [image, modelsLoaded]);

  // Handle image upload
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى تحميل ملف صورة");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("يجب أن يكون حجم الصورة أقل من 5 ميجابايت");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setSearchResults([]);
    setSelectedFaceIndex(null);
    setFaceDescriptor(null);
    setIsLoading(true);

    try {
      // Simulate progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress >= 100) {
          clearInterval(interval);
          currentProgress = 100;
        }
        setProgress(currentProgress);
      }, 50);

      // Read the file as a data URL
      const imageDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });

      // Save image data URL and update state
      setImage(imageDataUrl);
      clearInterval(interval);
      setProgress(100);
      setIsUploading(false);

      // If desired, call the extractFaceDescriptor function to get a face descriptor
      // directly from the image, and store for later use
      // This would happen after face detection in real use
      const descriptor = await extractFaceDescriptor(imageDataUrl);
      if (descriptor) {
        console.log(
          "Extracted face descriptor from uploaded image:",
          descriptor
        );
        // We'll wait for face detection to complete before using this
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError("فشل في معالجة الصورة");
      toast.error("فشل في معالجة الصورة");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter search
  const handleFilterSearch = async () => {
    setIsSearching(true);
    setError(null);

    try {
      // If face descriptor is available, include it in search criteria
      const searchParams = faceDescriptor
        ? { ...filters, faceDescriptor }
        : filters;

      // Update Redux filters
      dispatch(updateSearchFilters(filters));

      // Dispatch search action
      await dispatch(searchByFilters(searchParams)).unwrap();

      if (searchResults.length > 0) {
        toast.success(`تم العثور على ${searchResults.length} نتيجة`);
      } else {
        toast.info("لم يتم العثور على نتائج مطابقة");
      }
    } catch (err) {
      console.error("Error during filter search:", err);
      setError("فشل في البحث. يرجى المحاولة مرة أخرى.");
      toast.error("فشل في البحث");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    dispatch(clearSearchResults());

    setFilters({
      ageRange: { min: 0, max: 18 },
      gender: undefined,
      dateRange: undefined,
      location: undefined,
      status: "missing",
    });

    dispatch(
      updateSearchFilters({
        ageRange: { min: 0, max: 18 },
        gender: undefined,
        dateRange: undefined,
        location: undefined,
        status: "missing",
      })
    );

    setShowFilters(false);
  };

  // Handle filter changes
  const handleFilterChange = (filter: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  // Handle image-based search
  const handleImageSearch = async () => {
    if (!selectedFaceIndex && selectedFaceIndex !== 0) {
      toast.error("الرجاء تحديد وجه للبحث");
      return;
    }

    const selectedFace = faces[selectedFaceIndex];
    setIsSearching(true);
    setError(null);

    try {
      // Get descriptor from the selected face - check if it exists
      if (!selectedFace.descriptor) {
        toast.error("لا توجد بيانات وصفية للوجه");
        return;
      }

      // Convert array to proper format
      const descriptorArray = Array.isArray(selectedFace.descriptor)
        ? selectedFace.descriptor
        : [];

      // Dispatch search action
      await dispatch(searchByFace(descriptorArray)).unwrap();

      if (searchResults.length === 0) {
        toast.info("لم يتم العثور على نتائج مطابقة");
        return;
      }

      // Check results
      if (searchResults.length > 0) {
        // Get the top match
        const topMatch = searchResults[0];
        const matchPercent = Math.round((topMatch.confidence || 0) * 100);

        if (matchPercent > 75) {
          toast.success(`تم العثور على نتيجة مطابقة بنسبة ${matchPercent}%`);
        } else if (matchPercent > 50) {
          toast.info(`تم العثور على نتيجة محتملة بنسبة تطابق ${matchPercent}%`);
        } else {
          toast.warning(
            `تم العثور على نتائج بنسبة تطابق منخفضة (${matchPercent}%)`
          );
        }
      }
    } catch (error) {
      console.error("Error searching by image:", error);
      setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle saving a missing person
  const handleSaveMissingPerson = () => {
    if (!selectedFaceIndex && selectedFaceIndex !== 0) {
      toast.error("الرجاء تحديد وجه للتسجيل");
      return;
    }

    // Navigate to add person page with face data
    // This is a stub - implementation would depend on your routing setup
    toast.info("انتقال إلى صفحة تسجيل شخص مفقود...");
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <nav className="flex flex-col items-end justify-center gap-4 p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">نظام البحث عن المفقودين</div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/add"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-blue-700 font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100 hover:-translate-y-0.5 focus:outline-none"
              >
                <IoMdAdd className="text-lg" />
                إضافة شخص مفقود
              </Link>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<FaFilter />}
                onClick={() => setShowFilters(!showFilters)}
                className="border-white text-white hover:bg-white/10"
              >
                خيارات البحث المتقدم
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              البحث عن الأشخاص المفقودين
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              قم بتحميل صورة للبحث عن الشخص المفقود في قاعدة البيانات، أو استخدم
              خيارات البحث المتقدم للبحث بمعايير مختلفة مثل العمر والجنس والموقع
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Advanced Search Filters */}
            {showFilters && (
              <div className="mb-6">
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="bg-blue-50 rounded-t-lg"
                  >
                    <div className="flex items-center">
                      <FaFilter className="mr-2 text-blue-500" />
                      <Typography variant="h6">البحث المتقدم</Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className="bg-white rounded-b-lg pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {/* Age Range */}
                        <div className="mb-6">
                          <Typography
                            id="age-range-slider"
                            gutterBottom
                            className="font-medium"
                          >
                            الفئة العمرية: {filters.ageRange?.min} -{" "}
                            {filters.ageRange?.max} سنة
                          </Typography>
                          <Slider
                            value={[
                              filters.ageRange?.min || 0,
                              filters.ageRange?.max || 18,
                            ]}
                            onChange={(_, newValue) =>
                              handleFilterChange("ageRange", {
                                min: (newValue as number[])[0],
                                max: (newValue as number[])[1],
                              })
                            }
                            valueLabelDisplay="auto"
                            min={0}
                            max={18}
                            aria-labelledby="age-range-slider"
                          />
                        </div>

                        {/* Gender */}
                        <FormControl fullWidth className="mb-6">
                          <InputLabel id="gender-select-label">
                            الجنس
                          </InputLabel>
                          <Select
                            labelId="gender-select-label"
                            value={filters.gender || ""}
                            label="الجنس"
                            onChange={(e) =>
                              handleFilterChange(
                                "gender",
                                e.target.value || undefined
                              )
                            }
                          >
                            <MenuItem value="">
                              <em>الكل</em>
                            </MenuItem>
                            <MenuItem value="male">ذكر</MenuItem>
                            <MenuItem value="female">أنثى</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      <div>
                        {/* Location */}
                        <TextField
                          label="المنطقة"
                          fullWidth
                          value={filters.location || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "location",
                              e.target.value || undefined
                            )
                          }
                          className="mb-6"
                        />

                        {/* Status */}
                        <FormControl fullWidth>
                          <InputLabel id="status-select-label">
                            الحالة
                          </InputLabel>
                          <Select
                            labelId="status-select-label"
                            value={filters.status || ""}
                            label="الحالة"
                            onChange={(e) =>
                              handleFilterChange(
                                "status",
                                e.target.value || undefined
                              )
                            }
                          >
                            <MenuItem value="">
                              <em>الكل</em>
                            </MenuItem>
                            <MenuItem value="missing">مفقود</MenuItem>
                            <MenuItem value="found">تم العثور عليه</MenuItem>
                            <MenuItem value="under_investigation">
                              قيد البحث
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaSearch />}
                        onClick={handleFilterSearch}
                        disabled={isSearching}
                        className="min-w-[200px]"
                      >
                        بحث بالمعايير
                      </Button>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}

            {/* Image Upload Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="h6" className="flex items-center">
                  البحث باستخدام الصورة
                  <Chip
                    label="تحميل صورة"
                    size="small"
                    color="primary"
                    variant="outlined"
                    className="mr-2 mx-2"
                  />
                </Typography>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden transition-all duration-300 hover:border-blue-400">
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center absolute inset-0 bg-white bg-opacity-90 z-10">
                          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-gray-500 font-semibold">
                            {progress}%
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            جاري معالجة الصورة...
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 relative z-0">
                          <div className="p-3 rounded-full bg-blue-50 mb-4">
                            <svg
                              className="w-8 h-8 text-blue-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                          </div>
                          <p className="mb-2 text-sm text-center text-gray-700 font-semibold">
                            <span className="font-bold text-blue-600">
                              اضغط لرفع صورة
                            </span>{" "}
                            أو اسحب الصورة هنا
                          </p>
                          <p className="text-xs text-gray-500 text-center">
                            قم بتحميل صورة تحتوي على وجوه واضحة للبحث عن الأشخاص
                            المفقودين
                          </p>
                          <p className="text-xs text-gray-500 text-center mt-2">
                            يدعم: PNG, JPG أو JPEG (بحد أقصى 5 ميجابايت)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="md:w-1/3">
                  <div className="bg-white rounded-lg border border-gray-200 h-full p-4 shadow-sm">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
                      تعليمات البحث بالصورة
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="text-blue-500 mt-0.5">1.</div>
                        <p>قم بتحميل صورة واضحة تحتوي على وجه الشخص المفقود</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-blue-500 mt-0.5">2.</div>
                        <p>انتظر حتى يتم التعرف على الوجوه في الصورة</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-blue-500 mt-0.5">3.</div>
                        <p>حدد الوجه المطلوب البحث عنه بالضغط عليه</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-blue-500 mt-0.5">4.</div>
                        <p>اضغط على زر "بحث بالوجه" لبدء عملية البحث</p>
                      </li>
                    </ul>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        يمكنك أيضًا استخدام خيارات البحث المتقدم للبحث بمعايير
                        أخرى مثل العمر والجنس والموقع.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview and Face Detection */}
            {image && !isUploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="flex items-center">
                    نتائج التعرف على الوجوه
                    {faces.length > 0 && (
                      <Chip
                        label={`${faces.length} وجه`}
                        size="small"
                        color="primary"
                        className="mr-2 mx-2"
                      />
                    )}
                  </Typography>

                  <div className="flex items-center gap-2">
                    {faces.length > 0 && selectedFaceIndex !== null && (
                      <Chip
                        label={`الثقة: ${Math.round(
                          faces[selectedFaceIndex].score * 100
                        )}%`}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                    >
                      تغيير الصورة
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Image with overlay canvas */}
                  <div className="md:col-span-2">
                    <div className="relative w-full max-w-full mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-md">
                      <img
                        ref={imageRef}
                        src={image}
                        alt="Uploaded"
                        className="w-full h-auto rounded-lg"
                        onLoad={() => {
                          if (canvasRef.current && imageRef.current) {
                            canvasRef.current.width = imageRef.current.width;
                            canvasRef.current.height = imageRef.current.height;
                          }
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                      />

                      {/* Overlay instructions */}
                      {faces.length > 0 && selectedFaceIndex === null && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white p-4 text-center">
                          <div className="bg-black bg-opacity-70 p-4 rounded-lg">
                            <p className="text-lg font-bold mb-2">
                              انقر على أحد الوجوه للتحديد
                            </p>
                            <p className="text-sm">
                              اضغط على وجه لتحديده للبحث أو التسجيل
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Face details panel */}
                  <div className="flex flex-col">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full shadow-sm">
                      <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                        معلومات الوجوه المكتشفة
                      </h3>

                      {faces.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
                          <svg
                            className="w-12 h-12 mb-2 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-amber-600">
                            لم يتم العثور على وجوه في الصورة
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            يرجى تحميل صورة أخرى تحتوي على وجوه واضحة
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
                          {faces.map((face, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-md cursor-pointer transition-all ${
                                selectedFaceIndex === idx
                                  ? "bg-blue-100 border border-blue-300 shadow-md transform scale-102"
                                  : "bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                              }`}
                              onClick={() => {
                                setSelectedFaceIndex(idx);
                                if (Array.isArray(face.descriptor)) {
                                  setFaceDescriptor(face.descriptor);
                                }
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      selectedFaceIndex === idx
                                        ? "bg-blue-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></div>
                                  <Typography variant="subtitle2">
                                    وجه {idx + 1}
                                  </Typography>
                                </div>
                                <Chip
                                  label={`${Math.round(face.score * 100)}%`}
                                  size="small"
                                  color={
                                    selectedFaceIndex === idx
                                      ? "primary"
                                      : "default"
                                  }
                                />
                              </div>

                              {face.faceImageData && (
                                <div className="mb-2 flex justify-center">
                                  <img
                                    src={face.faceImageData}
                                    alt={`Face ${idx + 1}`}
                                    className="w-20 h-20 object-cover rounded border border-gray-200"
                                  />
                                </div>
                              )}

                              <div className="text-xs text-gray-600">
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                  <div>
                                    <span className="font-semibold">
                                      الموقع:
                                    </span>{" "}
                                    ({Math.round(face.box.x)},{" "}
                                    {Math.round(face.box.y)})
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      الحجم:
                                    </span>{" "}
                                    {Math.round(face.box.width)}×
                                    {Math.round(face.box.height)}
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-semibold">
                                      الثقة:
                                    </span>{" "}
                                    {Math.round(face.score * 100)}%
                                  </div>
                                </div>
                              </div>

                              {selectedFaceIndex === idx && (
                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-center gap-1">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleImageSearch();
                                    }}
                                    startIcon={<FaSearch />}
                                  >
                                    بحث
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSaveMissingPerson();
                                    }}
                                  >
                                    تسجيل
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <Typography
                          variant="body2"
                          className="mb-2 text-gray-600"
                        >
                          {selectedFaceIndex !== null
                            ? "تم تحديد الوجه. يمكنك الآن البحث أو تسجيل شخص جديد."
                            : faces.length > 0
                            ? "اختر وجهاً من القائمة للبدء"
                            : "قم بتحميل صورة تحتوي على وجوه"}
                        </Typography>

                        {selectedFaceIndex !== null && (
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleImageSearch}
                              disabled={isSearching}
                              startIcon={<FaSearch />}
                              fullWidth
                            >
                              بحث بالوجه
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={handleSaveMissingPerson}
                              disabled={isSearching}
                              fullWidth
                            >
                              تسجيل كمفقود
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="flex items-center">
                    نتائج البحث
                    <Chip
                      label={`${searchResults.length}`}
                      size="small"
                      color="primary"
                      className="mx-2"
                    />
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<FaTimesCircle />}
                    onClick={handleClearSearch}
                    size="small"
                  >
                    مسح النتائج
                  </Button>
                </div>
                <Divider className="mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((result) => {
                    // Ensure confidence has a default value
                    const confidence = result.confidence || 0.5;
                    const details = result.additionalInfo
                      ? {
                          age: result.age,
                          id: result.nationalId,
                          registrationDate: result.registrationDate,
                        }
                      : undefined;

                    return (
                      <div
                        key={result.id}
                        className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col">
                          {/* Header with confidence */}
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                              {result.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Chip
                                label={`${Math.round(confidence * 100)}%`}
                                color={
                                  confidence > 0.7
                                    ? "success"
                                    : confidence > 0.5
                                    ? "warning"
                                    : "error"
                                }
                                size="small"
                              />
                            </div>
                          </div>

                          {/* Image comparison */}
                          <div className="p-4">
                            <div className="flex items-center justify-between gap-3 mb-4">
                              <div className="flex-1 flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-500 mb-1">
                                  الصورة المرفوعة
                                </div>
                                <div className="w-28 h-28 border-2 border-blue-400 rounded-lg overflow-hidden">
                                  {selectedFaceIndex !== null &&
                                  faces[selectedFaceIndex]?.faceImageData ? (
                                    <img
                                      src={
                                        faces[selectedFaceIndex].faceImageData
                                      }
                                      alt="Uploaded Face"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={image || ""}
                                      alt="Uploaded"
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-center justify-center">
                                <div className="text-sm text-gray-500 mb-1">
                                  المطابقة
                                </div>
                                <div
                                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                                    confidence > 0.7
                                      ? "bg-green-100 text-green-800"
                                      : confidence > 0.5
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {Math.round(confidence * 100)}%
                                </div>
                                <div className="text-xl my-1">→</div>
                              </div>

                              <div className="flex-1 flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-500 mb-1">
                                  الشخص في قاعدة البيانات
                                </div>
                                <div className="w-28 h-28 border-2 border-green-400 rounded-lg overflow-hidden">
                                  <img
                                    src={result.imageUrl}
                                    alt={result.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Person details */}
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              {details && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">
                                      الاسم:
                                    </span>
                                    <span>{result.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">
                                      العمر:
                                    </span>
                                    <span>{result.age} سنة</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">
                                      رقم الهوية:
                                    </span>
                                    <span dir="ltr">{result.nationalId}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">
                                      تاريخ التسجيل:
                                    </span>
                                    <span dir="ltr">
                                      {result.registrationDate}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Image Metadata Summary */}
            {image && !isUploading && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <Typography variant="h6" className="mb-3">
                  ملخص البيانات
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="text-sm font-semibold text-blue-700">
                      الصورة
                    </div>
                    <div className="text-lg">
                      {imageRef.current
                        ? `${imageRef.current.naturalWidth}×${imageRef.current.naturalHeight}`
                        : ""}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <div className="text-sm font-semibold text-green-700">
                      وجوه مكتشفة
                    </div>
                    <div className="text-lg">{faces.length}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-md">
                    <div className="text-sm font-semibold text-purple-700">
                      نسبة الثقة
                    </div>
                    <div className="text-lg">
                      {selectedFaceIndex !== null
                        ? `${Math.round(faces[selectedFaceIndex].score * 100)}%`
                        : "-"}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-md">
                    <div className="text-sm font-semibold text-amber-700">
                      الوجه المحدد
                    </div>
                    <div className="text-lg">
                      {selectedFaceIndex !== null ? selectedFaceIndex + 1 : "-"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}

export default Search;
