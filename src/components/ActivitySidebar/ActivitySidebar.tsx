"use client";

import { Box, Typography, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Sparkles } from "lucide-react";
import { colors } from "@/lib/theme";
import { actividadReciente, ActivityItem } from "@/mocks/data";

const SidebarContainer = styled(Box)({
  width: 280,
  backgroundColor: colors.background.sidebar,
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  padding: "20px",
  height: "fit-content",
});

const TimelineContainer = styled(Box)({
  position: "relative",
  paddingLeft: "20px",
});

const TimelineLine = styled(Box)({
  position: "absolute",
  left: "3px",
  top: "6px",
  bottom: "6px",
  width: "1px",
  backgroundColor: colors.border,
});

const ActivityItemContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "6px 0",
  position: "relative",
});

const TimelineDot = styled(Box)({
  position: "absolute",
  left: "-20px",
  top: "8px",
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: colors.border,
  flexShrink: 0,
});

interface ActivityItemProps {
  item: ActivityItem;
}

function ActivityItemComponent({ item }: ActivityItemProps) {
  return (
    <ActivityItemContainer>
      <TimelineDot />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: colors.sidebar.textSelected,
          }}
        >
          {item.pedidoId}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.text.primary,
            fontWeight: 500,
          }}
        >
          {item.label}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: colors.text.secondary,
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        {item.date}
      </Typography>
    </ActivityItemContainer>
  );
}

export function ActivitySidebar() {
  return (
    <SidebarContainer>
      <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
        <Sparkles size={20} color={colors.sidebar.textSelected} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Actividad reciente
        </Typography>
      </Stack>

      <TimelineContainer>
        <TimelineLine />
        {actividadReciente.map((item) => (
          <ActivityItemComponent key={item.id} item={item} />
        ))}
      </TimelineContainer>
    </SidebarContainer>
  );
}
