import { useState, useRef, useEffect, useCallback } from "react";
import { useAppTheme } from "~/contexts/ThemeContext";
import {
  PickerWrapper,
  PickerTrigger,
  PickerDropdown,
  PickerLabel,
  PresetGrid,
  PresetSwatch,
  CustomColorRow,
  NativeColorInput,
  CustomColorLabel,
} from "./styles";

const PRESETS = [
  "#0F2B5B",
  "#1E40AF",
  "#7C3AED",
  "#DB2777",
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#16A34A",
  "#0D9488",
  "#0891B2",
  "#4A7FD4",
  "#6366F1",
];

export default function ColorPicker() {
  const { primaryColor, setPrimaryColor } = useAppTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSelect = useCallback(
    (color: string) => {
      setPrimaryColor(color);
    },
    [setPrimaryColor]
  );

  return (
    <PickerWrapper ref={wrapperRef}>
      <PickerTrigger
        $color={primaryColor || undefined}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Customizar cor do tema"
        title="Customizar cor"
      />

      <PickerDropdown $open={open}>
        <PickerLabel>Cor do tema</PickerLabel>

        <PresetGrid>
          {PRESETS.map((color) => (
            <PresetSwatch
              key={color}
              $color={color}
              $active={primaryColor === color}
              onClick={() => handleSelect(color)}
              title={color}
            />
          ))}
        </PresetGrid>

        <CustomColorRow>
          <NativeColorInput
            type="color"
            value={primaryColor || "#0F2B5B"}
            onChange={(e) => handleSelect(e.target.value)}
            title="Escolher cor personalizada"
          />
          <CustomColorLabel>Cor personalizada</CustomColorLabel>
        </CustomColorRow>
      </PickerDropdown>
    </PickerWrapper>
  );
}
