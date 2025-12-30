import Swal from "sweetalert2";
import { supabase } from "../index";
import type {
  DetalleVenta,
  Venta,
  Producto,
  ProductoTopVentas,
  InsertarDetalleVentaParams,
  EditarDetalleVentaParams,
  MostrarDetalleVentaParams,
  EliminarDetalleVentaParams,
  IdEmpresaParam,
} from "../types";

const tabla = "detalle_venta";

export async function InsertarDetalleVentas(p: InsertarDetalleVentaParams): Promise<void> {
  const { error } = await supabase.rpc("insertardetalleventa", p);
  if (error) {
    throw new Error(error.message);
  }
}

export async function EditarCantidadDetalleVenta(p: EditarDetalleVentaParams): Promise<void> {
  const { error } = await supabase.rpc("editarcantidaddv", p);
  if (error) {
    throw new Error(error.message);
  }
}

export async function MostrarDetalleVenta(p: MostrarDetalleVentaParams): Promise<(DetalleVenta & { ventas: Venta | null; productos: Producto | null })[] | null> {
  const { data, error } = await supabase
    .from(tabla)
    .select(`*, ventas(*),productos(*)`)
    .eq("id_venta", p.id_venta);
  if (error) {
    throw new Error(error.message);
  }
  return data as (DetalleVenta & { ventas: Venta | null; productos: Producto | null })[] | null;
}

export async function EliminarDetalleVentas(p: EliminarDetalleVentaParams): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function Mostrartop5productosmasvendidosxcantidad(p: IdEmpresaParam): Promise<ProductoTopVentas[] | null> {
  const { data } = await supabase.rpc(
    "mostrartop5productosmasvendidosxcantidad",
    p
  );
  return data as ProductoTopVentas[] | null;
}

export async function Mostrartop10productosmasvendidosxmonto(p: IdEmpresaParam): Promise<ProductoTopVentas[] | null> {
  const { data } = await supabase.rpc(
    "mostrartop10productosmasvendidosxmonto",
    p
  );
  return data as ProductoTopVentas[] | null;
}
