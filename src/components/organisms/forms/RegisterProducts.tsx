import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import styled from 'styled-components'
import Swal from 'sweetalert2'

import {
  useAlmacenesStore,
  useCategoriasStore,
  useProductosStore,
  useSucursalesStore,
} from '../../../index'
import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useStockStore } from '../../../store/StockStore'
import { Device } from '../../../styles/breakpoints'
import { v } from '../../../styles/variables'
import { ConvertirMinusculas } from '../../../utils/Conversiones'
import { SelectorContainer } from '../../atoms/SelectorContainer'
import { Button } from '../../molecules/Button'
import { GenerateCodeButton } from '../../molecules/GenerateCodeButton'
import { BtnClose } from '../../ui/buttons/BtnClose'
import { SelectList } from '../../ui/lists/SelectList'
import { Checkbox } from '../Checkbox'
import { Switch } from '../Switch'
import { TextInput } from './TextInput'

interface RegisterProductsProps {
  readonly onClose: () => void
  readonly dataSelect: {
    id?: number
    nombre?: string
    precio_venta?: number
    precio_compra?: number
    id_categoria?: number
    categoria?: string
    codigo_interno?: string
    codigo_barras?: string
    sevende_por?: string
    maneja_inventarios?: boolean
  }
  readonly action: string
  readonly setIsExploding: (value: boolean) => void
  readonly isClosed: boolean
}

interface FormData {
  nombre: string
  precio_venta: string
  precio_compra: string
  stock: string
  stock_minimo: string
  ubicacion: string
}

export function RegisterProducts({
  onClose,
  dataSelect,
  action,
  setIsExploding,
  isClosed,
}: Readonly<RegisterProductsProps>) {
  if (!isClosed) return null

  const [isChecked1, setIsChecked1] = useState(true)
  const [isChecked2, setIsChecked2] = useState(false)
  const [stock, setStock] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')
  const [ubicacion, setUbicacion] = useState('')

  const handleCheckboxChange = (checkboxNumber: number) => {
    if (checkboxNumber === 1) {
      setIsChecked1(true)
      setIsChecked2(false)
    } else {
      setIsChecked1(false)
      setIsChecked2(true)
    }
  }

  const { insertarProductos, editarProductos, codigogenerado, refetchs } =
    useProductosStore()
  const { insertarStock, mostrarStockXAlmacenYProducto } = useStockStore()
  const { dataempresa } = useEmpresaStore()
  const [randomCodeinterno, setRandomCodeinterno] = useState('')
  const [randomCodebarras, setRandomCodebarras] = useState('')
  const {
    dataalmacen,
    eliminarAlmacen,
    mostrarAlmacenesXSucursal,
    almacenSelectItem,
    setAlmacenSelectItem,
  } = useAlmacenesStore()
  const [stateInventarios, setStateInventarios] = useState(false)
  const [stateEnabledStock, setStateEnabledStock] = useState(false)

  const { dataSucursales, selectSucursal, sucursalesItemSelect } = useSucursalesStore()
  const { datacategorias, selectCategoria, categoriaItemSelect } = useCategoriasStore()

  const { data: dataStockXAlmacenYProducto } = useQuery({
    queryKey: [
      'mostrar stock almacen y producto',
      { id_producto: dataSelect?.id, id_almacen: almacenSelectItem?.id },
    ],
    queryFn: () =>
      mostrarStockXAlmacenYProducto({
        id_empresa: dataempresa?.id ?? 0,
        id_almacen: almacenSelectItem?.id ?? 0,
        id_producto: dataSelect?.id ?? 0,
      }),
  })

  const { data: dataAlmacenes } = useQuery({
    queryKey: [
      'mostrar almacenes x sucursal',
      { id_producto: dataSelect.id, id_sucursal: sucursalesItemSelect?.id },
    ],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: sucursalesItemSelect?.id ?? 0,
      }),
    enabled: !!dataSelect.id,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>()

  const { isPending, mutate: doInsertar } = useMutation({
    mutationFn: insertar,
    mutationKey: ['insertar productos'],
    onError: (error: Error) => toast.error(`Error: ${error.message}`),
    onSuccess: () => {
      toast.success('Producto guardado correctamente')
      cerrarFormulario()
    },
  })

  const handlesub: SubmitHandler<FormData> = (data) => {
    doInsertar(data)
  }

  const cerrarFormulario = () => {
    onClose()
    setIsExploding(true)
  }

  async function insertar(data: FormData) {
    validarVacios(data)
    if (action === 'Editar') {
      const p = {
        id: dataSelect.id ?? 0,
        nombre: ConvertirMinusculas(data.nombre),
        precio_venta: parseFloat(data.precio_venta) || 0,
        precio_compra: parseFloat(data.precio_compra) || 0,
        id_categoria: categoriaItemSelect?.id ?? 0,
        codigo_barras: randomCodebarras ? randomCodebarras : codigogenerado,
        codigo_interno: randomCodeinterno ? randomCodeinterno : codigogenerado,
        id_empresa: dataempresa?.id ?? 0,
        stock: 0,
        stock_minimo: 0,
      }
      await editarProductos(p)
      if (stateInventarios) {
        if (!dataStockXAlmacenYProducto) {
          const pStock = {
            id_almacen: almacenSelectItem?.id ?? 0,
            id_producto: dataSelect?.id ?? 0,
            cantidad: parseFloat(data.stock),
            id_empresa: dataempresa?.id ?? 0,
          }
          await insertarStock(pStock)
        }
      }
    } else {
      const p = {
        nombre: ConvertirMinusculas(data.nombre),
        precio_venta: parseFloat(data.precio_venta) || 0,
        precio_compra: parseFloat(data.precio_compra) || 0,
        id_categoria: categoriaItemSelect?.id ?? 0,
        codigo_barras: randomCodebarras ? randomCodebarras : codigogenerado,
        codigo_interno: randomCodeinterno ? randomCodeinterno : codigogenerado,
        id_empresa: dataempresa?.id ?? 0,
        stock: 0,
        stock_minimo: 0,
      }

      const id_producto_nuevo = await insertarProductos(p)
      if (stateInventarios) {
        const pStock = {
          id_almacen: almacenSelectItem?.id ?? 0,
          id_producto: id_producto_nuevo,
          cantidad: parseFloat(data.stock) || 0,
          id_empresa: dataempresa?.id ?? 0,
        }

        await insertarStock(pStock)
      }
    }
  }

  function checkUseInventarios() {
    if (action === 'Editar') {
      if (dataalmacen && dataalmacen.length > 0) {
        if (stateInventarios) {
          Swal.fire({
            title: '¿Estás seguro(a)?',
            text: 'Si desactiva esta opción se eliminara el stock!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
          }).then(async (result) => {
            if (result.isConfirmed) {
              setStateInventarios(false)
              if (dataalmacen && dataalmacen[0]?.id) {
                await eliminarAlmacen({ id: dataalmacen[0].id })
              }
            }
          })
        } else {
          setStateInventarios(true)
        }
      } else {
        setStateInventarios(!stateInventarios)
      }
    } else {
      setStateInventarios(!stateInventarios)
    }
  }

  function validarVacios(data: FormData) {
    if (!randomCodeinterno) {
      generarCodigoInterno()
    }
    if (!randomCodebarras) {
      generarCodigoBarras()
    }
    if (data.precio_venta.trim() === '') {
      data.precio_venta = '0'
    }
    if (data.precio_compra.trim() === '') {
      data.precio_compra = '0'
    }
    if (stateInventarios) {
      if (!dataalmacen || dataalmacen.length === 0) {
        if (data.stock.trim() === '') {
          data.stock = '0'
        }
        if (data.stock_minimo.trim() === '') {
          data.stock_minimo = '0'
        }
      }
    }
  }

  function generarCodigoBarras() {
    const codigo = Math.random().toString().slice(2, 11)
    setRandomCodebarras(codigo)
  }

  function generarCodigoInterno() {
    const codigo = Math.random().toString().slice(2, 11)
    setRandomCodeinterno(codigo)
  }

  const handleChangeinterno = (event: ChangeEvent<HTMLInputElement>) => {
    setRandomCodeinterno(event.target.value)
  }

  const handleChangebarras = (event: ChangeEvent<HTMLInputElement>) => {
    setRandomCodebarras(event.target.value)
  }

  useEffect(() => {
    if (action !== 'Editar') {
      generarCodigoInterno()
    } else {
      if (dataSelect.id_categoria && dataSelect.categoria) {
        selectCategoria({
          id: dataSelect.id_categoria,
          nombre: dataSelect.categoria,
          id_empresa: dataempresa?.id ?? 0,
        })
      }
      setRandomCodeinterno(dataSelect.codigo_interno ?? '')
      setRandomCodebarras(dataSelect.codigo_barras ?? '')
      if (dataSelect.sevende_por === 'UNIDAD') {
        handleCheckboxChange(1)
      } else {
        handleCheckboxChange(2)
      }
      setStateInventarios(dataSelect.maneja_inventarios ?? false)
      setStateEnabledStock(dataSelect.maneja_inventarios ?? false)
    }
  }, [action, dataSelect, dataempresa, selectCategoria])

  return (
    <Container>
      {isPending ? (
        <span>...</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {action === 'Editar' ? 'Editar productos' : 'REGISTRAR NUEVO PRODUCTO'}
              </h1>
            </section>

            <section>
              <BtnClose
                funcion={() => {
                  if (typeof refetchs === 'function') {
                    refetchs()
                  }
                  onClose()
                }}
              />
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="seccion1">
              <article>
                <TextInput icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="text"
                    placeholder="nombre"
                    {...register('nombre', {
                      required: true,
                    })}
                  />
                  <label className="form__label">nombre</label>
                  {errors.nombre?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput icono={<v.iconoflechaderecha />}>
                  <input
                    step="0.01"
                    className="form__field"
                    defaultValue={dataSelect.precio_venta}
                    type="number"
                    placeholder="precio venta"
                    {...register('precio_venta')}
                  />
                  <label className="form__label">precio venta</label>
                </TextInput>
              </article>
              <article>
                <TextInput icono={<v.iconoflechaderecha />}>
                  <input
                    step="0.01"
                    className="form__field"
                    defaultValue={dataSelect.precio_compra}
                    type="number"
                    placeholder="precio compra"
                    {...register('precio_compra')}
                  />
                  <label className="form__label">precio compra</label>
                </TextInput>
              </article>
              <article className="contentPadregenerar">
                <TextInput icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    value={randomCodebarras}
                    onChange={handleChangebarras}
                    type="text"
                    placeholder="codigo de barras"
                  />
                  <label className="form__label">codigo de barras</label>
                </TextInput>
                <ContainerBtngenerar>
                  <GenerateCodeButton title="Generar" onClick={generarCodigoBarras} />
                </ContainerBtngenerar>
              </article>
              <article className="contentPadregenerar">
                <TextInput icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    value={randomCodeinterno}
                    onChange={handleChangeinterno}
                    type="text"
                    placeholder="codigo interno"
                  />
                  <label className="form__label">codigo interno</label>
                </TextInput>
                <ContainerBtngenerar>
                  <GenerateCodeButton title="Generar" onClick={generarCodigoInterno} />
                </ContainerBtngenerar>
              </article>
            </section>
            <section className="seccion2">
              <label>Se vende por: </label>
              <SelectorContainer>
                <label>UNIDAD </label>
                <Checkbox
                  isChecked={isChecked1}
                  onChange={() => handleCheckboxChange(1)}
                />
                <label>GRANEL(decimales) </label>
                <Checkbox
                  isChecked={isChecked2}
                  onChange={() => handleCheckboxChange(2)}
                />
              </SelectorContainer>

              <SelectorContainer>
                <label>Categoria: </label>
                <SelectList
                  data={datacategorias ?? []}
                  itemSelect={categoriaItemSelect}
                  onSelect={selectCategoria}
                  displayField="nombre"
                />
              </SelectorContainer>
              <SelectorContainer>
                <label>Controlar stock: </label>
                <Switch isOn={stateInventarios} onToggle={checkUseInventarios} />
              </SelectorContainer>
              {stateInventarios && (
                <ContainerStock>
                  <SelectorContainer>
                    <label>Sucursal: </label>
                    <SelectList
                      data={dataSucursales ?? []}
                      itemSelect={sucursalesItemSelect}
                      onSelect={selectSucursal}
                      displayField="nombre"
                    />
                  </SelectorContainer>
                  <br />
                  <SelectorContainer>
                    <label>Almacen: </label>
                    <SelectList
                      data={dataAlmacenes ?? []}
                      itemSelect={almacenSelectItem}
                      onSelect={setAlmacenSelectItem}
                      displayField="nombre"
                    />
                  </SelectorContainer>
                  {stateEnabledStock && dataStockXAlmacenYProducto && (
                    <ContainerMensajeStock>
                      <span>para editar el stock vaya al módulo de kardex</span>
                    </ContainerMensajeStock>
                  )}

                  <article>
                    <TextInput icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={!!dataStockXAlmacenYProducto}
                        className="form__field"
                        value={
                          action === 'Editar'
                            ? (dataStockXAlmacenYProducto?.cantidad?.toString() ?? stock)
                            : stock
                        }
                        step="0.01"
                        type="number"
                        placeholder="stock"
                        {...register('stock')}
                        onChange={(e) => setStock(e.target.value)}
                      />
                      <label className="form__label">stock</label>
                    </TextInput>
                  </article>
                  <article>
                    <TextInput icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={!!dataStockXAlmacenYProducto}
                        className="form__field"
                        value={stockMinimo}
                        step="0.01"
                        type="number"
                        placeholder="stock minimo"
                        {...register('stock_minimo')}
                        onChange={(e) => setStockMinimo(e.target.value)}
                      />
                      <label className="form__label">stock minimo</label>
                    </TextInput>
                  </article>
                  <article>
                    <TextInput icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={!!dataStockXAlmacenYProducto}
                        className="form__field"
                        value={ubicacion}
                        type="text"
                        placeholder="ubicacion"
                        {...register('ubicacion')}
                        onChange={(e) => setUbicacion(e.target.value)}
                      />
                      <label className="form__label">Ubicacion</label>
                    </TextInput>
                  </article>
                </ContainerStock>
              )}
            </section>

            <Button icon={<v.iconoguardar />} title="Guardar" bgColor="#F9D70B" />
          </form>
        </div>
      )}
    </Container>
  )
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);

  .sub-contenedor {
    position: relative;
    background: ${({ theme }) => theme.backgroundSecondarytotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 13px 36px;
    z-index: 100;
    height: calc(100vh - 40px);
    overflow-y: auto;
    border-radius: 8px;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 30px;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      .seccion1,
      .seccion2 {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .contentPadregenerar {
        position: relative;
      }
    }
  }
`

const ContainerStock = styled.div`
  border: 1px solid rgba(240, 104, 46, 0.9);
  display: flex;
  border-radius: 15px;
  padding: 12px;
  flex-direction: column;
  background-color: rgba(240, 127, 46, 0.05);
`

const ContainerBtngenerar = styled.div`
  position: absolute;
  right: 0;
  top: 10%;
`

const ContainerMensajeStock = styled.div`
  text-align: center;
  color: #f9184c;
  background-color: rgba(249, 24, 61, 0.2);
  border-radius: 10px;
  padding: 5px;
  margin: 10px;
  font-weight: 600;
`
