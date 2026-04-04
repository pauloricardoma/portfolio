/**
 * ColorPicker.tsx — Seletor de cor primary dinâmico.
 *
 * Combina duas abordagens:
 * 1. Presets: cores predefinidas pra click rápido
 * 2. Input nativo: abre o color picker do sistema (qualquer cor)
 *
 * Quando o usuário escolhe uma cor:
 * - Atualiza o state no ThemeContext (via setPrimaryColor)
 * - O ThemeContext recalcula todas as variantes (hover, pressed, container...)
 * - ThemeProvider re-renderiza TODOS os styled-components com a nova cor
 * - A mudança é persistida no localStorage
 *
 * Isso demonstra customização de tema em runtime — um recurso
 * que mostra domínio de Context API, styled-components e design system.
 */
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

/**
 * Paleta de cores predefinidas — escolhidas pra funcionar bem
 * tanto em light quanto dark mode, com bom contraste.
 */
const PRESETS = [
  "#0F2B5B", // Azul marinho (default)
  "#1E40AF", // Azul royal
  "#7C3AED", // Violeta
  "#DB2777", // Rosa
  "#DC2626", // Vermelho
  "#EA580C", // Laranja
  "#D97706", // Âmbar
  "#16A34A", // Verde
  "#0D9488", // Teal
  "#0891B2", // Cyan
  "#4A7FD4", // Azul claro (default dark)
  "#6366F1", // Indigo
];

export default function ColorPicker() {
  const { primaryColor, setPrimaryColor } = useAppTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Click outside — fecha o dropdown quando clica fora.
   *
   * mousedown (não click) porque:
   * - click = mousedown + mouseup no MESMO elemento
   * - Se o usuário arrasta de dentro pra fora, click não dispara
   * - mousedown é mais confiável pra "fechar ao clicar fora"
   */
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
