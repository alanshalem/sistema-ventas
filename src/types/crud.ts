/* CRUD Parameter Types - Complete TypeScript Definitions */

import type {
  Almacen,
  AsignacionCajaSucursal,
  Caja,
  Categoria,
  Cliente,
  DetalleVenta,
  Empresa,
  Impresora,
  MetodoPago,
  Moneda,
  MovimientoCaja,
  MovimientoStock,
  Producto,
  Proveedor,
  Rol,
  Serializacion,
  Stock,
  Sucursal,
  TipoDocumento,
  Usuario,
  Venta,
} from './database'

// ============== BASE TYPES ==============

export interface IdParam {
  id: number
}

export interface IdEmpresaParam {
  id_empresa?: number
  _id_empresa?: number // RPC functions use underscore prefix
}

export interface IdSucursalParam {
  id_sucursal: number
}

export interface IdAuthParam {
  id_auth: string
}

export interface IdUsuarioParam {
  id_usuario: number
}

export interface IdCajaParam {
  id_caja: number
}

export interface IdAlmacenParam {
  id_almacen: number
}

export interface PaginationParams {
  limit?: number
  offset?: number
}

// ============== PRODUCTOS ==============

export interface InsertarProductoParams extends Omit<
  Producto,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarProductoParams extends Partial<Producto> {
  id: number
}

export interface MostrarProductosParams {
  id_empresa: number
}

export interface BuscarProductoParams {
  id_empresa: number
  busqueda?: string
}

export interface ImagenProductoParams {
  id: number
  imagen_url: string
}

// ============== CATEGORIAS ==============

export interface InsertarCategoriaParams extends Omit<
  Categoria,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarCategoriaParams extends Partial<Categoria> {
  id: number
}

export interface MostrarCategoriasParams {
  id_empresa: number
}

// ============== CLIENTES Y PROVEEDORES ==============

export interface InsertarClienteParams extends Omit<
  Cliente,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarClienteParams extends Partial<Cliente> {
  id: number
}

export interface MostrarClientesParams {
  id_empresa: number
}

export interface InsertarProveedorParams extends Omit<
  Proveedor,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarProveedorParams extends Partial<Proveedor> {
  id: number
}

export interface MostrarProveedoresParams {
  id_empresa: number
}

// ============== VENTAS ==============

export interface InsertarVentaParams extends Omit<
  Venta,
  'id' | 'created_at' | 'updated_at'
> {}

export interface ConfirmarVentaParams extends Partial<Venta> {
  id: number
}

export interface EliminarVentasIncompletasParams {
  id_usuario: number
  id_cierre_caja: number
}

export interface MostrarVentasXSucursalParams {
  id_sucursal: number
}

export interface MostrarVentasParams {
  id_empresa: number
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
}

// ============== DETALLE VENTA ==============

export interface InsertarDetalleVentaParams extends Omit<
  DetalleVenta,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarDetalleVentaParams extends Partial<DetalleVenta> {
  id: number
}

export interface MostrarDetalleVentaParams {
  id_venta: number
}

export interface EliminarDetalleVentaParams {
  id: number
}

// ============== USUARIOS ==============

export interface MostrarUsuariosParams {
  id_auth: string
}

export interface InsertarUsuarioParams extends Omit<
  Usuario,
  'id' | 'created_at' | 'updated_at'
> {}

export interface InsertarAdminParams extends Omit<
  Usuario,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarUsuarioParams extends Partial<Usuario> {
  id: number
}

export interface InsertarCredencialesUserParams {
  email: string
  password: string
  nombres: string
}

export interface EliminarUsuarioAsignadoParams {
  id: number
}

// ============== ROLES Y PERMISOS ==============

export interface InsertarRolParams extends Omit<
  Rol,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarRolParams extends Partial<Rol> {
  id: number
}

export interface MostrarRolesParams {
  id_empresa: number
}

export interface InsertarPermisoParams {
  id_usuario: number
  idmodulo: number
}

export interface EliminarPermisosParams {
  id_usuario: number
}

export interface MostrarPermisosParams {
  id_usuario: number
}

export interface MostrarModulosParams {
  id_empresa?: number
}

// ============== EMPRESA ==============

export interface MostrarEmpresaXIdUsuarioParams {
  id_auth: string
}

export interface InsertarEmpresaParams extends Omit<
  Empresa,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarEmpresaParams extends Partial<Empresa> {
  id: number
}

export interface SubirLogoEmpresaParams {
  id: number
  logo: File | string
}

// ============== SUCURSALES ==============

export interface MostrarSucursalesParams {
  id_empresa: number
}

export interface InsertarSucursalParams extends Omit<
  Sucursal,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarSucursalParams extends Partial<Sucursal> {
  id: number
}

export interface EliminarSucursalParams {
  id: number
}

// ============== CAJAS ==============

export interface MostrarCajaXSucursalParams {
  id_sucursal: number
}

export interface InsertarCajaParams extends Omit<
  Caja,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarCajaParams extends Partial<Caja> {
  id: number
}

export interface EliminarCajaParams {
  id: number
}

export interface AsignarCajaSucursalParams extends Omit<
  AsignacionCajaSucursal,
  'id' | 'created_at' | 'updated_at'
> {}

// ============== ALMACENES ==============

export interface MostrarAlmacenXSucursalParams {
  id_sucursal: number
}

export interface MostrarAlmacenesXEmpresaParams {
  id_empresa: number
}

export interface MostrarAlmacenesXSucursalParams {
  id_sucursal: number
}

export interface InsertarAlmacenParams extends Omit<
  Almacen,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarAlmacenParams extends Partial<Almacen> {
  id: number
}

export interface EliminarAlmacenParams {
  id: number
}

// ============== STOCK ==============

export interface MostrarStockParams {
  id_empresa: number
  id_almacen?: number
  id_producto?: number
}

export interface InsertarStockParams extends Omit<
  Stock,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarStockParams extends Partial<Stock> {
  id: number
}

export interface ActualizarStockParams {
  id_producto: number
  id_almacen: number
  cantidad: number
  tipo: 'suma' | 'resta'
}

// ============== MOVIMIENTOS STOCK ==============

export interface InsertarMovimientoStockParams extends Omit<
  MovimientoStock,
  'id' | 'created_at' | 'updated_at'
> {}

export interface MostrarMovimientosStockParams {
  id_empresa: number
  id_almacen?: number
  id_producto?: number
  fecha_inicio?: string
  fecha_fin?: string
}

// ============== MOVIMIENTOS CAJA ==============

export interface InsertarMovimientoCajaParams extends Omit<
  MovimientoCaja,
  'id' | 'created_at' | 'updated_at'
> {}

export interface MostrarMovimientosCajaParams {
  id_caja: number
  id_cierre_caja?: number
  fecha_inicio?: string
  fecha_fin?: string
  id_empresa?: number
}

export interface EliminarMovimientoCajaParams {
  id: number
}

// ============== CIERRE CAJA ==============

export interface AbrirCajaParams {
  id_caja: number
  id_usuario: number
  saldo_inicial: number
  id_empresa: number
}

export interface CerrarCajaParams {
  id: number
  saldo_final: number
  total_ingresos: number
  total_egresos: number
  observaciones?: string
}

export interface MostrarCierreCajaParams {
  id_caja: number
  estado?: 'abierto' | 'cerrado'
}

export interface MostrarCierresCajaParams {
  id_empresa: number
  fecha_inicio?: string
  fecha_fin?: string
}

// ============== METODOS DE PAGO ==============

export interface MostrarMetodosPagoParams {
  id_empresa: number
}

export interface InsertarMetodoPagoParams extends Omit<
  MetodoPago,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarMetodoPagoParams extends Partial<MetodoPago> {
  id: number
}

export interface EliminarMetodoPagoParams {
  id: number
}

// ============== IMPRESORAS ==============

export interface MostrarImpresorasParams {
  id_empresa: number
}

export interface InsertarImpresoraParams extends Omit<
  Impresora,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarImpresoraParams extends Partial<Impresora> {
  id: number
}

export interface EliminarImpresoraParams {
  id: number
}

// ============== MONEDAS ==============

export interface MostrarMonedasParams {
  activo?: boolean
}

export interface InsertarMonedaParams extends Omit<
  Moneda,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarMonedaParams extends Partial<Moneda> {
  id: number
}

// ============== TIPO DOCUMENTOS ==============

export interface MostrarTipoDocumentosParams {
  activo?: boolean
}

export interface InsertarTipoDocumentoParams extends Omit<
  TipoDocumento,
  'id' | 'created_at' | 'updated_at'
> {}

export interface EditarTipoDocumentoParams extends Partial<TipoDocumento> {
  id: number
}

// ============== SERIALIZACION ==============

export interface MostrarSerializacionParams {
  id_empresa: number
  tipo_comprobante?: string
}

export interface InsertarSerializacionParams extends Omit<
  Serializacion,
  'id' | 'created_at' | 'updated_at'
> {}

export interface ActualizarCorrelativoParams {
  id: number
  correlativo: number
}

// ============== RESPONSE TYPES ==============

export interface SupabaseResponse<T> {
  data: T | null
  error: Error | null
}

export interface SupabaseMultipleResponse<T> {
  data: T[] | null
  error: Error | null
}

// ============== UTILITY TYPES ==============

export type CrudOperation = 'insert' | 'update' | 'delete' | 'select'

export interface CrudError {
  message: string
  code?: string
  details?: string
}
