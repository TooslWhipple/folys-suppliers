"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

export const DEFAULT_MAX_COLUMN_WIDTH = 800;
export const KEYBOARD_STEP = 16;
const STORAGE_VERSION = 1;
const EMPTY_WIDTHS: ColumnWidths = {};

export interface ResizableColumn {
  key: string;
  defaultWidth: number;
  minWidth: number;
  /** Defaults to `DEFAULT_MAX_COLUMN_WIDTH`. */
  maxWidth?: number;
}

export type ColumnWidths = Record<string, number>;

export interface ResizeHandleProps {
  role: "separator";
  "aria-orientation": "vertical";
  "aria-valuenow": number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  tabIndex: 0;
  style: CSSProperties;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
  onLostPointerCapture: (event: PointerEvent<HTMLElement>) => void;
  onDoubleClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const maxOf = (column: ResizableColumn): number =>
  column.maxWidth ?? DEFAULT_MAX_COLUMN_WIDTH;

/** Restricts a width to the column limits. A non finite value yields the default. */
export function clampWidth(width: number, column: ResizableColumn): number {
  const value = Number.isFinite(width) ? width : column.defaultWidth;
  return Math.round(Math.min(maxOf(column), Math.max(column.minWidth, value)));
}

export function defaultWidths(columns: ResizableColumn[]): ColumnWidths {
  return Object.fromEntries(columns.map((c) => [c.key, clampWidth(c.defaultWidth, c)]));
}

/**
 * Reads a stored value. Anything that does not match the expected shape or
 * version yields the defaults. Unknown keys are dropped, missing columns take
 * their default and every number is clamped.
 */
export function parseStoredWidths(
  raw: string | null,
  columns: ResizableColumn[],
): ColumnWidths {
  const result = defaultWidths(columns);
  if (!raw) return result;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return result;
  }
  if (typeof parsed !== "object" || parsed === null) return result;

  const { version, widths } = parsed as { version?: unknown; widths?: unknown };
  if (version !== STORAGE_VERSION) return result;
  if (typeof widths !== "object" || widths === null || Array.isArray(widths)) {
    return result;
  }

  const stored = widths as Record<string, unknown>;
  for (const column of columns) {
    const value = stored[column.key];
    if (typeof value === "number" && Number.isFinite(value)) {
      result[column.key] = clampWidth(value, column);
    }
  }
  return result;
}

export function serializeWidths(widths: ColumnWidths): string {
  return JSON.stringify({ version: STORAGE_VERSION, widths });
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode, blocked or full storage: the table works without memory.
  }
}

interface DragState {
  key: string;
  pointerId: number;
  startX: number;
  startWidth: number;
  element: HTMLElement;
  frame: number | null;
  pendingWidth: number;
}

/**
 * Column widths that the user can drag, move with the keyboard or reset, with
 * optional persistence in `localStorage` under `storageKey` (`null` keeps them
 * in memory only). The first render always uses the defaults so the server and
 * client HTML match; the stored value is applied in an effect.
 */
export function useResizableColumns(
  storageKey: string | null,
  columns: ResizableColumn[],
) {
  const [state, setState] = useState<{ key: string | null; widths: ColumnWidths }>({
    key: storageKey,
    widths: {},
  });
  // Widths loaded for another key (user switch) are ignored until the effect
  // below applies the ones that belong to the current key.
  const overrides = state.key === storageKey ? state.widths : EMPTY_WIDTHS;
  const overridesRef = useRef<ColumnWidths>({});
  const columnsRef = useRef(columns);
  const storageKeyRef = useRef(storageKey);
  const dragRef = useRef<DragState | null>(null);
  const bodyStyleRef = useRef<{ userSelect: string; cursor: string } | null>(null);

  useEffect(() => {
    columnsRef.current = columns;
    storageKeyRef.current = storageKey;
  });

  const commit = useCallback((next: ColumnWidths) => {
    overridesRef.current = next;
    setState({ key: storageKeyRef.current, widths: next });
  }, []);

  const persist = useCallback((next: ColumnWidths) => {
    const key = storageKeyRef.current;
    if (key) writeStorage(key, serializeWidths(next));
  }, []);

  useEffect(() => {
    if (!storageKey) {
      overridesRef.current = EMPTY_WIDTHS;
      return;
    }
    commit(parseStoredWidths(readStorage(storageKey), columnsRef.current));
  }, [storageKey, commit]);

  const widths = useMemo<ColumnWidths>(
    () =>
      Object.fromEntries(
        columns.map((c) => [c.key, clampWidth(overrides[c.key] ?? c.defaultWidth, c)]),
      ),
    [columns, overrides],
  );

  const totalWidth = useMemo(
    () => Object.values(widths).reduce((sum, w) => sum + w, 0),
    [widths],
  );

  const isDefault = useMemo(
    () => columns.every((c) => widths[c.key] === clampWidth(c.defaultWidth, c)),
    [columns, widths],
  );

  const setWidth = useCallback(
    (key: string, width: number, save: boolean) => {
      const column = columnsRef.current.find((c) => c.key === key);
      if (!column) return;
      const next = { ...overridesRef.current, [key]: clampWidth(width, column) };
      commit(next);
      if (save) persist(next);
    },
    [commit, persist],
  );

  const resetColumn = useCallback(
    (key: string) => {
      const column = columnsRef.current.find((c) => c.key === key);
      if (column) setWidth(key, column.defaultWidth, true);
    },
    [setWidth],
  );

  const resetAll = useCallback(() => {
    const next = defaultWidths(columnsRef.current);
    commit(next);
    persist(next);
  }, [commit, persist]);

  const restoreBody = useCallback(() => {
    if (!bodyStyleRef.current) return;
    document.body.style.userSelect = bodyStyleRef.current.userSelect;
    document.body.style.cursor = bodyStyleRef.current.cursor;
    bodyStyleRef.current = null;
  }, []);

  const endDrag = useCallback(
    (save: boolean) => {
      const drag = dragRef.current;
      if (!drag) return;
      dragRef.current = null;
      if (drag.frame !== null) cancelAnimationFrame(drag.frame);
      if (drag.element.hasPointerCapture(drag.pointerId)) {
        drag.element.releasePointerCapture(drag.pointerId);
      }
      restoreBody();
      setWidth(drag.key, drag.pendingWidth, save);
    },
    [restoreBody, setWidth],
  );

  useEffect(
    () => () => {
      const drag = dragRef.current;
      if (drag) {
        dragRef.current = null;
        if (drag.frame !== null) cancelAnimationFrame(drag.frame);
        if (drag.element.hasPointerCapture(drag.pointerId)) {
          drag.element.releasePointerCapture(drag.pointerId);
        }
      }
      restoreBody();
    },
    [restoreBody],
  );

  const getResizeHandleProps = useCallback(
    (key: string): ResizeHandleProps => {
      const column = columns.find((c) => c.key === key);
      const min = column?.minWidth ?? 0;
      const max = column ? maxOf(column) : DEFAULT_MAX_COLUMN_WIDTH;

      return {
        role: "separator",
        "aria-orientation": "vertical",
        "aria-valuenow": widths[key] ?? min,
        "aria-valuemin": min,
        "aria-valuemax": max,
        tabIndex: 0,
        style: { touchAction: "none" },
        onPointerDown: (event) => {
          if (event.button !== 0 && event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          const current = widths[key] ?? min;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragRef.current = {
            key,
            pointerId: event.pointerId,
            startX: event.clientX,
            startWidth: current,
            element: event.currentTarget,
            frame: null,
            pendingWidth: current,
          };
          bodyStyleRef.current = {
            userSelect: document.body.style.userSelect,
            cursor: document.body.style.cursor,
          };
          document.body.style.userSelect = "none";
          document.body.style.cursor = "col-resize";
        },
        onPointerMove: (event) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== event.pointerId) return;
          const target = columnsRef.current.find((c) => c.key === drag.key);
          if (!target) return;
          drag.pendingWidth = clampWidth(
            drag.startWidth + event.clientX - drag.startX,
            target,
          );
          if (drag.frame !== null) return;
          drag.frame = requestAnimationFrame(() => {
            drag.frame = null;
            setWidth(drag.key, drag.pendingWidth, false);
          });
        },
        onPointerUp: () => endDrag(true),
        onPointerCancel: () => endDrag(true),
        onLostPointerCapture: () => endDrag(true),
        onDoubleClick: () => resetColumn(key),
        onKeyDown: (event) => {
          const current = widths[key] ?? min;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setWidth(key, current - KEYBOARD_STEP, true);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            setWidth(key, current + KEYBOARD_STEP, true);
          } else if (event.key === "Home") {
            event.preventDefault();
            resetColumn(key);
          }
        },
      };
    },
    [columns, widths, setWidth, resetColumn, endDrag],
  );

  return { widths, totalWidth, isDefault, getResizeHandleProps, resetColumn, resetAll };
}
