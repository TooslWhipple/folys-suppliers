import type { ReactNode } from "react";
import type { TableCellProps } from "@mui/material";
import type { ResizeHandleProps } from "@/hooks/useResizableColumns";
import { HeaderCell, HeaderLabel, ResizeHandle } from "./styles";

export interface ResizableHeaderCellProps {
  label: ReactNode;
  /** Plain text used for `title` and the handle `aria-label`. */
  labelText: string;
  align?: TableCellProps["align"];
  /** Props returned by `getResizeHandleProps(key)` of `useResizableColumns`. */
  handleProps: ResizeHandleProps;
}

export function ResizableHeaderCell({
  label,
  labelText,
  align = "left",
  handleProps,
}: ResizableHeaderCellProps) {
  return (
    <HeaderCell align={align} title={labelText}>
      <HeaderLabel>{label}</HeaderLabel>
      <ResizeHandle
        {...handleProps}
        aria-label={`Redimensionar columna ${labelText}`}
        onClick={(event) => event.stopPropagation()}
      />
    </HeaderCell>
  );
}
