import type { ITheme } from "./types";

const light: ITheme = {
  colors: {
    primary: {
      primary: "#0F2B5B",
      primaryHover: "color-mix(in srgb, #0F2B5B 88%, #FFFFFF)",
      primaryPressed: "color-mix(in srgb, #0F2B5B 76%, #FFFFFF)",
      primaryOutline: "color-mix(in srgb, #0F2B5B 50%, transparent)",
      primaryContainer: "color-mix(in srgb, #0F2B5B 12%, #FFFFFF)",
      onPrimary: "#FFFFFF",
    },
    tertiary: {
      tertiary: "#60B8E0",
      tertiaryHover: "color-mix(in srgb, #60B8E0 88%, #FFFFFF)",
      tertiaryPressed: "color-mix(in srgb, #60B8E0 76%, #FFFFFF)",
      tertiaryOutline: "color-mix(in srgb, #60B8E0 50%, transparent)",
      tertiaryContainer: "color-mix(in srgb, #60B8E0 12%, #FFFFFF)",
      onTertiary: "#FFFFFF",
    },
    secondary: {
      secondary: "#E8ECF1",
      secondaryHover: "color-mix(in srgb, #E8ECF1 88%, #FFFFFF)",
      onSecondary: "#1A2B3D",
      onSecondaryVariant: "#6B7C8D",
    },
    surface: {
      surface: "#FFFFFF",
      surfaceContainer: "#F5F7FA",
      surfaceOutline: "#E2E8F0",
      onSurface: "#0F1A2E",
      onSurfaceVariant: "#5A6B7D",
      onSurfacePlaceholder: "#A0AEC0",
    },
    danger: {
      main: "#E53E3E",
      onMain: "#FFFFFF",
      container: "color-mix(in srgb, #E53E3E 12%, #FFFFFF)",
    },
    warning: {
      main: "#ECC94B",
      onMain: "#1A2B3D",
      container: "color-mix(in srgb, #ECC94B 12%, #FFFFFF)",
    },
    success: {
      main: "#38A169",
      onMain: "#FFFFFF",
      container: "color-mix(in srgb, #38A169 12%, #FFFFFF)",
    },
  },
  font: {
    family: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};

export default light;
