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
    label: "Total de cobros pendientes",
    value: 870369.42,
    isCurrency: true,
  },
  {
    id: "2",
    label: "Cargos a proveedor",
    value: 25980.0,
    isCurrency: true,
  },
  {
    id: "3",
    label: "Total a cobrar",
    value: 844389.42,
    isCurrency: true,
  },
];

export const facturasPendientes = [
  {
    id: "1",
    fecha: "30, Abril de 2026",
    descripcion: "Nota de crédito por ajuste en recepción de mercancía",
    estatus: "Pendiente",
    total: 29910.45,
  },
  {
    id: "2",
    fecha: "16, Abril de 2026",
    descripcion: "Referente a pedidos 12345, 12346",
    estatus: "Pendiente",
    total: 520560.40,
  },
  {
    id: "3",
    fecha: "13, Abril de 2026",
    descripcion: "Referente a pedidos 4321, 4322",
    estatus: "Pendiente",
    total: 349809.02,
  },
];

export const pedidosPendientes = [
  {
    id: "1",
    pedido: "12345",
    fecha: "13, Abril de 2026",
    articulosSolicitados: 15,
    estatus: "Pendiente",
    pago: "Pendiente",
    total: 290123.14,
  },
  {
    id: "2",
    pedido: "12345",
    fecha: "13, Abril de 2026",
    articulosSolicitados: 22,
    estatus: "Pendiente",
    pago: "Pendiente",
    total: 290123.14,
  },
];

export interface EntregaProducto {
  nombre: string;
  cantidad: number;
}

export interface EntregaGrupo {
  fecha: string;
  totalArticulos: number;
  productos: EntregaProducto[];
}

export const entregasProgramadas: EntregaGrupo[] = [
  {
    fecha: "Dic, 12",
    totalArticulos: 2,
    productos: [
      { nombre: "Secadora Mabe 20kg SMG26N5MNBAB0 Blanca", cantidad: 15 },
      { nombre: "Secadora Mabe 15kg SMG26N5MNBAB0 Blanca", cantidad: 10 },
    ],
  },
  {
    fecha: "Dic, 19",
    totalArticulos: 3,
    productos: [
      { nombre: "Secadora Mabe 20kg SMG26N5MNBAB0 Blanca", cantidad: 8 },
      { nombre: "Lacadora Mabe 25kg SMG26N5MNBAB0 Blanca", cantidad: 12 },
      { nombre: "Lavadora Mabe 15kg SMG26N5MNBAB0 Blanca", cantidad: 20 },
    ],
  },
  {
    fecha: "Dic, 27",
    totalArticulos: 1,
    productos: [
      { nombre: "Secadora Mabe 20kg SMG26N5MNBAB0 Blanca", cantidad: 5 },
    ],
  },
];

export interface PagoItem {
  id: string;
  fecha: string;
  monto: number;
  pendiente?: boolean;
}

export const pagosProgramados: PagoItem[] = [
  { id: "1", fecha: "30 de Mar, 2026", monto: 455060.0, pendiente: true },
];

export const historialPagos: PagoItem[] = [
  { id: "1", fecha: "28 de abril, 2026", monto: 290450.0 },
  { id: "2", fecha: "15 de abril, 2026", monto: 34980.0 },
  { id: "3", fecha: "01 de abril, 2026", monto: 290450.0 },
  { id: "4", fecha: "03 de marzo, 2026", monto: 384921.0 },
  { id: "5", fecha: "15 de febrero, 2026", monto: 384921.0 },
  { id: "6", fecha: "02 de febrero, 2026", monto: 384921.0 },
  { id: "7", fecha: "17 de enero, 2026", monto: 384921.0 },
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

export interface MercanciaDanadaDetail extends MercanciaDanada {
  generadaPor: string;
  fechaCompleta: string;
  hora: string;
  proveedor: string;
  formaEntrega: string;
  cantidad: number;
  numeroSerie: string;
  descripcionDano: string;
  observaciones: string;
  evidencias: string[];
  // Indicaciones tab
  queHaraArticulo: string;
  quienRealiza: string;
  domicilioRecoleccion: string;
  fechaARealizar: string;
  tipoDano: string;
  autorizo: string;
  // Solución tab
  solucionEntregada: string;
  autorizadoPor: string;
}

export interface SolicitudRefaccionDetail {
  id: string;
  solicitado: string;
  articulo: string;
  generada: string;
  refaccion: string;
  estatus: string;
  tiempo: string;
  generadaPor: string;
  fechaCompleta: string;
  hora: string;
  proveedor: string;
  formaEntrega: string;
  cantidad: number;
  numeroSerie: string;
  descripcionDano: string;
  observaciones: string;
  evidencias: string[];
  // Indicaciones tab
  queHaraArticulo: string;
  quienRealizaReparacion: string;
  tipoDano: string;
  refaccionSolicitada: string;
  autorizo: string;
  // Solución tab
  solucionEntregada: string;
  autorizadoPor: string;
}

export const solicitudesRefaccionDetalle: SolicitudRefaccionDetail[] = [
  {
    id: "1",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "2 meses",
    generadaPor: "Gustavo Alfonso Fuentes",
    fechaCompleta: "21 de Mayo, 2025",
    hora: "11:45 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "123456788990",
    descripcionDano: "El cliente comenta que se ha hundido una parte del asiento del sofá a los pocos días de comprarlo.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealizaReparacion: "Foly",
    tipoDano: "Raspones o rayones",
    refaccionSolicitada: "Pieza faltante en respaldo",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "2",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Pieza faltante en respaldo",
    estatus: "Por entregar",
    tiempo: "2 meses",
    generadaPor: "Gustavo Alfonso Fuentes",
    fechaCompleta: "21 de Mayo, 2025",
    hora: "10:30 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "987654321000",
    descripcionDano: "La lavadora no enciende después de su primera instalación. El panel de control no responde.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealizaReparacion: "Foly",
    tipoDano: "Defecto eléctrico",
    refaccionSolicitada: "Tarjeta de control",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de tarjeta",
    autorizadoPor: "Proveedor",
  },
  {
    id: "3",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Sello de puerta",
    estatus: "Por entregar",
    tiempo: "1 mes",
    generadaPor: "Gustavo Alfonso Fuentes",
    fechaCompleta: "20 de Junio, 2025",
    hora: "09:00 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "112233445566",
    descripcionDano: "Fuga de agua por la puerta durante el ciclo de lavado.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealizaReparacion: "Proveedor",
    tipoDano: "Defecto de sello",
    refaccionSolicitada: "Sello de puerta",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de sello",
    autorizadoPor: "Proveedor",
  },
  {
    id: "4",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Cajón de detergente",
    estatus: "Por entregar",
    tiempo: "1 mes",
    generadaPor: "Julio Huerta",
    fechaCompleta: "20 de Junio, 2025",
    hora: "02:15 pm",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "223344556677",
    descripcionDano: "El cajón del detergente no cierra correctamente y cae durante el uso.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealizaReparacion: "Proveedor",
    tipoDano: "Defecto de fábrica",
    refaccionSolicitada: "Cajón de detergente",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "5",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Amortiguadores",
    estatus: "Por entregar",
    tiempo: "1 mes",
    generadaPor: "Julio Huerta",
    fechaCompleta: "18 de Junio, 2025",
    hora: "11:00 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "334455667788",
    descripcionDano: "Vibración excesiva en el ciclo de centrifugado, causando desplazamiento del equipo.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Revisión técnica",
    quienRealizaReparacion: "Foly",
    tipoDano: "Defecto mecánico",
    refaccionSolicitada: "Amortiguadores",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de amortiguadores",
    autorizadoPor: "Proveedor",
  },
  {
    id: "6",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Sensor de temperatura",
    estatus: "Por entregar",
    tiempo: "1 mes",
    generadaPor: "Julio Huerta",
    fechaCompleta: "17 de Junio, 2025",
    hora: "03:45 pm",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "445566778899",
    descripcionDano: "La pantalla muestra código de error E5 de manera constante.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealizaReparacion: "Foly",
    tipoDano: "Defecto eléctrico",
    refaccionSolicitada: "Sensor de temperatura",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de sensor",
    autorizadoPor: "Proveedor",
  },
  {
    id: "7",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Tina interior",
    estatus: "Por entregar",
    tiempo: "15 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "01 de Julio, 2025",
    hora: "08:30 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "556677889900",
    descripcionDano: "Mancha de óxido en la tina interior desde la entrega.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Evaluación",
    quienRealizaReparacion: "Proveedor",
    tipoDano: "Raspones o rayones",
    refaccionSolicitada: "Tina interior",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "8",
    solicitado: "16 Nov 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Marco de puerta",
    estatus: "Por entregar",
    tiempo: "15 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "01 de Julio, 2025",
    hora: "10:00 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "667788990011",
    descripcionDano: "La puerta de la lavadora presenta golpe visible en el marco desde la instalación.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reemplazo",
    quienRealizaReparacion: "Proveedor",
    tipoDano: "Raspones o rayones",
    refaccionSolicitada: "Marco de puerta",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de puerta",
    autorizadoPor: "Proveedor",
  },
  {
    id: "9",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Actualización firmware",
    estatus: "Entregado",
    tiempo: "12 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "03 de Julio, 2025",
    hora: "09:15 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "778899001122",
    descripcionDano: "Error en el programa de lavado rápido, no inicia el ciclo.",
    observaciones: "Cliente satisfecho con la atención recibida.",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealizaReparacion: "Foly",
    tipoDano: "Defecto de software",
    refaccionSolicitada: "Actualización firmware",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "10",
    solicitado: "15 Julio 2025",
    articulo: "Sofá cama Verona Gris 1 pieza",
    generada: "Julio Huerta",
    refaccion: "Conector de agua",
    estatus: "Entregado",
    tiempo: "5 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "10 de Julio, 2025",
    hora: "04:00 pm",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "889900112233",
    descripcionDano: "La lavadora presenta goteo en el conector trasero de agua fría.",
    observaciones: "No requirió reemplazo de unidad.",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealizaReparacion: "Proveedor",
    tipoDano: "Defecto de sello",
    refaccionSolicitada: "Conector de agua",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
];

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

export const mercanciaDanadaDetalle: MercanciaDanadaDetail[] = [
  {
    id: "1",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Sofá hundido",
    estatus: "Por recolectar",
    tiempo: "2 meses",
    generadaPor: "Gustavo Alfonso Fuentes",
    fechaCompleta: "21 de Mayo, 2025",
    hora: "11:45 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "123456788990",
    descripcionDano: "El cliente comenta que se ha hundido una parte del asiento del sofá a los pocos días de comprarlo.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reemplazar artículo",
    quienRealiza: "Proveedor",
    domicilioRecoleccion: "Circuito del Valle 1234, Rincón del Valle, Culiacán Sinaloa.",
    fechaARealizar: "15 de Agosto, 2025",
    tipoDano: "Raspones o rayones",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "2",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Lavadora no enciende",
    estatus: "Por recolectar",
    tiempo: "2 meses",
    generadaPor: "Gustavo Alfonso Fuentes",
    fechaCompleta: "21 de Mayo, 2025",
    hora: "10:30 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "987654321000",
    descripcionDano: "La lavadora no enciende después de su primera instalación. El panel de control no responde.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealiza: "Foly",
    domicilioRecoleccion: "Blvd. Insurgentes 450, Col. Centro, Culiacán Sinaloa.",
    fechaARealizar: "20 de Agosto, 2025",
    tipoDano: "Defecto eléctrico",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "3",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Fuga de agua",
    estatus: "Por recolectar",
    tiempo: "1 mes",
    generadaPor: "Julio Huerta",
    fechaCompleta: "20 de Junio, 2025",
    hora: "09:00 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "112233445566",
    descripcionDano: "Fuga de agua por la puerta durante el ciclo de lavado.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealiza: "Proveedor",
    domicilioRecoleccion: "Av. Obregón 789, Fracc. Las Quintas, Culiacán Sinaloa.",
    fechaARealizar: "25 de Agosto, 2025",
    tipoDano: "Defecto de sello",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "4",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Panel de control dañado",
    estatus: "Por recolectar",
    tiempo: "1 mes",
    generadaPor: "Julio Huerta",
    fechaCompleta: "20 de Junio, 2025",
    hora: "02:15 pm",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "223344556677",
    descripcionDano: "El panel de control presenta daño visible en los botones desde la entrega.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reemplazar artículo",
    quienRealiza: "Proveedor",
    domicilioRecoleccion: "Calle Ángel Flores 123, Col. Rosales, Culiacán Sinaloa.",
    fechaARealizar: "01 de Septiembre, 2025",
    tipoDano: "Raspones o rayones",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "5",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Vibración excesiva",
    estatus: "Por recolectar",
    tiempo: "1 mes",
    generadaPor: "Julio Huerta",
    fechaCompleta: "18 de Junio, 2025",
    hora: "11:00 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "334455667788",
    descripcionDano: "Vibración excesiva en el ciclo de centrifugado, causando desplazamiento del equipo.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealiza: "Foly",
    domicilioRecoleccion: "Circuito del Valle 1234, Rincón del Valle, Culiacán Sinaloa.",
    fechaARealizar: "05 de Septiembre, 2025",
    tipoDano: "Defecto mecánico",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "6",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Error E5 en pantalla",
    estatus: "Por recolectar",
    tiempo: "1 mes",
    generadaPor: "Julio Huerta",
    fechaCompleta: "17 de Junio, 2025",
    hora: "03:45 pm",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "445566778899",
    descripcionDano: "La pantalla muestra código de error E5 de manera constante.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealiza: "Foly",
    domicilioRecoleccion: "Blvd. Insurgentes 450, Col. Centro, Culiacán Sinaloa.",
    fechaARealizar: "10 de Septiembre, 2025",
    tipoDano: "Defecto eléctrico",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "7",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Óxido en tina interior",
    estatus: "Por recolectar",
    tiempo: "15 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "01 de Julio, 2025",
    hora: "08:30 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "556677889900",
    descripcionDano: "Mancha de óxido en la tina interior desde la entrega.",
    observaciones: "",
    evidencias: [],
    queHaraArticulo: "Cancelar venta",
    quienRealiza: "Proveedor",
    domicilioRecoleccion: "Av. Obregón 789, Fracc. Las Quintas, Culiacán Sinaloa.",
    fechaARealizar: "15 de Septiembre, 2025",
    tipoDano: "Raspones o rayones",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Cancelación de venta",
    autorizadoPor: "Proveedor",
  },
  {
    id: "8",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Golpe en puerta",
    estatus: "Recolectado",
    tiempo: "15 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "01 de Julio, 2025",
    hora: "10:00 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "667788990011",
    descripcionDano: "La puerta de la lavadora presenta golpe visible en el marco desde la instalación.",
    observaciones: "Cliente aceptó el reemplazo de puerta.",
    evidencias: [],
    queHaraArticulo: "Reemplazar artículo",
    quienRealiza: "Proveedor",
    domicilioRecoleccion: "Circuito del Valle 1234, Rincón del Valle, Culiacán Sinaloa.",
    fechaARealizar: "01 de Agosto, 2025",
    tipoDano: "Raspones o rayones",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reemplazo de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "9",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Falla en lavado rápido",
    estatus: "Recolectado",
    tiempo: "12 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "03 de Julio, 2025",
    hora: "09:15 am",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "778899001122",
    descripcionDano: "Error en el programa de lavado rápido, no inicia el ciclo.",
    observaciones: "Cliente satisfecho con la atención recibida.",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealiza: "Foly",
    domicilioRecoleccion: "Calle Ángel Flores 123, Col. Rosales, Culiacán Sinaloa.",
    fechaARealizar: "10 de Agosto, 2025",
    tipoDano: "Defecto de software",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
  },
  {
    id: "10",
    reportado: "15 Julio 2025",
    articulo: "Lavadora Mabe 19 kg EcoGreen 123456678",
    generada: "Julio Huerta",
    dano: "Goteo en conector trasero",
    estatus: "Recolectado",
    tiempo: "5 días",
    generadaPor: "Julio Huerta",
    fechaCompleta: "10 de Julio, 2025",
    hora: "04:00 pm",
    proveedor: "Mabe S.A de C.V",
    formaEntrega: "Piso",
    cantidad: 1,
    numeroSerie: "889900112233",
    descripcionDano: "La lavadora presenta goteo en el conector trasero de agua fría.",
    observaciones: "No requirió reemplazo de unidad.",
    evidencias: [],
    queHaraArticulo: "Reparación",
    quienRealiza: "Proveedor",
    domicilioRecoleccion: "Blvd. Insurgentes 450, Col. Centro, Culiacán Sinaloa.",
    fechaARealizar: "15 de Agosto, 2025",
    tipoDano: "Defecto de sello",
    autorizo: "Lizeth Montoya",
    solucionEntregada: "Reparación de artículo",
    autorizadoPor: "Proveedor",
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
  ventasMensuales: { mes: string; enviados: number }[];
  estatus: "activo" | "archivado";
}

const chartBase = [
  { mes: "Feb", enviados: 5 },
  { mes: "Mar", enviados: 10 },
  { mes: "Abr", enviados: 20 },
  { mes: "May", enviados: 28 },
  { mes: "Jun", enviados: 30 },
];

export const catalogoArticulos: ArticuloCatalogo[] = [
  {
    id: "1",
    sku: "04ET-123456",
    nombre: "Secadora Mabe 20kg SMG26N5MNBAB0 Blanca",
    imagen: "",
    unidades: 2,
    unidadesStatus: "warning",
    enviadosUltAno: 56,
    enviadosUltMes: 12,
    enviadosMesActual: 15,
    ventasMensuales: chartBase,
    estatus: "activo",
  },
  {
    id: "2",
    sku: "04ET-123456",
    nombre: "Secadora Mabe 20kg SMG26N5MNBAB0 Blanca",
    imagen: "",
    unidades: 2,
    unidadesStatus: "warning",
    enviadosUltAno: 56,
    enviadosUltMes: 12,
    enviadosMesActual: 15,
    ventasMensuales: chartBase,
    estatus: "activo",
  },
  {
    id: "3",
    sku: "04ET-123456",
    nombre: "Secadora Mabe 20kg SMG26N5MNBAB0 Blanca",
    imagen: "",
    unidades: 2,
    unidadesStatus: "warning",
    enviadosUltAno: 56,
    enviadosUltMes: 12,
    enviadosMesActual: 15,
    ventasMensuales: chartBase,
    estatus: "activo",
  },
  {
    id: "4",
    sku: "04ET-123456",
    nombre: "Secadora Mabe 20kg SMG26N5MNBAB0 Blanca",
    imagen: "",
    unidades: 2,
    unidadesStatus: "warning",
    enviadosUltAno: 56,
    enviadosUltMes: 12,
    enviadosMesActual: 15,
    ventasMensuales: chartBase,
    estatus: "activo",
  },
  {
    id: "5",
    sku: "14RF-789012",
    nombre: "Refrigerador Mabe 14 pies RME1436YMXB0",
    imagen: "",
    unidades: 5,
    unidadesStatus: "good",
    enviadosUltAno: 45,
    enviadosUltMes: 8,
    enviadosMesActual: 12,
    ventasMensuales: [
      { mes: "Feb", enviados: 8 },
      { mes: "Mar", enviados: 12 },
      { mes: "Abr", enviados: 18 },
      { mes: "May", enviados: 22 },
      { mes: "Jun", enviados: 25 },
    ],
    estatus: "activo",
  },
  {
    id: "6",
    sku: "LVA-456789",
    nombre: "Lavadora Mabe 16kg LMA46102CBAB0",
    imagen: "",
    unidades: 1,
    unidadesStatus: "critical",
    enviadosUltAno: 38,
    enviadosUltMes: 9,
    enviadosMesActual: 7,
    ventasMensuales: [
      { mes: "Feb", enviados: 3 },
      { mes: "Mar", enviados: 7 },
      { mes: "Abr", enviados: 12 },
      { mes: "May", enviados: 15 },
      { mes: "Jun", enviados: 18 },
    ],
    estatus: "archivado",
  },
];

export interface FacturaItem {
  id: string;
  fecha: string;
  pedido: string;
  estatus: "pendiente" | "pagado";
  total: number;
}

export const facturasItems: FacturaItem[] = [
  { id: "1",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pendiente", total: 290123.14 },
  { id: "2",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "3",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "4",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "5",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "6",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "7",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "8",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "9",  fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "10", fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "11", fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "12", fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "13", fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "14", fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
  { id: "15", fecha: "25, Abril de 2026", pedido: "12345", estatus: "pagado",    total: 290123.14 },
];

export interface SolicitudDocItem {
  id: string;
  tipo: string;
  descripcion: string;
  facturas: string;
  monto: number;
}

export const solicitudesDocumentos: SolicitudDocItem[] = [
  {
    id: "1",
    tipo: "Nota de crédito",
    descripcion: "Ajuste de costo de artículos relacionada a las facturas",
    facturas: "123456, 123190",
    monto: 19980.40,
  },
  {
    id: "2",
    tipo: "Nota de crédito",
    descripcion: "Ajuste de costo de artículos relacionada a las facturas",
    facturas: "931334.",
    monto: 32309.80,
  },
];

export interface EstadoCuentaDetalleItem {
  id: string;
  fecha: string;
  tipo: "pedido" | "cargo";
  concepto: string;
  pedidoId?: string;
  cargo?: number;
  venta?: number;
}

export const estadoCuentaDetalles: EstadoCuentaDetalleItem[] = [
  {
    id: "1",
    fecha: "21, Abril de 2026",
    tipo: "pedido",
    concepto: "12 artículos. 21 de Junio, 2025",
    pedidoId: "123456",
    venta: 290123.14,
  },
  {
    id: "2",
    fecha: "15, Abril de 2026",
    tipo: "cargo",
    concepto: "Cargo por mercancía dañada correspondiente al mes de agosto",
    cargo: 18932.00,
  },
  {
    id: "3",
    fecha: "11, Abril de 2026",
    tipo: "pedido",
    concepto: "9 artículos. 11 de Junio, 2025",
    pedidoId: "321929",
    venta: 130569.30,
  },
  {
    id: "4",
    fecha: "15, Abril de 2026",
    tipo: "cargo",
    concepto: "Cargo por gasto de publicidad",
    cargo: 7320.00,
  },
];

export interface EstadoCuentaPagoItem {
  id: string;
  fechaPago: string;
  estatus: "pendiente" | "pagado";
  proveedor: string;
  estadoCuenta: string;
  monto: number;
  notas: string;
  comprobante: string;
}

export const estadoCuentaPagos: EstadoCuentaPagoItem[] = [
  {
    id: "1",
    fechaPago: "30 de Abril, 2026",
    estatus: "pendiente",
    proveedor: "MABE S.A de C.V.",
    estadoCuenta: "Mayo 2026",
    monto: 290123.14,
    notas: "Sin nota registrada",
    comprobante: "BBVA Comprobante de pago",
  },
  {
    id: "2",
    fechaPago: "30 de Marzo, 2026",
    estatus: "pagado",
    proveedor: "MABE S.A de C.V.",
    estadoCuenta: "Marzo 2026",
    monto: 130569.30,
    notas: "Sin nota registrada",
    comprobante: "BBVA Comprobante de pago",
  },
];

export interface FacturaPedidoRow {
  id: string;
  pedido: string;
  fecha: string;
  almacen: string;
  articulosSolicitados: number;
  articulosEntregados: number | null;
  estatus: "pendiente" | "surtido" | "cancelado";
  pago: "pendiente" | "pagado";
  total: number;
}

export interface FacturaDetalleData {
  id: string;
  numero: string;
  fechaGenerada: string;
  pago: "pendiente" | "pagado";
  pedidos: FacturaPedidoRow[];
}

export const facturasDetalle: Record<string, FacturaDetalleData> = {
  "123456": {
    id: "123456",
    numero: "123456",
    fechaGenerada: "15 de Agosto, 2025",
    pago: "pendiente",
    pedidos: [
      { id: "1", pedido: "12345", fecha: "01, Julio de 2025",  almacen: "Bodega", articulosSolicitados: 15, articulosEntregados: null, estatus: "pendiente", pago: "pendiente", total: 290123.14 },
      { id: "2", pedido: "12345", fecha: "20, Junio de 2025",  almacen: "Bodega", articulosSolicitados: 22, articulosEntregados: null, estatus: "pendiente", pago: "pendiente", total: 290123.14 },
      { id: "3", pedido: "12345", fecha: "15, Junio de 2025",  almacen: "Bodega", articulosSolicitados: 15, articulosEntregados: 15,   estatus: "surtido",   pago: "pendiente", total: 290123.14 },
    ],
  },
  "321929": {
    id: "321929",
    numero: "321929",
    fechaGenerada: "11 de Junio, 2025",
    pago: "pendiente",
    pedidos: [
      { id: "1", pedido: "12345", fecha: "11, Junio de 2025",  almacen: "Bodega", articulosSolicitados: 9,  articulosEntregados: 9,    estatus: "surtido",   pago: "pendiente", total: 130569.30 },
    ],
  },
};
