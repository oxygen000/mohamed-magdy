import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Person interface definition
export interface Person {
  id: string;
  name: string;
  fatherName: string;
  nationalId: string;
  lostLocation: string;
  lostDate: string;
  documentNumber?: string;
  documentDate?: string;
  imageUrl: string;
  registrationDate: string;
  gender: "male" | "female";
  age: number;
  lastSeenDate: string;
  status: "missing" | "found" | "under_investigation";
  height?: number;
  weight?: number;
  eyeColor?: string;
  hairColor?: string;
  distinguishingFeatures?: string;
  contactPerson?: string;
  contactPhone?: string;
  faceDescriptor?: number[];
  confidence?: number;
  additionalInfo?: {
    [key: string]: string;
  };
}

// Search filters
export interface SearchFilters {
  ageRange?: { min: number; max: number };
  gender?: "male" | "female";
  dateRange?: { start: string; end: string };
  location?: string;
  status?: "missing" | "found" | "under_investigation";
}

// Sample data
const samplePeople: Person[] = [
  {
    id: "person-1",
    name: "محمد أحمد",
    fatherName: "أحمد محمد",
    nationalId: "29912345678901",
    lostLocation: "القاهرة - العباسية",
    lostDate: "2023-05-10",
    documentNumber: "DOC-12345",
    documentDate: "2023-05-15",
    imageUrl: "/dataimg/malik.jpeg",
    registrationDate: "2023-05-15",
    gender: "male",
    age: 12,
    lastSeenDate: "2023-05-10",
    status: "missing",
    height: 145,
    weight: 38,
    eyeColor: "brown",
    hairColor: "black",
    distinguishingFeatures: "وجود شامة على الخد الأيمن",
    contactPerson: "أحمد محمد (الأب)",
    contactPhone: "01012345678",
    // Mock face descriptor
    faceDescriptor: Array(128)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    additionalInfo: {
      phoneNumber: "01012345678",
      lastSeen: "بالقرب من محطة مترو العباسية",
      clothingDescription: "قميص أزرق وبنطلون جينز",
    },
  },
  {
    id: "person-2",
    name: "علي حسن",
    fatherName: "حسن علي",
    nationalId: "30112345678901",
    lostLocation: "الإسكندرية - المنتزه",
    lostDate: "2023-07-15",
    documentNumber: "DOC-67890",
    documentDate: "2023-07-22",
    imageUrl: "/dataimg/amrphto.jpeg",
    registrationDate: "2023-07-22",
    gender: "male",
    age: 9,
    lastSeenDate: "2023-07-15",
    status: "missing",
    height: 130,
    weight: 28,
    eyeColor: "green",
    hairColor: "brown",
    distinguishingFeatures: "يرتدي نظارة طبية",
    contactPerson: "حسن علي (الأب)",
    contactPhone: "01098765432",
    // Mock face descriptor
    faceDescriptor: Array(128)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    additionalInfo: {
      phoneNumber: "01098765432",
      lastSeen: "بالقرب من شاطئ المنتزه",
      clothingDescription: "تيشيرت أحمر وبنطلون أسود",
    },
  },
  {
    id: "person-3",
    name: "سارة خالد",
    fatherName: "خالد إبراهيم",
    nationalId: "30512345678901",
    lostLocation: "القاهرة - مدينة نصر",
    lostDate: "2023-08-20",
    documentNumber: "DOC-54321",
    documentDate: "2023-08-22",
    imageUrl: "/dataimg/sample.jpg",
    registrationDate: "2023-08-22",
    gender: "female",
    age: 7,
    lastSeenDate: "2023-08-20",
    status: "missing",
    height: 125,
    weight: 25,
    eyeColor: "brown",
    hairColor: "black",
    distinguishingFeatures: "شعر طويل مجدول",
    contactPerson: "خالد إبراهيم (الأب)",
    contactPhone: "01187654321",
    // Mock face descriptor
    faceDescriptor: Array(128)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    additionalInfo: {
      phoneNumber: "01187654321",
      lastSeen: "أمام المدرسة في مدينة نصر",
      clothingDescription: "فستان وردي وحذاء أبيض",
    },
  },
];

interface PeopleState {
  people: Person[];
  searchResults: Person[];
  searchFilters: SearchFilters;
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  people: samplePeople,
  searchResults: [],
  searchFilters: {
    ageRange: { min: 0, max: 18 },
  },
  loading: false,
  error: null,
};

// Calculate similarity between face descriptors
const calculateSimilarity = (desc1: number[], desc2: number[]): number => {
  if (desc1.length !== desc2.length) return 0;

  // Calculate cosine similarity instead of Euclidean distance
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < desc1.length; i++) {
    dotProduct += desc1[i] * desc2[i];
    norm1 += Math.pow(desc1[i], 2);
    norm2 += Math.pow(desc2[i], 2);
  }

  // Avoid division by zero
  if (norm1 === 0 || norm2 === 0) return 0;

  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));

  // Scale to 0-1 range (cosine similarity is between -1 and 1)
  return (similarity + 1) / 2;
};

// Async thunks
export const searchByFace = createAsyncThunk(
  "people/searchByFace",
  async (faceDescriptor: number[], { getState, rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const state = getState() as { people: PeopleState };
      const { people } = state.people;

      // Find people with similar face descriptors
      const matches = people
        .map((person) => {
          const similarity = calculateSimilarity(
            faceDescriptor,
            person.faceDescriptor || []
          );
          return {
            ...person,
            confidence: similarity,
          };
        })
        .filter((match) => match.confidence > 0.3) // Threshold for matches
        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0)); // Sort by confidence

      return matches;
    } catch (error) {
      return rejectWithValue("Face search failed");
    }
  }
);

export const searchByFilters = createAsyncThunk(
  "people/searchByFilters",
  async (filters: SearchFilters, { getState, rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const state = getState() as { people: PeopleState };
      const { people } = state.people;

      // Filter people based on criteria
      return people.filter((person) => {
        let match = true;

        // Age range filter
        if (filters.ageRange && match) {
          match =
            person.age >= filters.ageRange.min &&
            person.age <= filters.ageRange.max;
        }

        // Gender filter
        if (filters.gender && match) {
          match = person.gender === filters.gender;
        }

        // Date range filter
        if (filters.dateRange && match) {
          const personDate = new Date(person.lostDate);
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          match = personDate >= startDate && personDate <= endDate;
        }

        // Location filter
        if (filters.location && match) {
          match = person.lostLocation.includes(filters.location);
        }

        // Status filter
        if (filters.status && match) {
          match = person.status === filters.status;
        }

        return match;
      });
    } catch (error) {
      return rejectWithValue("Filter search failed");
    }
  }
);

export const addPerson = createAsyncThunk(
  "people/addPerson",
  async (person: Omit<Person, "id">, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate a unique ID
      const id = `person-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      return {
        id,
        ...person,
      };
    } catch (error) {
      return rejectWithValue("Failed to add person");
    }
  }
);

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    updateSearchFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.searchFilters = {
        ...state.searchFilters,
        ...action.payload,
      };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.people.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.people[index] = action.payload;
      }
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      state.people = state.people.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Search by face
      .addCase(searchByFace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByFace.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.loading = false;
      })
      .addCase(searchByFace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search by filters
      .addCase(searchByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByFilters.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.loading = false;
      })
      .addCase(searchByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add person
      .addCase(addPerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPerson.fulfilled, (state, action) => {
        state.people.push(action.payload);
        state.loading = false;
      })
      .addCase(addPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateSearchFilters,
  clearSearchResults,
  updatePerson,
  deletePerson,
} = peopleSlice.actions;

export default peopleSlice.reducer;
