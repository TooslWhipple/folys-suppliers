import { facturasDetalle } from "@/mocks/data";
import { FacturaDetalleClient } from "./FacturaDetalleClient";

export function generateStaticParams() {
  return Object.keys(facturasDetalle).map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FacturaDetallePage({ params }: PageProps) {
  const { id } = await params;
  const factura = facturasDetalle[id] || null;

  return <FacturaDetalleClient factura={factura} id={id} />;
}
