import PedidoDetailClient from "./PedidoDetailClient";

// Required for static export with dynamic routes
export function generateStaticParams() {
  // Return some sample order IDs for static generation
  // In production, you might want to fetch actual IDs from the API at build time
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "10" },
    { id: "15" },
    { id: "20" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PedidoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  return <PedidoDetailClient orderId={orderId} />;
}
