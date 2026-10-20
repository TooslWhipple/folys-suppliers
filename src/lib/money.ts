import numeral from "numeral";

/** Tasa de IVA aplicada a los pedidos del portal (misma que el back). */
const SUPPLIER_ORDER_VAT_RATE = 0.16;
const BASE_CURRENCY = "MXN";

/** Redondea a centavos corrigiendo el error de punto flotante. */
function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Formatea un monto con 2 decimales: "$3,115.00". Si la moneda existe y no es
 * MXN se agrega el código: "$3,115.00 USD". Negativos: "-$1,200.00".
 * null/undefined/NaN se muestran como "$0.00".
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency?: string | null,
  options?: { symbol?: string },
): string {
  const symbol = options?.symbol ?? "$";
  const parsed = typeof value === "string" ? Number(value) : value;
  const amount = typeof parsed === "number" && Number.isFinite(parsed) ? parsed : 0;
  const body = numeral(Math.abs(amount)).format("0,0.00");
  const sign = amount < 0 && body !== "0.00" ? "-" : "";
  const suffix = currency && currency !== BASE_CURRENCY ? ` ${currency}` : "";
  return `${sign}${symbol}${body}${suffix}`;
}

export interface OrderTotalsLine {
  unitPrice: number;
  quantity: number;
  currency: string | null;
  exchangeRate: number | null;
}

/**
 * Tipo de cambio efectivo de una línea (misma regla que el back,
 * `resolveExchangeRate` en `order-totals.ts`): el de la línea si es > 0; si no,
 * el del producto, solo cuando su moneda (nulo = MXN) coincide con la de la
 * línea y es > 0; en otro caso null (la línea se cuenta como pesos).
 */
export function resolveExchangeRate(
  line: { currency: string | null; exchangeRate: number | null },
  product?: { currency: string | null; exchangeRate: number | null } | null,
): number | null {
  if (line.exchangeRate != null && line.exchangeRate > 0) {
    return line.exchangeRate;
  }
  if (
    product &&
    (product.currency ?? BASE_CURRENCY) === (line.currency ?? BASE_CURRENCY) &&
    product.exchangeRate != null &&
    product.exchangeRate > 0
  ) {
    return product.exchangeRate;
  }
  return null;
}

/**
 * Totales de un pedido. Misma fórmula y regla de moneda que el back
 * (`order-totals.ts`): solo se usa para el recálculo en vivo al editar.
 * Monedas iguales (nulo = MXN) → totales en esa moneda sin convertir;
 * mezcladas → cada línea a MXN con su tipo de cambio y totales en "MXN".
 */
export function calculateOrderTotals(lines: OrderTotalsLine[]): {
  currency: string;
  subtotal: number;
  iva: number;
  total: number;
} {
  const currencies = new Set(lines.map((l) => l.currency ?? BASE_CURRENCY));
  const mixed = currencies.size > 1;
  const currency = mixed ? BASE_CURRENCY : (currencies.values().next().value ?? BASE_CURRENCY);

  const sum = lines.reduce((acc, l) => {
    const amount = l.unitPrice * l.quantity;
    const converted =
      mixed && l.currency && l.currency !== BASE_CURRENCY && l.exchangeRate
        ? amount * l.exchangeRate
        : amount;
    return acc + converted;
  }, 0);

  const subtotal = roundToCents(sum);
  const iva = roundToCents(subtotal * SUPPLIER_ORDER_VAT_RATE);
  const total = roundToCents(subtotal + iva);
  return { currency, subtotal, iva, total };
}
