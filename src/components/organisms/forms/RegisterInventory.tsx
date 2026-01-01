import { useEffect } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import {
  Button,
  TextInput,
  useAlmacenesStore,
  useProductosStore,
  useSucursalesStore,
} from '../../../index'
import { useGlobalStore } from '../../../store/GlobalStore'
import { useMovStockStore } from '../../../store/MovStockStore'
import { v } from '../../../styles/variables'
import { useMostrarAlmacenesXSucursalInventarioQuery } from '../../../tanstack/AlmacenesStack'
import { useInsertarMovStockMutation } from '../../../tanstack/MovStockStack'
import { useBuscarProductosQuery } from '../../../tanstack/ProductosStack'
import { useMostrarStockXAlmacenYProductoQuery } from '../../../tanstack/StockStack'
import { useMostrarSucursalesQuery } from '../../../tanstack/SucursalesStack'
import { SelectorContainer } from '../../atoms/SelectorContainer'
import { BtnClose } from '../../ui/buttons/BtnClose'
import { BuscadorList } from '../../ui/lists/BuscadorList'
import { SelectList } from '../../ui/lists/SelectList'
import { MessageComponent } from '../../ui/messages/MessageComponent'
import { RadioChecks } from '../../ui/toggles/RadioChecks'

interface RegisterInventoryFormData {
  cantidad: string
  precio_compra: number
  precio_venta: number
}

export function RegisterInventory() {
  const { setStateClose } = useGlobalStore()

  const { tipo, setTipo } = useMovStockStore()
  const {
    selectProductos,
    setBuscador,
    productosItemSelect,
    dataProductos,
    resetProductosItemSelect,
  } = useProductosStore()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<RegisterInventoryFormData>({
    defaultValues: {
      precio_compra: productosItemSelect?.precio_compra,
      precio_venta: productosItemSelect?.precio_venta,
    },
  })

  useEffect(() => {
    if (productosItemSelect) {
      reset({
        cantidad: '',
        precio_compra: productosItemSelect.precio_compra ?? 0,
        precio_venta: productosItemSelect.precio_venta ?? 0,
      })
    }
  }, [productosItemSelect, reset])

  useBuscarProductosQuery()
  const { selectSucursal, sucursalesItemSelect } = useSucursalesStore()

  const { data: dataSucursales, isLoading: isLoadingSucursal } =
    useMostrarSucursalesQuery()
  const { data: dataAlmacenes, isLoading: isLoadingAlmacenes } =
    useMostrarAlmacenesXSucursalInventarioQuery()

  const { setAlmacenSelectItem, almacenSelectItem } = useAlmacenesStore()

  const { data: dataStock } = useMostrarStockXAlmacenYProductoQuery()

  const { mutate, isPending } = useInsertarMovStockMutation()

  const isLoading = isLoadingSucursal || isLoadingAlmacenes
  if (isLoading) {
    return <span>cargando almacenes...</span>
  }

  const handleFormSubmit: SubmitHandler<RegisterInventoryFormData> = (data) => {
    mutate(data)
  }

  return (
    <Container>
      {isPending ? (
        <span>guardando...</span>
      ) : (
        <div className="sub-contenedor">
          <RadioChecks tipo={tipo} setTipo={setTipo} />
          <div className="headers">
            <section>
              <h1>{tipo === 'entrada' ? 'REGISTRAR ENTRADA' : 'REGISTRAR SALIDA'}</h1>
            </section>

            <section>
              <BtnClose
                funcion={() => {
                  resetProductosItemSelect()
                  setStateClose(false)
                }}
              />
            </section>
          </div>
          <section className="containerListas">
            <BuscadorList
              data={dataProductos}
              onSelect={selectProductos}
              setBuscador={setBuscador}
            />
            <span>
              Producto:{' '}
              <strong>
                {productosItemSelect?.nombre ? productosItemSelect?.nombre : '-'}{' '}
              </strong>
            </span>
            <span>
              Stock: <strong>{dataStock?.cantidad ? dataStock?.cantidad : '-'} </strong>
            </span>

            <SelectorContainer>
              <label>Sucursal:</label>
              <SelectList
                data={dataSucursales}
                itemSelect={sucursalesItemSelect}
                onSelect={selectSucursal}
                displayField="nombre"
              />
            </SelectorContainer>
            <SelectorContainer>
              <label>Almacen:</label>
              <SelectList
                data={dataAlmacenes ?? undefined}
                itemSelect={almacenSelectItem}
                onSelect={setAlmacenSelectItem}
                displayField="nombre"
              />
            </SelectorContainer>
          </section>
          {productosItemSelect?.maneja_inventarios ? (
            <form className="formulario" onSubmit={handleSubmit(handleFormSubmit)}>
              <section className="form-subcontainer">
                <article>
                  <TextInput icono={<v.iconoflechaderecha />}>
                    <input
                      className="form__field"
                      type="number"
                      {...register('cantidad', {
                        required: true,
                      })}
                    />
                    <label className="form__label">Cantidad</label>
                    {errors.cantidad?.type === 'required' && <p>Campo requerido</p>}
                  </TextInput>
                </article>
                <article>
                  <TextInput icono={<v.iconoflechaderecha />}>
                    <input
                      className="form__field"
                      type="number"
                      {...register('precio_compra', {
                        required: true,
                      })}
                    />
                    <label className="form__label">Precio costo</label>
                    {errors.precio_compra?.type === 'required' && <p>Campo requerido</p>}
                  </TextInput>
                </article>
                <article>
                  <TextInput icono={<v.iconoflechaderecha />}>
                    <input
                      className="form__field"
                      type="number"
                      {...register('precio_venta', {
                        required: true,
                      })}
                    />
                    <label className="form__label">Precio venta</label>
                    {errors.precio_venta?.type === 'required' && <p>Campo requerido</p>}
                  </TextInput>
                </article>

                <Button
                  disabled={!productosItemSelect?.nombre}
                  icon={<v.iconoguardar />}
                  title="Guardar"
                  bgColor="#F9D70B"
                />
              </section>
            </form>
          ) : (
            <MessageComponent
              text={
                productosItemSelect?.nombre
                  ? 'Este producto no maneja inventarios, dirijase a configuración > productos y realice el cambio '
                  : 'Busque un producto'
              }
            />
          )}
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
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.background};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .containerListas {
      gap: 20px;
      display: flex;
      flex-direction: column;
    }
    .contentSucursal {
      display: flex;
      gap: 10px;
    }
    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        font-size: 30px;
        font-weight: 700;
        text-transform: uppercase;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      .form-subcontainer {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }
  }
`
