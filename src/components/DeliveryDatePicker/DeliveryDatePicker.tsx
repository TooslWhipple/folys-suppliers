"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import { Close, ChevronLeft, ChevronRight } from "@mui/icons-material";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const WEEKDAY_ABBR = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const WEEKDAY_FULL = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type DayAvailability = "available" | "limited" | "unavailable";

interface DeliveryMethod {
  id: string;
  label: string;
  description: string;
}

const DELIVERY_METHODS: DeliveryMethod[] = [
  { id: "rabon", label: "Camión rígido - Rabón", description: "Camión chico de 1 eje" },
  { id: "torton", label: "Camión rígido - Tortón", description: "Camión chico de 2 ejes" },
  { id: "articulado53", label: "Camión articulado - 53 pies", description: "Camión grande de caja de 53 pies" },
  { id: "articulado48", label: "Camión articulado - 48 pies", description: "Camión grande de caja de 48 pies" },
];

function getDayAvailability(date: Date): DayAvailability {
  const day = date.getDay();
  if (day === 0 || day === 6) return "unavailable";
  const d = date.getDate();
  if (d % 5 === 0 || d % 7 === 0) return "limited";
  return "available";
}

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const offset = startDow === 0 ? 6 : startDow - 1;
  const days: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) {
    const d = new Date(year, month, -offset + i + 1);
    days.push(d);
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push(new Date(year, month + 1, d));
    }
  }
  return days;
}

function formatShortDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const monthAbbr = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${day}/${monthAbbr[date.getMonth()]}/${date.getFullYear()}`;
}

interface DeliveryDatePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (date: Date, method: string) => void;
  selectedDate?: Date | null;
}

export function DeliveryDatePicker({
  open,
  onClose,
  onSelect,
  selectedDate,
}: DeliveryDatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovered, setHovered] = useState<Date | null>(null);
  const [internalDate, setInternalDate] = useState<Date | null>(selectedDate ?? null);
  const [selectedMethod, setSelectedMethod] = useState<string>(DELIVERY_METHODS[0].id);

  const calendarDays = getCalendarDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isCurrentMonth = (date: Date) =>
    date.getMonth() === viewMonth && date.getFullYear() === viewYear;

  const isSelected = (date: Date) =>
    internalDate &&
    date.getDate() === internalDate.getDate() &&
    date.getMonth() === internalDate.getMonth() &&
    date.getFullYear() === internalDate.getFullYear();

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isPast = (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  };

  const dotColor = (availability: DayAvailability): string => {
    if (availability === "available") return "#17B26A";
    if (availability === "limited") return "#F79009";
    return "transparent";
  };

  const handleDayClick = (date: Date) => {
    setInternalDate(date);
  };

  const handleConfirm = () => {
    if (internalDate) {
      onSelect(internalDate, selectedMethod);
      onClose();
    }
  };

  const availability = internalDate ? getDayAvailability(internalDate) : null;
  const availabilityLabel =
    availability === "limited" ? "Poca disponibilidad" :
    availability === "available" ? "Disponible" : null;
  const availabilityColor = availability === "limited" ? "#F79009" : "#17B26A";

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-end",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100vw", sm: "62vw", md: "58vw" },
          maxWidth: 800,
          minHeight: "100vh",
          borderRadius: 0,
          borderTopLeftRadius: { xs: 0, sm: 16 },
          borderBottomLeftRadius: { xs: 0, sm: 16 },
          overflow: "hidden",
          outline: "none",
          boxShadow: "-8px 0px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Close button + Title */}
        <Box sx={{ px: 4, pt: 4, pb: 2 }}>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              border: "1px solid #e4e7ec",
              borderRadius: 1.5,
              width: 32,
              height: 32,
              color: "#667085",
              mb: 2.5,
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 600, fontSize: "1.0625rem", color: "#101828" }}>
            Selecciona un día de entrega
          </Typography>
        </Box>

        {/* Body: calendar + right panel */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Calendar */}
          <Box sx={{ flex: 1, px: 4, pb: 4, overflowY: "auto" }}>
            {/* Month navigation */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.625rem", color: "#101828" }}>
                {MONTH_NAMES[viewMonth]}, {viewYear}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={prevMonth}
                  sx={{ color: "#667085", "&:hover": { bgcolor: "#f2f4f7" }, borderRadius: 1 }}
                >
                  <ChevronLeft sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={nextMonth}
                  sx={{ color: "#667085", "&:hover": { bgcolor: "#f2f4f7" }, borderRadius: 1 }}
                >
                  <ChevronRight sx={{ fontSize: 22 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Weekday headers */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
              {WEEKDAYS.map(day => (
                <Typography
                  key={day}
                  sx={{
                    textAlign: "center",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#667085",
                    py: 1,
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            {/* Days grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {calendarDays.map((date, idx) => {
                if (!date) return <Box key={idx} />;
                const inMonth = isCurrentMonth(date);
                const avail = getDayAvailability(date);
                const past = isPast(date);
                const selected = isSelected(date);
                const todayDay = isToday(date);
                const isHov =
                  hovered &&
                  hovered.getDate() === date.getDate() &&
                  hovered.getMonth() === date.getMonth() &&
                  hovered.getFullYear() === date.getFullYear();
                const disabled = !inMonth || past || avail === "unavailable";

                const dotBg = selected
                  ? "rgba(255,255,255,0.75)"
                  : !inMonth || past || avail === "unavailable"
                  ? "#d0d5dd"
                  : dotColor(avail);

                return (
                  <Box
                    key={idx}
                    onClick={() => !disabled && handleDayClick(date)}
                    onMouseEnter={() => !disabled && setHovered(date)}
                    onMouseLeave={() => setHovered(null)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 1.25,
                      cursor: disabled ? "default" : "pointer",
                    }}
                  >
                    {/* Day number with circle for selected */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: selected
                          ? "#1570EF"
                          : isHov && !disabled
                          ? "#f2f4f7"
                          : "transparent",
                        transition: "background-color 0.15s",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          fontWeight: selected ? 700 : todayDay ? 700 : 400,
                          color: selected
                            ? "#ffffff"
                            : !inMonth || past
                            ? "#d0d5dd"
                            : todayDay
                            ? "#1570EF"
                            : "#101828",
                          lineHeight: 1,
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        mt: 0.5,
                        bgcolor: dotBg,
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Right panel */}
          <Box
            sx={{
              width: 240,
              borderLeft: "1px solid #f2f4f7",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {/* Tu selección */}
            <Box sx={{ px: 2.5, pt: 3, pb: 2, borderBottom: "1px solid #f2f4f7" }}>
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, color: "#667085", mb: 1.5 }}>
                Tu selección
              </Typography>

              {internalDate ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {/* Day pill */}
                  <Box
                    sx={{
                      bgcolor: "#FFF6ED",
                      border: "1px solid #FDDCAB",
                      borderRadius: 1.5,
                      px: 1,
                      py: 0.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 44,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, color: "#F79009", lineHeight: 1.2 }}>
                      {WEEKDAY_ABBR[internalDate.getDay()]}
                    </Typography>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#F79009", lineHeight: 1.1 }}>
                      {internalDate.getDate()}
                    </Typography>
                  </Box>
                  {/* Date text */}
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#101828", lineHeight: 1.3 }}>
                      {WEEKDAY_FULL[internalDate.getDay()]} {internalDate.getDate()} de {MONTH_NAMES[internalDate.getMonth()]}
                    </Typography>
                    {availabilityLabel && (
                      <Typography sx={{ fontSize: "0.75rem", color: availabilityColor, mt: 0.25 }}>
                        {availabilityLabel}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ bgcolor: "#EFF8FF", borderRadius: 1.5, p: 1.5 }}>
                  <Typography sx={{ fontSize: "0.8125rem", color: "#84CAFF", lineHeight: 1.6 }}>
                    Selecciona un dia para revisar disponibilidad de entrega.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Forma de entrega */}
            {internalDate && (
              <Box sx={{ px: 2.5, py: 2.5, flex: 1 }}>
                <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "#101828", mb: 1.5 }}>
                  Forma de entrega
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {DELIVERY_METHODS.map(method => {
                    const isChosen = selectedMethod === method.id;
                    return (
                      <Box
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.25,
                          px: 1.5,
                          py: 1.25,
                          borderRadius: 2,
                          bgcolor: isChosen ? "#EFF8FF" : "transparent",
                          border: isChosen ? "1px solid #B2DDFF" : "1px solid transparent",
                          cursor: "pointer",
                          "&:hover": { bgcolor: isChosen ? "#EFF8FF" : "#f9fafb" },
                          transition: "background-color 0.15s",
                        }}
                      >
                        {/* Radio circle */}
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: `2px solid ${isChosen ? "#1570EF" : "#d0d5dd"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            mt: 0.25,
                            bgcolor: "white",
                          }}
                        >
                          {isChosen && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "#1570EF",
                              }}
                            />
                          )}
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "#101828", lineHeight: 1.3 }}>
                            {method.label}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#667085", mt: 0.25 }}>
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Footer note + Confirm button */}
            {internalDate && (
              <Box sx={{ px: 2.5, pb: 3, pt: 1 }}>
                <Typography sx={{ fontSize: "0.75rem", color: "#98a2b3", mb: 2, lineHeight: 1.5 }}>
                  Al confirmar la entrega será programada para esta fecha.
                </Typography>
                <Box
                  component="button"
                  onClick={handleConfirm}
                  sx={{
                    width: "100%",
                    py: 1.25,
                    bgcolor: "#1570EF",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 2,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                    "&:hover": { bgcolor: "#1462d4" },
                  }}
                >
                  Confirmar
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
}

export { formatShortDate };
