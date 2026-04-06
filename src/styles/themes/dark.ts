import type { ITheme } from "./types";

const dark: ITheme = {
  colors: {
    primary: {
      primary: "#4A7FD4",
      primaryHover: "color-mix(in srgb, #4A7FD4 88%, #000000)",
      primaryPressed: "color-mix(in srgb, #4A7FD4 76%, #000000)",
      primaryOutline: "color-mix(in srgb, #4A7FD4 50%, transparent)",
      primaryContainer: "color-mix(in srgb, #4A7FD4 16%, #0A0E17)",
      onPrimary: "#FFFFFF",
    },
    tertiary: {
      tertiary: "#8AD4F0",
      tertiaryHover: "color-mix(in srgb, #8AD4F0 88%, #000000)",
      tertiaryPressed: "color-mix(in srgb, #8AD4F0 76%, #000000)",
      tertiaryOutline: "color-mix(in srgb, #8AD4F0 50%, transparent)",
      tertiaryContainer: "color-mix(in srgb, #8AD4F0 16%, #0A0E17)",
      onTertiary: "#0A0E17",
    },
    secondary: {
      secondary: "#1E293B",
      secondaryHover: "color-mix(in srgb, #1E293B 88%, #000000)",
      onSecondary: "#E2E8F0",
      onSecondaryVariant: "#94A3B8",
    },
    surface: {
      surface: "#0A0E17",
      surfaceContainer: "#111827",
      surfaceOutline: "#1E293B",
      onSurface: "#F1F5F9",
      onSurfaceVariant: "#94A3B8",
      onSurfacePlaceholder: "#475569",
    },
    danger: {
      main: "#FC8181",
      onMain: "#1A202C",
      container: "color-mix(in srgb, #FC8181 16%, #0A0E17)",
    },
    warning: {
      main: "#F6E05E",
      onMain: "#1A202C",
      container: "color-mix(in srgb, #F6E05E 16%, #0A0E17)",
    },
    success: {
      main: "#68D391",
      onMain: "#1A202C",
      container: "color-mix(in srgb, #68D391 16%, #0A0E17)",
    },
  },
  font: {
    family: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};

export default dark;
