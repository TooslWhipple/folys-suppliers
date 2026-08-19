"use client";

import { Box, Typography, IconButton, Modal, Paper, Skeleton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Clock } from "lucide-react";
import numeral from "numeral";
import { StatusChip } from "@/components/StatusChip/StatusChip";
import type { DamagedProductDetail } from "@/services/damaged-products.service";

interface MercanciaDanadaDrawerProps {
  open: boolean;
  item: DamagedProductDetail | null;
  loading?: boolean;
  onClose: () => void;
}

const EMPTY_VALUE = "—";

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

const sectionTitleSx = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#101828",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  mb: 2,
  pb: 1,
  borderBottom: "1px solid #e4e7ec",
};

const textBlockSx = {
  border: "1px solid #e4e7ec",
  borderRadius: 1.5,
  bgcolor: "#f9fafb",
  px: 1.75,
  py: 1.25,
  fontSize: "0.875rem",
  color: "#344054",
  whiteSpace: "pre-wrap" as const,
};

const formatReportDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatWaitingDays = (days: number): string =>
  days === 1 ? "1 día" : `${days} días`;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={labelSx}>{label}</Typography>
      <Typography sx={valueSx}>{value}</Typography>
    </Box>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ ...labelSx, mb: 0.75 }}>{label}</Typography>
      <Box sx={textBlockSx}>{value}</Box>
    </Box>
  );
}

/**
 * Read-only detail of a damaged item, shared by both tabs of the screen
 * ("a recolectar" and "a reparación"). It renders exactly what
 * `GET /supplier-portal/damaged-products/:id` returns: the supplier has no
 * write action over damaged goods.
 */
export function MercanciaDanadaDrawer({
  open,
  item,
  loading = false,
  onClose,
}: MercanciaDanadaDrawerProps) {
  if (!open) return null;

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

          {item && (
            <StatusChip
              label={`${formatWaitingDays(item.waitingDays)} en espera`}
              variant="pending"
              startIcon={<Clock size={12} />}
              size="default"
            />
          )}
        </Box>

        {/* Scrollable body */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 4 }}>
          {loading && (
            <Box>
              <Skeleton variant="text" width="70%" height={32} />
              <Skeleton variant="text" width="45%" height={20} sx={{ mb: 3 }} />
              <Skeleton variant="rounded" height={140} sx={{ mb: 3 }} />
              <Skeleton variant="rounded" height={200} />
            </Box>
          )}

          {!loading && !item && (
            <Typography sx={{ ...valueSx, color: "#667085" }}>
              No se pudo cargar el detalle del artículo.
            </Typography>
          )}

          {!loading && item && (
            <>
              <Typography
                sx={{ fontWeight: 700, fontSize: "1.375rem", color: "#101828", mb: 0.5 }}
              >
                {item.productName}
              </Typography>

              <Typography sx={{ fontSize: "0.8125rem", color: "#667085", mb: 3 }}>
                Folio{" "}
                <Box component="span" sx={{ color: "#344054", fontWeight: 500 }}>
                  {item.folio}
                </Box>{" "}
                · Reportado el {formatReportDate(item.reportDate)}
              </Typography>

              {/* ── Artículo ── */}
              <Typography sx={sectionTitleSx}>Artículo</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2.5,
                  mb: 4,
                }}
              >
                <Field label="Código" value={item.productCode} />
                <Field label="Cantidad" value={String(item.quantity)} />
                <Field
                  label="Número de serie"
                  value={item.serialNumber ?? EMPTY_VALUE}
                />
                <Field label="Sucursal" value={item.branch.name} />
              </Box>

              {/* ── Daño ── */}
              <Typography sx={sectionTitleSx}>Daño</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2.5,
                  mb: 2.5,
                }}
              >
                <Field label="Origen del daño" value={item.damageOrigin} />
                <Field label="Tipo de daño" value={item.damageType} />
              </Box>

              <Box sx={{ display: "grid", gap: 2.5, mb: 4 }}>
                <TextBlock
                  label="Descripción del daño"
                  value={item.damageDescription}
                />
                <TextBlock
                  label="Observaciones"
                  value={item.observations ?? EMPTY_VALUE}
                />
              </Box>

              {/* ── Seguimiento ── */}
              <Typography sx={sectionTitleSx}>Seguimiento</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
                <Field
                  label="Fecha de reporte"
                  value={formatReportDate(item.reportDate)}
                />
                <Field
                  label="Tiempo en espera"
                  value={formatWaitingDays(item.waitingDays)}
                />
                {/* Only the "a reparación" tab carries a cost assigned to the supplier. */}
                {item.repairCost !== null && (
                  <Field
                    label="Costo de reparación"
                    value={numeral(item.repairCost).format("$0,0.00")}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Modal>
  );
}
