import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import styled from 'styled-components'

import { SelectList } from '@/components/ui/lists/SelectList'

import { useFormattedDate } from '../../../hooks/useFormattedDate'
import {
  Clock,
  TextInput2,
  useDetalleVentasStore,
  useEmpresaStore,
  useProductosStore,
  useUsuariosStore,
  useVentasStore,
} from '../../../index'
import { useCierreCajaStore } from '../../../store/CierreCajaStore'
import { useStockStore } from '../../../store/StockStore'
import { Device } from '../../../styles/breakpoints'
import { useEliminarVentasIncompletasMutate } from '../../../tanstack/VentasStack'

export function POSHeader() {
  const [stateLectora] = useState<boolean>(true)
  const [cantidadInput, setCantidadInput] = useState<number>(1)
  const [stateListaproductos, setStateListaproductos] = useState<boolean>(false)
  const { setBuscador, dataProductos, selectProductos, buscador } = useProductosStore()

  const { datausuarios } = useUsuariosStore()
  const { dataStockXAlmacenesYProducto, setStateModal } = useStockStore()

  const { idventa, insertarVentas } = useVentasStore()

  const { dataempresa } = useEmpresaStore()
  const { dataCierreCaja } = useCierreCajaStore()
  const { insertarDetalleVentas } = useDetalleVentasStore()
  const queryClient = useQueryClient()

  const buscadorRef = useRef<HTMLInputElement>(null)
  const fechaactual = useFormattedDate()

  function buscar(e: ChangeEvent<HTMLInputElement>): void {
    setBuscador(e.target.value)
    const texto = e.target.value
    if (texto.trim() === '' || stateLectora) {
      setStateListaproductos(false)
    } else {
      setStateListaproductos(true)
    }
  }

  async function insertarventas(): Promise<void> {
    if (idventa === 0) {
      const pventas = {
        nro_comprobante: '',
        fecha: fechaactual,
        sub_total: 0,
        total_impuestos: 0,
        monto_total: 0,
        estado: 'pendiente',
        id_usuario: datausuarios?.id ?? 0,
        id_sucursal: dataCierreCaja?.caja?.id_sucursal ?? 0,
        id_empresa: dataempresa?.id ?? 0,
        id_cierre_caja: dataCierreCaja?.id,
      }

      const result = await insertarVentas(pventas)
      if (result && result.id > 0) {
        await insertarDVentas(result.id)
      }
    } else {
      await insertarDVentas(idventa)
    }
    setBuscador('')
    if (buscadorRef.current) {
      buscadorRef.current.focus()
    }
    setCantidadInput(1)
  }

  async function insertarDVentas(idventa: number): Promise<void> {
    const productosItemSelect = useProductosStore.getState().productosItemSelect
    if (!productosItemSelect) return

    const cantidad = parseFloat(String(cantidadInput)) || 1
    const precioUnitario = productosItemSelect.precio_venta
    const subtotal = cantidad * precioUnitario

    const pDetalleVentas = {
      id_venta: idventa,
      id_producto: productosItemSelect.id,
      cantidad: cantidad,
      precio_unitario: precioUnitario,
      subtotal: subtotal,
      id_empresa: dataempresa?.id ?? 0,
    }
    console.log('pDetalleVentas', pDetalleVentas)
    await insertarDetalleVentas(pDetalleVentas)
  }

  const { mutate: mutationInsertarVentas } = useMutation({
    mutationKey: ['insertar ventas'],
    mutationFn: insertarventas,
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
      queryClient.invalidateQueries({ queryKey: ['mostrar Stock XAlmacenes YProducto'] })
      if (dataStockXAlmacenesYProducto) {
        setStateModal(true)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mostrar detalle venta'] })
    },
  })

  const ValidarCantidad = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Math.max(0, parseFloat(e.target.value))
    setCantidadInput(value)
  }

  const { mutate } = useEliminarVentasIncompletasMutate()

  useEffect(() => {
    if (buscadorRef.current) {
      buscadorRef.current.focus()
    }
    mutate()
  }, [mutate])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const texto = buscador.trim()
    const isCodigoDeBarras = /^[0-9]{3,}$/.test(texto)
    if (isCodigoDeBarras) {
      setStateListaproductos(false)
      timeout = setTimeout(() => {
        const productoEncontrado = dataProductos?.find((p) => p.codigo_barras === texto)
        if (productoEncontrado) {
          selectProductos(productoEncontrado)
          mutationInsertarVentas()
          setBuscador('')
        } else {
          toast.error('Producto no encontrado')
          setBuscador('')
        }
      }, 100)
    } else {
      if (texto.length > 1) {
        timeout = setTimeout(() => {
          setStateListaproductos(true)
        }, 200)
      } else {
        setStateListaproductos(false)
      }
    }

    return () => clearTimeout(timeout)
  }, [buscador, dataProductos, selectProductos, mutationInsertarVentas, setBuscador])

  return (
    <Header>
      <ContentSucursal>
        <div>
          <strong>SUCURSAL:&nbsp; </strong> {dataCierreCaja?.caja?.sucursales?.nombre}
        </div>
        |
        <div>
          <strong>CAJA:&nbsp; </strong> {dataCierreCaja?.caja?.descripcion}
        </div>
      </ContentSucursal>
      <section className="contentprincipal">
        <Contentuser className="area1">
          <div className="textos">
            <span className="usuario">{datausuarios?.nombres} </span>
            <span>{datausuarios?.roles?.nombre} </span>
          </div>
        </Contentuser>

        <article className="contentfecha area3">
          <Clock />
        </article>
      </section>
      <section className="contentbuscador">
        <article className="area1">
          <div className="contentCantidad">
            <TextInput2>
              <input
                type="number"
                min="1"
                value={cantidadInput}
                onChange={ValidarCantidad}
                placeholder="cantidad..."
                className="form__field"
              />
            </TextInput2>
          </div>
          <TextInput2>
            <input
              value={buscador}
              ref={buscadorRef}
              onChange={buscar}
              className="form__field"
              type="search"
              placeholder="buscar..."
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'ArrowDown' && stateListaproductos) {
                  e.preventDefault()
                  const firstElement =
                    document.querySelector<HTMLElement>("[tabindex='0']")
                  if (firstElement) {
                    firstElement.focus()
                  }
                }
              }}
            />
            {stateListaproductos && (
              <SelectList
                onSelect={(item) => {
                  selectProductos(item)
                  setStateListaproductos(false)
                  mutationInsertarVentas()
                }}
                data={dataProductos}
                displayField="nombre"
              />
            )}
          </TextInput2>
        </article>
        <article className="area2"></article>
      </section>
    </Header>
  )
}

const Header = styled.div`
  grid-area: header;
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 20px;
  @media ${Device.desktop} {
    border-bottom: 1px solid ${({ theme }) => theme.neutral};
  }

  .contentprincipal {
    width: 100%;
    display: grid;
    grid-template-areas:
      'area1 area2'
      'area3 area3';

    .area1 {
      grid-area: area1;
    }
    .area2 {
      grid-area: area2;
    }
    .area3 {
      grid-area: area3;
    }
    @media ${Device.desktop} {
      display: flex;
      justify-content: space-between;
    }
    .contentlogo {
      display: flex;
      align-items: center;
      font-weight: 700;
      gap: 8px;
      img {
        width: 30px;
        object-fit: contain;
      }
    }
  }
  .contentbuscador {
    display: grid;
    grid-template:
      'area2 area2'
      'area1 area1';
    gap: 10px;
    height: 100%;
    align-items: center;
    position: relative;

    .area1 {
      grid-area: area1;
      display: flex;
      gap: 30px;
      .contentCantidad {
        width: 150px;
      }
    }
    .area2 {
      grid-area: area2;
      display: flex;
      gap: 10px;
    }
    @media ${Device.desktop} {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      .area1 {
        width: 40vw;
      }
    }
  }
`

const ContentSucursal = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  border-bottom: 1px solid ${({ theme }) => theme.neutral};
  gap: 8px;
`

const Contentuser = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .contentimg {
    display: flex;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .textos {
    display: none;

    .usuario {
      font-weight: 700;
    }
    @media ${Device.laptop} {
      display: flex;
      flex-direction: column;
    }
  }
`
