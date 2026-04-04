import styled, { css } from "styled-components";
import { spacing, borderRadius } from "~/styles/tokens";

export const PickerWrapper = styled.div`
  position: relative;
`;

/**
 * Botão que abre o picker — mostra a cor atual como preview.
 * O gradiente cônico (conic-gradient) simula um mini color wheel
 * quando nenhuma cor custom está selecionada.
 */
export const PickerTrigger = styled.button<{ $color?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  background: ${({ $color }) =>
    $color
      ? $color
      : `conic-gradient(
          #ff0000, #ff8800, #ffff00, #00ff00,
          #0088ff, #8800ff, #ff0088, #ff0000
        )`};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.primary};
    transform: scale(1.1);
  }
`;

/**
 * Dropdown com as opções de cor.
 * Aparece abaixo do botão com uma animação de scale + fade.
 */
interface DropdownProps {
  $open: boolean;
}

export const PickerDropdown = styled.div<DropdownProps>`
  position: absolute;
  top: calc(100% + ${spacing.sm}px);
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  border-radius: ${borderRadius.lg}px;
  padding: ${spacing.md}px;
  z-index: 200;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

  transition: all 0.2s ease;
  transform-origin: top right;

  ${({ $open }) =>
    !$open &&
    css`
      transform: scale(0.95);
      opacity: 0;
      pointer-events: none;
    `}
`;

export const PickerLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  margin-bottom: ${spacing.sm}px;
  display: block;
`;

/** Grid de cores predefinidas */
export const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-bottom: ${spacing.md}px;
`;

interface PresetSwatchProps {
  $color: string;
  $active: boolean;
}

export const PresetSwatch = styled.button<PresetSwatchProps>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $active, theme }) =>
    $active &&
    css`
      border-color: ${theme.colors.surface.onSurface};
      transform: scale(1.15);
      box-shadow: 0 0 0 2px ${theme.colors.surface.surface};
    `}

  &:hover {
    transform: scale(1.15);
  }
`;

/**
 * Input nativo type="color" — abre o color picker do sistema.
 * Estilizado pra parecer um botão, escondendo o visual padrão.
 */
export const CustomColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
  padding-top: ${spacing.sm}px;
  border-top: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
`;

export const NativeColorInput = styled.input`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  background: none;

  /* Esconde o visual padrão do input color */
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 2px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
    border-radius: 50%;
  }
  &::-moz-color-swatch {
    border: 2px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
    border-radius: 50%;
  }
`;

export const CustomColorLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
`;
