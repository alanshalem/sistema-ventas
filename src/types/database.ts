/* Database Entity Types - Complete TypeScript Definitions */

export interface BaseEntity {
  id: number
  created_at?: string
  updated_at?: string
}

// ============== CORE ENTITIES ==============

export interface Producto extends BaseEntity {
  nombre: string
  codigo_interno?: string
  codigo_barras?: string
  precio_venta: number
  precio_compra: number
  stock: number
  stock_minimo: number
  id_categoria?: number
  id_empresa: number
  imagen_url?: string
  descripcion?: string
}

export interface Categoria extends BaseEntity {
  nombre: string
  descripcion?: string
  icono?: string
  id_empresa: number
}

export interface Cliente extends BaseEntity {
  nombre: string
  documento?: string
  tipo_documento?: string
  email?: string
  telefono?: string
  direccion?: string
  id_empresa: number
}

export interface Proveedor extends BaseEntity {
  nombre: string
  ruc?: string
  email?: string
  telefono?: string
  direccion?: string
  id_empresa: number
}

// ============== SALES & TRANSACTIONS ==============

export interface Venta extends BaseEntity {
  nro_comprobante: string
  fecha: string
  sub_total: number
  total_impuestos: number
  monto_total: number
  estado: string
  id_usuario: number
  id_empresa: number
  id_caja?: number
  id_cliente?: number
  id_metodo_pago?: number
  tipo_comprobante?: string
  observaciones?: string
}

export interface DetalleVenta extends BaseEntity {
  id_venta: number
  id_producto: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  descuento?: number
  id_empresa: number
  productos?: Producto // Joined data
}

// ============== USERS & PERMISSIONS ==============

export interface Usuario extends BaseEntity {
  nombres: string
  correo: string
  id_rol?: number
  id_empresa: number
  estado?: boolean
  telefono?: string
  foto?: string
  usuario_supabase?: string
}

export interface Rol extends BaseEntity {
  nombre: string
  descripcion?: string
  id_empresa: number
}

export interface Permiso extends BaseEntity {
  id_rol: number
  id_modulo: number
  ver: boolean
  crear: boolean
  editar: boolean
  eliminar: boolean
}

export interface Modulo extends BaseEntity {
  nombre: string
  descripcion?: string
  icono?: string
  ruta?: string
}

// ============== COMPANY & BRANCHES ==============

export interface Empresa extends BaseEntity {
  nombre: string
  ruc?: string
  direccion?: string
  telefono?: string
  email?: string
  logo?: string
  id_moneda?: number
  nombre_moneda?: string
  simbolo_moneda?: string
  id_fiscal?: string
  pie_pagina_ticket?: string
}

export interface Sucursal extends BaseEntity {
  nombre: string
  direccion?: string
  telefono?: string
  id_empresa: number
  estado?: boolean
}

export interface Caja extends BaseEntity {
  nombre: string
  descripcion?: string
  id_empresa: number
  estado?: boolean
  saldo_inicial?: number
}

export interface AsignacionCajaSucursal extends BaseEntity {
  id_caja: number
  id_sucursal: number
  id_usuario?: number
  fecha_asignacion?: string
  estado?: boolean
}

// ============== INVENTORY ==============

export interface Almacen extends BaseEntity {
  nombre: string
  descripcion?: string
  direccion?: string
  id_empresa: number
  id_sucursal?: number
  estado?: boolean
}

export interface Stock extends BaseEntity {
  id_producto: number
  id_almacen: number
  cantidad: number
  id_empresa: number
}

export interface MovimientoStock extends BaseEntity {
  tipo: 'entrada' | 'salida' | 'ajuste'
  cantidad: number
  id_producto: number
  id_almacen: number
  id_usuario: number
  id_empresa: number
  motivo?: string
  fecha: string
  referencia?: string
}

// ============== CASH REGISTER ==============

export interface MovimientoCaja extends BaseEntity {
  tipo: 'ingreso' | 'egreso'
  monto: number
  descripcion?: string
  id_caja: number
  id_usuario: number
  id_empresa: number
  fecha: string
  id_venta?: number
}

export interface CierreCaja extends BaseEntity {
  id_caja: number
  id_usuario: number
  fecha_apertura: string
  fecha_cierre?: string
  saldo_inicial: number
  total_ingresos: number
  total_egresos: number
  saldo_final: number
  estado: 'abierto' | 'cerrado'
  id_empresa: number
  observaciones?: string
}

// ============== PAYMENT & CONFIGURATION ==============

export interface MetodoPago extends BaseEntity {
  nombre: string
  descripcion?: string
  id_empresa: number
  estado?: boolean
  requiere_referencia?: boolean
}

export interface Moneda extends BaseEntity {
  nombre: string
  codigo: string
  simbolo: string
  tasa_cambio?: number
}

export interface TipoDocumento extends BaseEntity {
  nombre: string
  codigo?: string
  descripcion?: string
}

export interface Serializacion extends BaseEntity {
  serie: string
  correlativo: number
  tipo_comprobante: string
  id_empresa: number
  activo?: boolean
}

// ============== PRINTERS ==============

export interface Impresora extends BaseEntity {
  nombre: string
  ip?: string
  puerto?: number
  tipo: string
  id_empresa: number
  id_caja?: number
  estado?: boolean
  modelo?: string
}

// ============== REPORTS & ANALYTICS ==============

export interface ReporteVentas {
  fecha: string
  total_ventas: number
  cantidad_transacciones: number
  ticket_promedio: number
  productos_vendidos: number
}

export interface ProductoTopVentas {
  id_producto: number
  nombre_producto: string
  cantidad_vendida: number
  monto_total: number
}

// ============== UTILITY TYPES ==============

export type EstadoGeneral = 'activo' | 'inactivo' | 'pendiente' | 'completado'
export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste'
export type TipoComprobante = 'boleta' | 'factura' | 'nota_venta' | 'ticket'
export type EstadoCaja = 'abierto' | 'cerrado'
export type TipoMetodoPago =
  | 'efectivo'
  | 'tarjeta'
  | 'transferencia'
  | 'yape'
  | 'plin'
  | 'otro'
