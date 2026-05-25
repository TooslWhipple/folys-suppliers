"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Paper,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Clock, ImagePlus, Monitor, Upload } from "lucide-react";
import { StatusChip } from "@/components/StatusChip/StatusChip";
import type { SolicitudRefaccionDetail } from "@/mocks/data";

interface SolicitudRefaccionDetailModalProps {
  open: boolean;
  item: SolicitudRefaccionDetail | null;
  onClose: () => void;
}

const labelSx = {
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "#667085",
  mb: 0.5,
};

const valueSx = {
  fontSize: "0.875rem",
  fontWeight: 400,
  color: "#101828",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.875rem",
    backgroundColor: "#ffffff",
    "& fieldset": { borderColor: "#d0d5dd" },
    "&:hover fieldset": { borderColor: "#98a2b3" },
    "& input": { color: "#344054" },
    "& textarea": { color: "#344054" },
  },
  "& input::placeholder": { color: "#98a2b3", opacity: 1 },
  "& textarea::placeholder": { color: "#98a2b3", opacity: 1 },
};

const readonlySelectSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid #d0d5dd",
  borderRadius: 1.5,
  px: 1.75,
  py: 1.25,
  bgcolor: "#ffffff",
  cursor: "default",
};

export function SolicitudRefaccionDetailModal({
  open,
  item,
  onClose,
}: SolicitudRefaccionDetailModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!item) return null;

  const isEntregado = item.estatus === "Entregado";

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        p: { xs: 0, sm: 2 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100vw", sm: 520 },
          height: { xs: "100vh", sm: "calc(100vh - 32px)" },
          borderRadius: { xs: 0, sm: 3 },
          outline: "none",
          boxShadow: "0px 8px 40px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            pt: 2.5,
            pb: 2,
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              border: "1px solid #e4e7ec",
              borderRadius: 1.5,
              width: 32,
              height: 32,
              color: "#667085",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>

          <StatusChip
            label={isEntregado ? "Entregado" : "Por realizar"}
            variant={isEntregado ? "success" : "warning"}
            startIcon={<Clock size={12} />}
            size="default"
          />
        </Box>

        {/* Scrollable body */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.375rem", color: "#101828", mb: 0.5 }}>
            {item.refaccion}
          </Typography>

          <Typography sx={{ fontSize: "0.8125rem", color: "#667085", mb: 3 }}>
            Generada por:{" "}
            <Box component="span" sx={{ color: "#344054", fontWeight: 500 }}>
              {item.generadaPor}
            </Box>{" "}
            el {item.fechaCompleta}, {item.hora}
          </Typography>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              mb: 3,
              minHeight: 38,
              borderBottom: "1px solid #e4e7ec",
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#667085",
                minHeight: 38,
                px: 0,
                mr: 3,
                pb: 1.5,
                "&.Mui-selected": { color: "#101828", fontWeight: 600 },
              },
              "& .MuiTabs-indicator": { backgroundColor: "#101828", height: 2 },
            }}
          >
            <Tab label="Queja" />
            <Tab label="Indicaciones" />
            <Tab label="Solución" />
          </Tabs>

          {/* ── Tab: Queja ── */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Artículo</Typography>
                <Box sx={readonlySelectSx}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#344054" }}>
                    {item.articulo}
                  </Typography>
                  <Box component="span" sx={{ color: "#667085", fontSize: "1rem", lineHeight: 1, userSelect: "none" }}>
                    ⌄
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                <Box>
                  <Typography sx={labelSx}>Proveedor</Typography>
                  <Typography sx={valueSx}>{item.proveedor}</Typography>
                </Box>
                <Box>
                  <Typography sx={labelSx}>Forma de entrega</Typography>
                  <Typography sx={valueSx}>{item.formaEntrega}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 2, mb: 2.5 }}>
                <Box>
                  <Typography sx={{ ...labelSx, mb: 0.75 }}>Cantidad</Typography>
                  <TextField fullWidth size="small" value={item.cantidad} slotProps={{ input: { readOnly: true } }} sx={inputSx} />
                </Box>
                <Box>
                  <Typography sx={{ ...labelSx, mb: 0.75 }}>Número de serie</Typography>
                  <TextField fullWidth size="small" value={item.numeroSerie} slotProps={{ input: { readOnly: true } }} sx={inputSx} />
                </Box>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Queja</Typography>
                <TextField fullWidth multiline minRows={3} value={item.descripcionDano} slotProps={{ input: { readOnly: true } }} sx={inputSx} />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 1 }}>Evidencia</Typography>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  {item.evidencias.length > 0 ? (
                    item.evidencias.map((src: string, i: number) => (
                      <Box key={i} component="img" src={src}
                        sx={{ width: 72, height: 72, borderRadius: 2, objectFit: "cover", border: "1px solid #e4e7ec" }}
                      />
                    ))
                  ) : (
                    <>
                      {[0, 1, 2].map((i) => (
                        <Box key={i} sx={{ width: 72, height: 72, borderRadius: 2, border: "1px solid #e4e7ec", bgcolor: "#f2f4f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Monitor size={28} color="#98a2b3" strokeWidth={1.5} />
                        </Box>
                      ))}
                      <Box sx={{ width: 72, height: 72, borderRadius: 2, border: "1.5px dashed #84CAFF", bgcolor: "#F5FBFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { bgcolor: "#EFF8FF" }, transition: "background-color 0.15s" }}>
                        <ImagePlus size={24} color="#1570EF" strokeWidth={1.5} />
                      </Box>
                    </>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Observaciones</Typography>
                <TextField fullWidth size="small" placeholder="Ingrese" value={item.observaciones} slotProps={{ input: { readOnly: true } }} sx={inputSx} />
              </Box>
            </Box>
          )}

          {/* ── Tab: Indicaciones ── */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={labelSx}>¿Qué se hará con el artículo?</Typography>
                <Typography sx={valueSx}>{item.queHaraArticulo}</Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={labelSx}>¿Quién realizará la reparación?</Typography>
                <Typography sx={valueSx}>{item.quienRealizaReparacion}</Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Tipo de daño</Typography>
                <Box sx={readonlySelectSx}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#344054" }}>{item.tipoDano}</Typography>
                  <Box component="span" sx={{ color: "#667085", fontSize: "1rem", lineHeight: 1, userSelect: "none" }}>⌄</Box>
                </Box>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Refacción solicitada</Typography>
                <Box sx={readonlySelectSx}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#344054" }}>{item.refaccionSolicitada}</Typography>
                  <Box component="span" sx={{ color: "#667085", fontSize: "1rem", lineHeight: 1, userSelect: "none" }}>⌄</Box>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Autorizó</Typography>
                <Box sx={readonlySelectSx}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#344054" }}>{item.autorizo}</Typography>
                  <Box component="span" sx={{ color: "#667085", fontSize: "1rem", lineHeight: 1, userSelect: "none" }}>⌄</Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* ── Tab: Solución ── */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Seleccione la solución entregada</Typography>
                <Box sx={readonlySelectSx}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#344054" }}>{item.solucionEntregada}</Typography>
                  <Box component="span" sx={{ color: "#667085", fontSize: "1rem", lineHeight: 1, userSelect: "none" }}>⌄</Box>
                </Box>
              </Box>

              <Box
                sx={{
                  mb: 2.5,
                  border: "1.5px dashed #84CAFF",
                  borderRadius: 2,
                  bgcolor: "#F5FBFF",
                  py: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#EFF8FF" },
                  transition: "background-color 0.15s",
                }}
              >
                <Upload size={22} color="#1570EF" strokeWidth={1.5} />
                <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#1570EF" }}>
                  Cargar carta de aceptación
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Autorizado por</Typography>
                <TextField fullWidth size="small" value={item.autorizadoPor} slotProps={{ input: { readOnly: true } }} sx={inputSx} />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
  );
}
