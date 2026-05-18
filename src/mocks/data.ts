export const proveedorData = {
  nombre: "Mabe S.A de C.V.",
  usuario: {
    nombre: "Andrea Montes",
    email: "andrea.m@proveedor.com",
    avatar: "AM",
  },
};

export const statsData = [
  {
    id: "1",
    label: "Costo de reparaciones",
    value: 25980.0,
    isCurrency: true,
  },
  {
    id: "2",
    label: "Total de pagos pendientes",
    value: 870369.42,
    isCurrency: true,
  },
  {
    id: "3",
    label: "Total a pagar",
    value: 844389.42,
    isCurrency: true,
  },
];

export const facturasPendientes = [
  {
    id: "1",
    fecha: "01, Junio de 2025",
    pedido: "12345",
    estatus: "Pendiente",
    total: 520560.4,
  },
  {
    id: "2",
    fecha: "15, Mayo de 2025",
    pedido: "12346",
    estatus: "Pendiente",
    total: 349809.02,
  },
  {
    id: "3",
    fecha: "28, Abril de 2025",
    pedido: "12347",
    estatus: "Pendiente",
    total: 287450.15,
  },
];

export const pedidosPendientes = [
  {
    id: "1",
    pedido: "12345",
    fecha: "01, Junio de 2025",
    articulosSolicitados: 15,
    estatus: "Pendiente",
    pago: "Pendiente",
    total: 290123.14,
  },
  {
    id: "2",
    pedido: "12346",
    fecha: "15, Mayo de 2025",
    articulosSolicitados: 22,
    estatus: "Pendiente",
    pago: "Pendiente",
    total: 245890.5,
  },
  {
    id: "3",
    pedido: "12347",
    fecha: "28, Abril de 2025",
    articulosSolicitados: 18,
    estatus: "Pendiente",
    pago: "Pendiente",
    total: 378560.22,
  },
];

export type ActivityType = "pedido_recibido" | "pago_recibido" | "pedido_descargado" | "pedido_realizado";

export interface ActivityItem {
  id: string;
  pedidoId: string;
  type: ActivityType;
  label: string;
  date: string;
}

export interface MercanciaDanada {
  id: string;
  reportado: string;
  articulo: string;
  generada: string;
  dano: string;
  estatus: "Por recolectar" | "Recolectado";
  tiempo: string;
}

export const mercanciaDanada: MercanciaDanada[] = [
  {
    id: "1",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "2 meses",
  },
  {
    id: "2",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "2 meses",
  },
  {
    id: "3",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "1 mes",
  },
  {
    id: "4",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "1 mes",
  },
  {
    id: "5",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "1 mes",
  },
  {
    id: "6",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "1 mes",
  },
  {
    id: "7",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "15 días",
  },
  {
    id: "8",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "15 días",
  },
  {
    id: "9",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "12 días",
  },
  {
    id: "10",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Defecto de fábrica",
    estatus: "Por recolectar",
    tiempo: "5 días",
  },
];

export interface SolicitudRefaccion {
  id: string;
  solicitado: string;
  articulo: string;
  generada: string;
  refaccion: string;
  estatus: "Por entregar" | "Entregado";
  tiempo: string;
}

export const solicitudesRefacciones: SolicitudRefaccion[] = [
  {
    id: "1",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "2 meses",
  },
  {
    id: "2",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "2 meses",
  },
  {
    id: "3",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "1 mes",
  },
  {
    id: "4",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "1 mes",
  },
  {
    id: "5",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "1 mes",
  },
  {
    id: "6",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "1 mes",
  },
  {
    id: "7",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "1 mes",
  },
  {
    id: "8",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Entregado",
    tiempo: "15 días",
  },
  {
    id: "9",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Entregado",
    tiempo: "12 días",
  },
  {
    id: "10",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Entregado",
    tiempo: "5 días",
  },
];

export interface VentasMensuales {
  mes: string;
  enviados: number;
}

export interface ArticuloCatalogo {
  id: string;
  sku: string;
  nombre: string;
  imagen: string;
  unidades: number;
  unidadesStatus: "critical" | "warning" | "good";
  enviadosUltAno: number;
  enviadosUltMes: number;
  enviadosMesActual: number;
  ventasMensuales: VentasMensuales[];
  estatus: "activo" | "archivado";
}

export const articulosCatalogo: ArticuloCatalogo[] = [
  {
    id: "1",
    sku: "04ET-876543",
    nombre: "Licuadora Oster 10 Velocidades BLSTMB-CBG-013 Negra",
    imagen: "/images/placeholder-product.png",
    unidades: 45,
    unidadesStatus: "warning",
    enviadosUltAno: 156,
    enviadosUltMes: 32,
    enviadosMesActual: 38,
    ventasMensuales: [
      { mes: "Feb", enviados: 12 },
      { mes: "Mar", enviados: 18 },
      { mes: "Abr", enviados: 25 },
      { mes: "May", enviados: 32 },
      { mes: "Jun", enviados: 38 },
    ],
    estatus: "activo",
  },
  {
    id: "2",
    sku: "04ET-345678",
    nombre: "Microondas Whirlpool 1.1 pies WMH31017HS Gris",
    imagen: "/images/placeholder-product.png",
    unidades: 25,
    unidadesStatus: "warning",
    enviadosUltAno: 124,
    enviadosUltMes: 28,
    enviadosMesActual: 31,
    ventasMensuales: [
      { mes: "Feb", enviados: 15 },
      { mes: "Mar", enviados: 20 },
      { mes: "Abr", enviados: 22 },
      { mes: "May", enviados: 28 },
      { mes: "Jun", enviados: 31 },
    ],
    estatus: "activo",
  },
  {
    id: "3",
    sku: "04ET-789012",
    nombre: "Lavadora LG 19kg WM19WVC2S6 Plata con TurboDrum",
    imagen: "/images/placeholder-product.png",
    unidades: 15,
    unidadesStatus: "critical",
    enviadosUltAno: 89,
    enviadosUltMes: 18,
    enviadosMesActual: 22,
    ventasMensuales: [
      { mes: "Feb", enviados: 8 },
      { mes: "Mar", enviados: 12 },
      { mes: "Abr", enviados: 15 },
      { mes: "May", enviados: 18 },
      { mes: "Jun", enviados: 22 },
    ],
    estatus: "activo",
  },
  {
    id: "4",
    sku: "04ET-567890",
    nombre: "Secadora Mabe 20kg SMG26N5MNBABO Blanca",
    imagen: "/images/placeholder-product.png",
    unidades: 12,
    unidadesStatus: "critical",
    enviadosUltAno: 67,
    enviadosUltMes: 14,
    enviadosMesActual: 16,
    ventasMensuales: [
      { mes: "Feb", enviados: 6 },
      { mes: "Mar", enviados: 9 },
      { mes: "Abr", enviados: 11 },
      { mes: "May", enviados: 14 },
      { mes: "Jun", enviados: 16 },
    ],
    estatus: "activo",
  },
];

export const actividadReciente: ActivityItem[] = [
  {
    id: "1",
    pedidoId: "32156",
    type: "pedido_recibido",
    label: "Pedido recibido",
    date: "12 Ago",
  },
  {
    id: "2",
    pedidoId: "32156",
    type: "pago_recibido",
    label: "Pago recibido",
    date: "03 Ago",
  },
  {
    id: "3",
    pedidoId: "32156",
    type: "pago_recibido",
    label: "Pago recibido",
    date: "27 Jul",
  },
  {
    id: "4",
    pedidoId: "32156",
    type: "pedido_descargado",
    label: "Pedido descargado",
    date: "20 Jul",
  },
  {
    id: "5",
    pedidoId: "32156",
    type: "pedido_recibido",
    label: "Pedido recibido",
    date: "28 May",
  },
  {
    id: "6",
    pedidoId: "32156",
    type: "pago_recibido",
    label: "Pago recibido",
    date: "12 May",
  },
  {
    id: "7",
    pedidoId: "32156",
    type: "pedido_realizado",
    label: "Pedido realizado",
    date: "20 Feb",
  },
  {
    id: "8",
    pedidoId: "32156",
    type: "pago_recibido",
    label: "Pago recibido",
    date: "18 Feb",
  },
];
