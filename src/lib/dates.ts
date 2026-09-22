/**
 * Formateo de las fechas que sirve el API del portal.
 *
 * Son días de calendario anclados en UTC (`YYYY-MM-DD` en facturas y en el día
 * de las entregas programadas, date-time a medianoche UTC en el resto), así que
 * se formatean con `timeZone: "UTC"`: en hora local de México se correrían un
 * día hacia atrás.
 */

/** Fecha larga: `"28 de abril de 2026"`. */
export const formatLongDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * Fecha compacta sin año: `"20 abr"`, para encabezados estrechos.
 *
 * `day: "numeric"` no es cosmético: con `"2-digit"` el locale es-MX une día y
 * mes con un guion (`"20-abr"`).
 */
export const formatDayMonth = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
