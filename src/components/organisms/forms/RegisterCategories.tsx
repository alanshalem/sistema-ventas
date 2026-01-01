import { useState } from 'react'
import type { ColorResult } from 'react-color'
import { CirclePicker } from 'react-color'
import styled from 'styled-components'

import { Button, TextInput, useCategoriasStore } from '../../../index'
import { v } from '../../../styles/variables'
import { Icon } from '../../atoms/Icon'

interface RegisterCategoriesProps {
  readonly onClose: () => void
  readonly dataSelect: {
    id: number
    nombre: string
    color: string
    icono: string
  }
  readonly action: string
  readonly setIsExploding: (value: boolean) => void
}

export function RegisterCategories({
  onClose,
  dataSelect,
  action,
}: Omit<Readonly<RegisterCategoriesProps>, 'setIsExploding'>) {
  const { insertarCategorias, editarCategoria } = useCategoriasStore()
  // Remove unused destructuring warning
  void insertarCategorias
  void editarCategoria

  const [currentColor, setColor] = useState('#F44336')
  const [fileurl, setFileurl] = useState<string>()

  function elegirColor(color: ColorResult) {
    setColor(color.hex)
  }

  useState(() => {
    if (action === 'Editar') {
      setColor(dataSelect.color)
      setFileurl(dataSelect.icono)
    }
  })

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {action === 'Editar' ? 'Editar categoria' : 'Registrar nueva categoria'}
            </h1>
          </section>
        </div>

        <PictureContainer>
          {fileurl ? (
            <div className="ContentImage">
              <img src={fileurl} alt="categoria" />
            </div>
          ) : (
            <Icon>{<v.iconoimagenvacia />}</Icon>
          )}

          <Button
            title="+imagen(opcional)"
            color="#5f5f5f"
            bgColor="rgb(183, 183, 182)"
            icon={<v.iconosupabase />}
          />
        </PictureContainer>

        <div className="formulario">
          <section className="form-subcontainer">
            <article>
              <TextInput icono={<v.iconoflechaderecha />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.nombre}
                  type="text"
                  placeholder="categoria"
                />
                <label className="form__label">categoria</label>
              </TextInput>
            </article>

            <article className="colorContainer">
              <ContentTitle>
                {<v.paletacolores />}
                <span>Color</span>
              </ContentTitle>
              <div className="colorPickerContent">
                <CirclePicker onChange={elegirColor} color={currentColor} />
              </div>
            </article>

            <Button
              onClick={() => {
                onClose()
              }}
              icon={<v.iconoguardar />}
              title="Guardar"
              bgColor="#F9D70B"
            />
          </section>
        </div>
      </div>
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

  .sub-contenedor {
    width: 90%;
    max-width: 500px;
    margin: auto;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .headers {
    section {
      display: flex;
      justify-content: center;
      align-items: center;

      h1 {
        font-size: 25px;
        font-weight: bold;
        color: ${({ theme }) => theme.text};
        text-align: center;
      }
    }
  }

  .formulario {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;

    .form-subcontainer {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }

  .colorContainer {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .colorPickerContent {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const PictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 20px 0;

  .ContentImage {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  input {
    display: none;
  }
`

const ContentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
`
