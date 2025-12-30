import Swal from "sweetalert2";
import { supabase } from "../index";
import type {
  Almacen,
  Sucursal,
  EditarAlmacenParams,
  InsertarAlmacenParams,
  MostrarAlmacenXSucursalParams,
  MostrarAlmacenesXEmpresaParams,
  MostrarAlmacenesXSucursalParams,
  EliminarAlmacenParams,
} from "../types";

const tabla = "almacen";

export async function EditarAlmacen(p: EditarAlmacenParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function InsertarAlmacen(p: InsertarAlmacenParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}

export async function MostrarAlmacenXSucursal(p: MostrarAlmacenXSucursalParams): Promise<Almacen | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_sucursal", p.id_sucursal)
    .maybeSingle();
  return data as Almacen | null;
}

export async function MostrarAlmacenesXEmpresa(p: MostrarAlmacenesXEmpresaParams): Promise<(Sucursal & { almacen: Almacen[] })[] | null> {
  const { data } = await supabase
    .from("sucursales")
    .select(`*, almacen(*)`)
    .eq("id_empresa", p.id_empresa);
  return data as (Sucursal & { almacen: Almacen[] })[] | null;
}

export async function MostrarAlmacenesXSucursal(p: MostrarAlmacenesXSucursalParams): Promise<Almacen[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_sucursal", p.id_sucursal);
  return data as Almacen[] | null;
}

export async function EliminarAlmacen(p: EliminarAlmacenParams): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
