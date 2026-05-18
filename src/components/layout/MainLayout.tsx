"use client";

import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { CONTENT_PADDING, colors } from "@/lib/theme";

const LayoutContainer = styled(Box)({
  display: "flex",
  minHeight: "100vh",
});

const MainContent = styled("main")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
  overflow: "hidden",
});

const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: CONTENT_PADDING,
  backgroundColor: colors.background.main,
  position: "relative",
  overflow: "auto",
  [theme.breakpoints.down("md")]: {
    paddingTop: 72,
    padding: 16,
  },
  [theme.breakpoints.down("sm")]: {
    padding: 12,
    paddingTop: 64,
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  left: 16,
  top: 16,
  width: 40,
  height: 40,
  backgroundColor: colors.background.sidebar,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  zIndex: 10,
  "&:hover": {
    backgroundColor: colors.background.sidebar,
  },
  [theme.breakpoints.down("sm")]: {
    left: 12,
    top: 12,
    width: 36,
    height: 36,
  },
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <LayoutContainer>
      <Sidebar open={mobileOpen} onClose={handleCloseMobile} />
      <MainContent>
        <ContentWrapper>
          {isMobile && (
            <MobileMenuButton onClick={handleToggleMobile}>
              <Menu size={20} />
            </MobileMenuButton>
          )}
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}
