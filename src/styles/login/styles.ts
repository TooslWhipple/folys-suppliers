import { styled } from "@mui/material/styles";
import { Box, Link, TextField } from "@mui/material";
import { colors } from "@/lib/theme";

export const PageContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  overflow: "hidden",
});

export const LeftPanel = styled(Box)({
  flex: "0 0 42%",
  minHeight: "100vh",
  backgroundImage: "url(/backgrounds/login-background.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  "@media (max-width: 900px)": {
    display: "none",
  },
});

export const RightPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper,
  padding: "48px 0px",
}));

export const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "560px",
  gap: "32px",
  padding: "0 24px",
});

export const LogoContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "64px",
});

export const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "24px",
});

export const RecoveryRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  flexWrap: "wrap",
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
    "& fieldset": {
      borderColor: colors.border,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.text.secondary,
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.sidebar.textSelected,
      borderWidth: "1px",
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.text.secondary,
  },
}));

export const BackLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 4,
  alignSelf: "flex-start",
  fontSize: 14,
  cursor: "pointer",
  textDecoration: "none",
  color: theme.palette.text.secondary,
  backgroundColor: "transparent",
  border: "none",
  padding: 0,
  marginBottom: 0,
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));

export const RecoveryLink = styled(Link)({
  fontSize: 14,
  fontWeight: 500,
  color: colors.sidebar.textSelected,
  cursor: "pointer",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});
