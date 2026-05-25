"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LayoutDashboard,
  Truck,
  PackageX,
  Handshake,
  BookOpen,
  FileText,
  Receipt,
  Menu,
} from "lucide-react";
import { SIDEBAR_WIDTH, colors } from "@/lib/theme";

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile?: boolean }>(({ isMobile }) => ({
  width: isMobile ? 0 : SIDEBAR_WIDTH,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: SIDEBAR_WIDTH,
    boxSizing: "border-box",
    backgroundColor: colors.background.sidebar,
    borderRight: `1px solid ${colors.border}`,
  },
}));

const LogoContainer = styled(Box)({
  padding: "16px",
  borderBottom: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const NavigationContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  padding: "16px 8px 0px",
  gap: "8px",
  overflowY: "auto",
});

const NavItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ active }) => ({
  backgroundColor: active ? colors.sidebar.itemSelected : "transparent",
  color: active ? colors.sidebar.textSelected : "inherit",
  padding: "8px 12px",
  borderRadius: "6px",
  marginBottom: "4px",
  "&:hover": {
    backgroundColor: active ? colors.sidebar.itemSelected : "rgba(0, 0, 0, 0.04)",
  },
}));

const NavItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ active }) => ({
  minWidth: 24,
  marginRight: 8,
  color: active ? colors.sidebar.textSelected : "inherit",
  "& svg": {
    width: 16,
    height: 16,
    flexShrink: 0,
  },
}));

const UserProfileContainer = styled(Box)({
  padding: "12px 16px",
  borderTop: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

const UserAvatar = styled(Avatar)({
  width: 32,
  height: 32,
  flexShrink: 0,
});

const UserInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

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

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const ICON_SIZE = 16;

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard size={ICON_SIZE} /> },
  { label: "Pedidos", path: "/pedidos", icon: <Truck size={ICON_SIZE} /> },
  { label: "Mercancía dañada", path: "/mercancia-danada", icon: <PackageX size={ICON_SIZE} /> },
  { label: "Solicitudes de refacciones", path: "/solicitudes-refacciones", icon: <Handshake size={ICON_SIZE} /> },
  { label: "Catálogo de artículos", path: "/catalogo", icon: <BookOpen size={ICON_SIZE} /> },
  { label: "Facturas", path: "/facturas", icon: <FileText size={ICON_SIZE} /> },
  { label: "Estados de cuenta", path: "/estados-de-cuenta", icon: <Receipt size={ICON_SIZE} /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const drawerContent = (
    <>
      <LogoContainer>
        <Box
          sx={{
            width: 32,
            height: 32,
            backgroundColor: colors.sidebar.textSelected,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: 700, fontSize: "14px" }}>
            F
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            FolySoft
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Proveedores
          </Typography>
        </Box>
      </LogoContainer>

      <NavigationContainer>
        <List sx={{ padding: 0 }}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} passHref style={{ textDecoration: "none" }}>
              <NavItemButton active={isActive(item.path)} onClick={isMobile ? onClose : undefined}>
                <NavItemIcon active={isActive(item.path)}>{item.icon}</NavItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight: isActive(item.path) ? 600 : 500,
                    },
                  }}
                />
              </NavItemButton>
            </Link>
          ))}
        </List>
      </NavigationContainer>

      <UserProfileContainer>
        <UserAvatar sx={{ bgcolor: "#7C3AED" }}>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "white" }}>
            AM
          </Typography>
        </UserAvatar>
        <UserInfo>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            Andrea Montes
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.3 }}>
            andrea.m@proveedor.com
          </Typography>
        </UserInfo>
      </UserProfileContainer>
    </>
  );

  return (
    <>
      <StyledDrawer variant={isMobile ? "temporary" : "permanent"} open={open} onClose={onClose} isMobile={isMobile}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {drawerContent}
        </Box>
      </StyledDrawer>
      {isMobile && (
        <MobileMenuButton onClick={() => {}}>
          <Menu size={20} />
        </MobileMenuButton>
      )}
    </>
  );
}
