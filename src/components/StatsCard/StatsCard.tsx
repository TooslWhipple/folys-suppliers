"use client";

import numeral from "numeral";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowDown, ArrowUp } from "lucide-react";
import { colors } from "@/lib/theme";

const CardContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  backgroundColor: colors.background.sidebar,
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
});

export interface StatsCardData {
  id: string;
  label: string;
  value: number;
  comparison?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  icon?: React.ReactNode;
  valueColor?: string;
  isCurrency?: boolean;
}

interface StatsCardProps {
  label: string;
  value: number;
  comparison?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  icon?: React.ReactNode;
  isCurrency?: boolean;
}

export function StatsCard({
  label,
  value,
  comparison,
  icon,
  isCurrency = false,
}: StatsCardProps) {
  const formatValue = (val: number): string => {
    if (isCurrency) {
      return numeral(val).format("$0,0.00");
    }
    return numeral(val).format("0,0");
  };

  const formatComparisonValue = (val: number): string => {
    if (isCurrency) {
      return numeral(val).format("$0,0.00");
    }
    return numeral(val).format("0,0");
  };

  const getComparisonText = (): string => {
    if (!comparison) return "";
    const prefix = comparison.type === "increase" ? "más" : "menos";
    return `${formatComparisonValue(comparison.value)} ${prefix} que ${comparison.period}`;
  };

  return (
    <CardContainer>
      {icon && (
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
          {icon}
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ color: colors.text.secondary, mb: 0.5 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {formatValue(value)}
        </Typography>
        {comparison?.type === "increase" ? (
          <ArrowUp size={16} color="#DC2626" />
        ) : comparison?.type === "decrease" ? (
          <ArrowDown size={16} color="#4ADE80" />
        ) : null}
      </Stack>
      {comparison && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {getComparisonText()}
        </Typography>
      )}
    </CardContainer>
  );
}

interface StatsCardGroupProps {
  cards: StatsCardData[];
  columns?: number;
}

export function StatsCardGroup({ cards }: StatsCardGroupProps) {
  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            label={card.label}
            value={card.value}
            comparison={card.comparison}
            icon={card.icon}
            isCurrency={card.isCurrency}
          />
        </Grid>
      ))}
    </Grid>
  );
}
