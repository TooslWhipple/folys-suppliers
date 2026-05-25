"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Package, CircleDollarSign, Clock } from "lucide-react";
import numeral from "numeral";
import { colors } from "@/lib/theme";
import {
  entregasProgramadas,
  pagosProgramados,
  historialPagos,
  type EntregaGrupo,
  type PagoItem,
} from "@/mocks/data";

const SidebarContainer = styled(Box)({
  width: 280,
  minWidth: 280,
  backgroundColor: colors.background.sidebar,
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  padding: "20px",
  height: "fit-content",
  alignSelf: "flex-start",
});

const TabRow = styled(Box)({
  display: "flex",
  gap: "4px",
  backgroundColor: "#F2F4F7",
  borderRadius: "10px",
  padding: "3px",
  marginBottom: "16px",
});

const TabBtn = styled("button")<{ selected?: boolean }>(({ selected }) => ({
  flex: 1,
  padding: "4px 12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: selected ? 600 : 400,
  color: selected ? "#101828" : "#667085",
  backgroundColor: selected ? "#ffffff" : "transparent",
  boxShadow: selected ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
  transition: "all 0.15s",
}));

function formatMonto(value: number) {
  return numeral(value).format("$0,0.00");
}

function EntregasTab() {
  return (
    <Box>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1.5,
          bgcolor: "#F2F4F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <Package size={16} color="#667085" strokeWidth={1.5} />
      </Box>
      <Typography sx={{ fontSize: "0.75rem", color: "#667085", fontWeight: 500, mb: 1.5 }}>
        Entregas programadas
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {entregasProgramadas.map((grupo: EntregaGrupo) => (
          <Box key={grupo.fecha} sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#EFF8FF",
                borderRadius: 1,
                px: 1,
                py: 0.5,
                mb: 0.75,
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#1570EF" }}>
                {grupo.fecha}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#667085" }}>
                {grupo.totalArticulos} {grupo.totalArticulos === 1 ? "artículo" : "artículos"}
              </Typography>
            </Box>

            {grupo.productos.map((p, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.5,
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: "#F9FAFB",
                      border: "1px solid #E4E7EC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Package size={12} color="#98A2B3" strokeWidth={1.5} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.6875rem",
                      color: "#344054",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.nombre}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#101828", flexShrink: 0 }}>
                  {p.cantidad}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function PagosTab() {
  return (
    <Box>
      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "#EFF8FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.5,
        }}
      >
        <CircleDollarSign size={22} color="#1570EF" strokeWidth={1.5} />
      </Box>

      {/* Pagos programados */}
      <Typography sx={{ fontSize: "0.75rem", color: "#667085", fontWeight: 500, mb: 1 }}>
        Pagos programados
      </Typography>

      {pagosProgramados.map((p: PagoItem) => (
        <Box
          key={p.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
            px: 1.25,
            py: 1,
            border: "1px solid #E4E7EC",
            borderRadius: 1.5,
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Clock size={14} color="#98A2B3" strokeWidth={1.5} />
            <Typography sx={{ fontSize: "0.75rem", color: "#344054" }}>{p.fecha}</Typography>
          </Box>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#667085", flexShrink: 0 }}>
            {formatMonto(p.monto)}
          </Typography>
        </Box>
      ))}

      {/* Historial de pagos */}
      <Typography sx={{ fontSize: "0.75rem", color: "#667085", fontWeight: 500, mb: 1 }}>
        Historial de pagos
      </Typography>

      <Box sx={{ border: "1px solid #E4E7EC", borderRadius: 2, overflow: "hidden" }}>
        {historialPagos.map((p: PagoItem, index: number) => (
          <Box
            key={p.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1.5,
              py: 1.25,
              gap: 1,
              borderBottom: index < historialPagos.length - 1 ? "1px solid #E4E7EC" : "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#D0D5DD",
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: "0.75rem", color: "#344054" }}>{p.fecha}</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#101828", flexShrink: 0 }}>
              {formatMonto(p.monto)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function ActivitySidebar() {
  const [tab, setTab] = useState<"entregas" | "pagos">("entregas");

  return (
    <SidebarContainer>
      <TabRow>
        <TabBtn selected={tab === "entregas"} onClick={() => setTab("entregas")}>
          Entregas
        </TabBtn>
        <TabBtn selected={tab === "pagos"} onClick={() => setTab("pagos")}>
          Pagos
        </TabBtn>
      </TabRow>

      {tab === "entregas" ? <EntregasTab /> : <PagosTab />}
    </SidebarContainer>
  );
}
