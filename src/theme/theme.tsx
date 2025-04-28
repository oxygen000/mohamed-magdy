import { createTheme } from "@mui/material/styles";

// Define the color palette
const colors = {
  primary: {
    main: "#4361ee",
    light: "#738eef",
    dark: "#2f48c5",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#3f37c9",
    light: "#6f64d9",
    dark: "#2b248e",
    contrastText: "#ffffff",
  },
  success: {
    main: "#4cc9f0",
    light: "#7ad7f3",
    dark: "#3496b4",
    contrastText: "#ffffff",
  },
  error: {
    main: "#f72585",
    light: "#f95fa5",
    dark: "#ac1a5e",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#f8961e",
    light: "#fab54d",
    dark: "#ad6815",
    contrastText: "#ffffff",
  },
  info: {
    main: "#4895ef",
    light: "#73aef3",
    dark: "#3168a7",
    contrastText: "#ffffff",
  },
  background: {
    default: "#f8f9fa",
    paper: "#ffffff",
    dark: "#e9ecef",
  },
  text: {
    primary: "#212529",
    secondary: "#6c757d",
    disabled: "#adb5bd",
  },
  divider: "#dee2e6",
};

// Create a theme with Arabic support and RTL direction
const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: colors.background,
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.divider,
  },
  typography: {
    fontFamily:
      '"IBM Plex Sans Arabic", "Tajawal", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 600,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
        },
        outlinedPrimary: {
          borderWidth: 2,
        },
        outlinedSecondary: {
          borderWidth: 2,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
        elevation2: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
        elevation3: {
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: "hidden",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: "0 16px",
          minHeight: 56,
          "&.Mui-expanded": {
            minHeight: 56,
          },
        },
        content: {
          margin: "12px 0",
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 16,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "16px 0",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          "&.Mui-selected": {
            backgroundColor: `${colors.primary.light}20`,
          },
        },
      },
    },
  },
});

export default theme;
