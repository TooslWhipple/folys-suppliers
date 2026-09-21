import { FacturaDetalleClient } from "./FacturaDetalleClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FacturaDetallePage({ params }: PageProps) {
  const { id } = await params;
  const invoiceId = parseInt(id, 10);

  return <FacturaDetalleClient invoiceId={invoiceId} />;
}
