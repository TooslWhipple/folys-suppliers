import { styled } from "@mui/material/styles";
import { Box, TableCell } from "@mui/material";

const BORDER_COLOR = "#e4e7ec";
const FOCUS_COLOR = "#1570EF";

export const HeaderCell = styled(TableCell)({
  position: "relative",
  backgroundColor: "#ffffff",
  borderBottom: `1px solid ${BORDER_COLOR}`,
  padding: "12px 12px",
  fontSize: "0.8125rem",
  fontWeight: 400,
  color: "#667085",
  lineHeight: 1.43,
});

export const HeaderLabel = styled("span")({
  display: "block",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

/** Active zone of ~8px on the right border; the visible line is the ::after. */
export const ResizeHandle = styled(Box)({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  width: 8,
  cursor: "col-resize",
  userSelect: "none",
  outline: "none",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 1,
    backgroundColor: "transparent",
  },
  "&:hover::after": { backgroundColor: BORDER_COLOR },
  "&:focus-visible::after, &:active::after": {
    backgroundColor: FOCUS_COLOR,
  },
});
