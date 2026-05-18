"use client";

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { colors } from "@/lib/theme";

export type StatusChipVariant = "default" | "success" | "pending" | "error" | "warning" | "info" | "infoAlt" | "disabled";
export type StatusChipSize = "default" | "small";

const variantStyles: Record<StatusChipVariant, { background: string; color: string }> = {
  default: colors.chip.variants.default,
  success: colors.chip.variants.success,
  pending: colors.chip.variants.pending,
  error: colors.chip.variants.error,
  warning: colors.chip.variants.warning,
  info: colors.chip.variants.info,
  infoAlt: colors.chip.variants.infoAlt,
  disabled: colors.chip.variants.disabled,
};

const sizeStyles: Record<
  StatusChipSize,
  { height: number; padding: string; gap: number }
> = {
  default: {
    height: 28,
    padding: "4px 12px",
    gap: 6,
  },
  small: {
    height: 24,
    padding: "2px 8px",
    gap: 4,
  },
};

interface StyledStatusChipProps {
  variant: StatusChipVariant;
  size?: StatusChipSize;
  backgroundColor?: string;
  color?: string;
}

const StyledStatusChip = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "variant" && prop !== "size" && prop !== "backgroundColor" && prop !== "color",
})<StyledStatusChipProps>(({ variant, size = "default", backgroundColor: bgOverride, color: colorOverride }) => {
  const { background, color } = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sizeStyle.gap,
    borderRadius: "8px",
    height: sizeStyle.height,
    padding: sizeStyle.padding,
    backgroundColor: bgOverride ?? background,
    color: colorOverride ?? color,
    fontSize: size === "small" ? 12 : 14,
    fontWeight: 600,
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  };
});

export interface StatusChipProps {
  label: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: StatusChipVariant;
  size?: StatusChipSize;
  backgroundColor?: string;
  color?: string;
  className?: string;
  id?: string;
}

export function StatusChip({
  label,
  startIcon,
  endIcon,
  variant = "default",
  size = "small",
  backgroundColor,
  color,
  className,
  id,
}: StatusChipProps) {
  return (
    <StyledStatusChip
      variant={variant}
      size={size}
      backgroundColor={backgroundColor}
      color={color}
      className={className}
      id={id}
    >
      {startIcon}
      <span>{label}</span>
      {endIcon}
    </StyledStatusChip>
  );
}
