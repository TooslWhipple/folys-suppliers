import { styled } from "@mui/material/styles";
import { Box, IconButton, Typography } from "@mui/material";
import { colors } from "@/lib/theme";

export const FieldWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  // The picker renders its own field (`PickersOutlinedInput`), so the height
  // and background that match the `TabFilters` search box are applied from the
  // wrapper instead of swapping the field for a plain `TextField`.
  "& .MuiPickersOutlinedInput-root": {
    height: 36,
    backgroundColor: colors.background.sidebar,
  },
});

export const FieldLabel = styled(Typography)({
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: colors.text.secondary,
  marginBottom: "4px",
});

export const StyledOpenPickerButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  marginRight: theme.spacing(0.25),
  color: colors.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.Mui-disabled": {
    color: theme.palette.action.disabled,
  },
}));
