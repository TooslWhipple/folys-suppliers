"use client";

import { useMemo } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import { Calendar } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { colors } from "@/lib/theme";
import {
  FieldLabel,
  FieldWrapper,
  StyledOpenPickerButton,
} from "./FormDatePicker.styles";

export interface FormDatePickerProps {
  label?: string;
  /** Date as `YYYY-MM-DD`, or an empty string when no date is selected. */
  value: string;
  /** Called with a `YYYY-MM-DD` string, or an empty string when cleared. */
  onChange: (value: string) => void;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  fullWidth?: boolean;
}

function OpenPickerIcon() {
  return <Calendar size={16} color={colors.text.secondary} />;
}

function toPickerDayjs(value: string | undefined): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(value, "YYYY-MM-DD", true);
  return parsed.isValid() ? parsed : null;
}

/**
 * Date input that speaks `YYYY-MM-DD` strings, the format the supplier portal
 * API expects for date range filters.
 */
export function FormDatePicker({
  label,
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  fullWidth = true,
}: FormDatePickerProps) {
  const parsedValue = useMemo(() => toPickerDayjs(value), [value]);
  const parsedMinDate = useMemo(() => toPickerDayjs(minDate), [minDate]);
  const parsedMaxDate = useMemo(() => toPickerDayjs(maxDate), [maxDate]);

  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue || !newValue.isValid()) {
      onChange("");
      return;
    }

    onChange(newValue.format("YYYY-MM-DD"));
  };

  return (
    <FieldWrapper>
      {label && <FieldLabel>{label}</FieldLabel>}
      <DatePicker
        value={parsedValue}
        onChange={handleChange}
        disabled={disabled}
        format="DD/MM/YYYY"
        minDate={parsedMinDate ?? undefined}
        maxDate={parsedMaxDate ?? undefined}
        slots={{
          openPickerIcon: OpenPickerIcon,
          openPickerButton: StyledOpenPickerButton,
        }}
        slotProps={{
          textField: { fullWidth },
          field: { clearable: true, onClear: () => onChange("") },
        }}
      />
    </FieldWrapper>
  );
}
