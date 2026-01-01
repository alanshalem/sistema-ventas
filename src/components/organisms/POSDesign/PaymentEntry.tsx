import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChangeEvent, ForwardedRef } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'
import styled from 'styled-components'

import { useFormattedDate } from '../../../hooks/useFormattedDate'
import ticket from '../../../reports/TicketVenta'
import { useCierreCajaStore } from '../../../store/CierreCajaStore'
import { useClientesProveedoresStore } from '../../../store/ClientesProveedoresStore'
import { useDetalleVentasStore } from '../../../store/DetalleVentasStore'
import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useGlobalStore } from '../../../store/GlobalStore'
import { useImpresorasStore } from '../../../store/ImpresorasStore'
import { useMetodosPagoStore } from '../../../store/MetodosPagoStore'
import { useMovCajaStore } from '../../../store/MovCajaStore'
import { useSerializacionStore } from '../../../store/SerializacionStore'
import { useUsuariosStore } from '../../../store/UsuariosStore'
import { useVentasStore } from '../../../store/VentasStore'
import { FormatearNumeroDinero } from '../../../utils/Conversiones'
import { Divider } from '../../atoms/Divider'
import { Button } from '../../molecules/Button'
import { RegisterClientsSuppliers } from '../forms/RegisterClientsSuppliers'
import { TextInput } from '../forms/TextInput'
import { SearchPanel } from './SearchPanel'

interface PaymentEntryRef {
  mutateAsync: () => Promise<void>
}

export const PaymentEntry = forwardRef<PaymentEntryRef>(
  (_props, ref: ForwardedRef<PaymentEntryRef>) => {
    const fechaActual = useFormattedDate()
    const { tipocobro, resetState, confirmarVenta } = useVentasStore()
    const { total } = useDetalleVentasStore()

    const [stateBuscadorClientes, setStateBuscadorClientes] = useState<boolean>(false)
    const [precioVenta] = useState<number>(total)
    const [valoresPago, setValoresPago] = useState<Record<string, number>>({})

    const [vuelto, setVuelto] = useState<number>(0)
    const [restante, setRestante] = useState<number>(0)

    const { dataMetodosPago } = useMetodosPagoStore()
    const { datausuarios } = useUsuariosStore()
    const { dataempresa } = useEmpresaStore()
    const { idventa } = useVentasStore()
    const { datadetalleventa } = useDetalleVentasStore()
    const { dataComprobantes, itemComprobanteSelect, setItemComprobanteSelect } =
      useSerializacionStore()

    const { dataImpresorasPorCaja } = useImpresorasStore()

    const { buscarCliPro, setBuscador, buscador, selectCliPro, cliproItemSelect } =
      useClientesProveedoresStore()
    const queryClient = useQueryClient()
    const { data: dataBuscadorcliente } = useQuery({
      queryKey: ['buscar cliente', [dataempresa?.id, 'cliente', buscador]],
      queryFn: () =>
        buscarCliPro({
          id_empresa: dataempresa?.id ?? 0,
          tipo: 'cliente',
          buscador: buscador,
        }),
      enabled: !!dataempresa,
      refetchOnWindowFocus: false,
    })

    const { dataCierreCaja } = useCierreCajaStore()
    const { insertarMovCaja } = useMovCajaStore()

    const calcularVueltoYRestante = (): void => {
      const totalPagado = Object.values(valoresPago).reduce((acc, curr) => acc + curr, 0)
      const totalSinEfectivo = totalPagado - (valoresPago['Efectivo'] || 0)

      if (totalSinEfectivo > precioVenta) {
        setVuelto(0)
        setRestante(precioVenta - totalSinEfectivo)
      } else {
        if (totalPagado >= precioVenta) {
          const exceso = totalPagado - precioVenta
          setVuelto(valoresPago['Efectivo'] ? exceso : 0)
          setRestante(0)
        } else {
          setVuelto(0)
          setRestante(precioVenta - totalPagado)
        }
      }
    }

    const handleChangePago = (tipo: string, valor: string): void => {
      setValoresPago((prev) => ({
        ...prev,
        [tipo]: parseFloat(valor) || 0,
      }))
      console.log(valoresPago)
    }

    useImperativeHandle(ref, () => ({
      mutateAsync: mutation.mutateAsync,
    }))

    const mutation = useMutation({
      mutationKey: ['insertar ventas'],
      mutationFn: ConfirmarVenta,
      onSuccess: () => {
        if (restante !== 0) {
          return
        }
        resetState()
        queryClient.invalidateQueries({ queryKey: ['mostrar detalle venta'] })
        toast.success('Venta generada correctamente')
      },
    })

    async function ConfirmarVenta(): Promise<void> {
      if (restante === 0) {
        const pventas = {
          id: idventa,
          _id_venta: idventa,
          _id_usuario: datausuarios?.id,
          _vuelto: vuelto,
          _id_tipo_comprobante: itemComprobanteSelect?.id_tipo_comprobante,
          _serie: itemComprobanteSelect?.serie,
          _id_sucursal: dataCierreCaja?.caja?.id_sucursal ?? 0,
          _id_cliente: cliproItemSelect?.id ?? null,
          _fecha: fechaActual,
          _monto_total: total,
        }
        console.log('confirmarVenta', pventas)
        const dataVentaConfirmada = await confirmarVenta(pventas)
        const nuevosMetodosPago: Array<{ tipo: string; monto: number; vuelto: number }> =
          []

        for (const [tipo, monto] of Object.entries(valoresPago)) {
          if (monto > 0) {
            const metodoPago = dataMetodosPago?.find((item) => item.nombre === tipo)
            const pmovcaja = {
              tipo: 'ingreso' as const,
              monto: monto,
              id_metodo_pago: metodoPago?.id,
              descripcion: `Pago de venta con ${tipo}`,
              id_usuario: datausuarios?.id ?? 0,
              id_empresa: dataempresa?.id ?? 0,
              id_caja: dataCierreCaja?.id_caja ?? 0,
              id_cierre_caja: dataCierreCaja?.id,
              id_ventas: idventa,
              fecha: fechaActual,
              vuelto: tipo === 'Efectivo' ? vuelto : 0,
            }
            await insertarMovCaja(pmovcaja)
            nuevosMetodosPago.push({ tipo, monto, vuelto })
          }
        }
        const printData = {
          dataempresa: dataempresa,
          productos: datadetalleventa,
          dataventas: dataVentaConfirmada,
          nombreComprobante: itemComprobanteSelect?.tipo_comprobantes?.nombre,
          nombrecajero: datausuarios?.nombres,
          dataCliente: cliproItemSelect,
          metodosPago: nuevosMetodosPago,
        }
        const shouldPrintDirect =
          dataImpresorasPorCaja?.state ?? dataImpresorasPorCaja?.estado
        if (shouldPrintDirect) {
          await imprimirDirectoTicket(printData)
        } else {
          await imprimirConVentanaEmergente(printData)
        }
      } else {
        toast.warning('Falta completar el pago, el restante tiene que ser 0')
      }
    }

    const imprimirConVentanaEmergente = async (p: unknown): Promise<void> => {
      console.log('pprint', p)
      await ticket('print', p)
    }

    const imprimirDirectoTicket = async (p: unknown): Promise<void> => {
      const printerName = dataImpresorasPorCaja?.name ?? dataImpresorasPorCaja?.nombre
      if (printerName === '-') {
        toast.error(
          'Impresora no reconocida, configura tu impresora desde modulo de configuración'
        )
        return
      }
      const response = await ticket('b64', p)

      const binaryString = atob((response as { content: string }).content)
      const binaryLen = binaryString.length
      const bytes = new Uint8Array(binaryLen)
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'application/pdf' })

      const file = new File([blob], 'GeneratedTicket.pdf', {
        type: 'application/pdf',
      })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('printerName', printerName ?? '')
      const responseApi = await fetch('http://localhost:5075/api/print-ticket', {
        method: 'POST',
        body: formData,
      })
      if (responseApi.ok) {
        toast.success('El PDF se envió a imprimir correctamente.')
      } else {
        const error = await responseApi.text()
        toast.error('Error al imprimir' + error)
      }
    }

    const { setTipo: setTipocliente } = useClientesProveedoresStore()
    const { setStateClose, setAccion, stateClose, accion, setIsExploding } =
      useGlobalStore()

    function registrarNuevoCliente(): void {
      const tipo = 'cliente'
      setTipocliente(tipo)
      setAccion('Nuevo')
      setStateClose(true)
    }

    useEffect(() => {
      if (tipocobro !== 'Mixto' && valoresPago[tipocobro] !== total) {
        setValoresPago((prev) => ({
          ...prev,
          [tipocobro]: total,
        }))
      }
    }, [tipocobro, total, valoresPago])

    useEffect(() => {
      calcularVueltoYRestante()
    }, [precioVenta, tipocobro, valoresPago])

    return (
      <Container>
        {mutation.isPending ? (
          <span>guardando...</span>
        ) : (
          <>
            {mutation.isError && <span>error: {mutation.error.message}</span>}
            <section className="area1">
              <span className="tipocobro">{tipocobro}</span>
              <section>
                <span>
                  {itemComprobanteSelect?.tipo_comprobantes?.nombre}:{' '}
                  <strong>
                    {itemComprobanteSelect?.serie}-
                    {itemComprobanteSelect?.correlativo}{' '}
                  </strong>{' '}
                </span>
              </section>

              <section className="areacomprobantes">
                {dataComprobantes?.map((item, index) => {
                  return (
                    <article className="box" key={index}>
                      <Button
                        title={item?.tipo_comprobantes?.nombre}
                        border="0"
                        height="70px"
                        width="100%"
                        onClick={() => setItemComprobanteSelect(item)}
                      />
                    </article>
                  )
                })}
              </section>
              <span>cliente</span>
              <EditButton
                onClick={() => setStateBuscadorClientes(!stateBuscadorClientes)}
              >
                <Icon className=" icono" icon="lets-icons:edit-fill" />
              </EditButton>
              <span className="cliente">
                {cliproItemSelect?.nombres ?? cliproItemSelect?.nombre}
              </span>
            </section>
            <Divider />
            <section className="area2">
              {dataMetodosPago?.map((item, index) => {
                return (tipocobro === 'Mixto' && item.nombre !== 'Mixto') ||
                  (tipocobro === item.nombre && item.nombre !== 'Mixto') ? (
                  <TextInput textalign="center" key={index}>
                    <input
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChangePago(item.nombre, e.target.value)
                      }
                      defaultValue={tipocobro === item.nombre ? total : ''}
                      className="form__field"
                      type="number"
                      disabled={
                        tipocobro === 'Mixto' || tipocobro === 'Efectivo' ? false : true
                      }
                    />
                    <label className="form__label">{item.nombre} </label>
                  </TextInput>
                ) : null
              })}
            </section>
            <Divider />
            <section className="area3">
              <article className="etiquetas">
                <span className="total">Total: </span>
                <span>Vuelto: </span>
                <span>Restante: </span>
              </article>
              <article>
                <span className="total">
                  {FormatearNumeroDinero(total, dataempresa?.currency, dataempresa?.iso)}
                </span>
                <span>
                  {FormatearNumeroDinero(vuelto, dataempresa?.currency, dataempresa?.iso)}
                </span>
                <span>
                  {FormatearNumeroDinero(
                    restante,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </span>
                <span>
                  {FormatearNumeroDinero(vuelto, dataempresa?.currency, dataempresa?.iso)}
                </span>
                <span>
                  {FormatearNumeroDinero(
                    restante,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </span>
              </article>
            </section>
            <Divider />
            <section className="area4">
              <Button
                onClick={() => mutation.mutateAsync()}
                border="2px"
                title="COBRAR (enter)"
                bgColor="#0aca21"
                color="#ffffff"
                width="100%"
              />
            </section>
            {stateBuscadorClientes && (
              <SearchPanel
                funcion={registrarNuevoCliente}
                selector={(item) => selectCliPro(item as never)}
                setBuscador={setBuscador}
                displayField="nombres"
                data={dataBuscadorcliente ?? []}
                setStateBuscador={() => setStateBuscadorClientes(!stateBuscadorClientes)}
              />
            )}
            {stateClose && (
              <RegisterClientsSuppliers
                setIsExploding={setIsExploding}
                action={accion}
                onClose={() => setStateClose(false)}
                dataSelect={cliproItemSelect ?? ({} as never)}
              />
            )}
          </>
        )}
      </Container>
    )
  }
)

const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 2px 15px 0px #e2e2e2;
  gap: 12px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #000;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 22px;

  input {
    color: #000 !important;
    font-weight: 700;
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 5px;
    height: 6px;
    width: 380px;
  }
  &:before {
    top: -5px;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        #fbfbfb 50%,
        #fbfbfb 100%
      ) -7px -8px /
      16px 16px repeat-x;
  }
  &:after {
    bottom: -5px;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        #fbfbfb 50%,
        #fbfbfb 100%
      ) -7px -2px /
      16px 16px repeat-x;
  }
  .area1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    .areacomprobantes {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
      .box {
        flex: 1 1 40%;
        display: flex;
        gap: 10px;
      }
    }
    .tipocobro {
      position: absolute;
      right: 6px;
      top: 6px;
      background-color: rgba(233, 6, 184, 0.2);
      padding: 5px;
      color: #e61eb1;
      border-radius: 5px;
      font-size: 15px;
      font-weight: 650;
    }
    .cliente {
      font-weight: 700;
    }
  }
  .area2 {
    input {
      font-size: 40px;
    }
  }
  .area3 {
    display: flex;
    justify-content: space-between;
    width: 100%;

    article {
      display: flex;
      flex-direction: column;
    }
    .total {
      font-weight: 700;
    }
    .etiquetas {
      text-align: end;
    }
  }
`

const EditButton = styled.button`
  background-color: #62c6f7;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  .icono {
    font-size: 20px;
  }
`
