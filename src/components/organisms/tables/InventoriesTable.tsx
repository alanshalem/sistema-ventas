import { useQueryClient } from '@tanstack/react-query'
import type { ColumnDef, ColumnFiltersState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { FaArrowsAltV } from 'react-icons/fa'
import styled from 'styled-components'
import Swal from 'sweetalert2'

import { useUsuariosStore } from '../../../store/UsuariosStore'
import { v } from '../../../styles/variables'
import { Pagination } from './Pagination'

interface Almacen {
  nombre: string
  sucursales?: {
    nombre: string
  }
}

interface InventoryMovement {
  id: number
  fecha: string
  almacen: Almacen
  detalle: string
  origen: string
  tipo_movimiento: string
  cantidad: number
  id_usuario?: number
}

interface InventoriesTableProps {
  readonly data: InventoryMovement[]
  readonly setOpenRegister: (open: boolean) => void
  readonly setSelectedData: (data: InventoryMovement) => void
  readonly setAction: (action: string) => void
}

export function InventoriesTable({
  data,
  setOpenRegister,
  setSelectedData,
  setAction,
}: Readonly<InventoriesTableProps>) {
  if (data == null) return null

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const queryClient = useQueryClient()
  const { eliminarUsuarioAsignado } = useUsuariosStore()

  function handleDelete(item: InventoryMovement) {
    Swal.fire({
      title: '¿Estás seguro(a)(e)?',
      text: 'Una vez eliminado, ¡no podrá recuperar este registro!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed && item.id_usuario) {
        await eliminarUsuarioAsignado({ id: item.id_usuario })
        queryClient.invalidateQueries({ queryKey: ['mostrar usuarios asignados'] })
      }
    })
  }

  function handleEdit(item: InventoryMovement) {
    setOpenRegister(true)
    setSelectedData(item)
    setAction('Editar')
  }

  const columns: ColumnDef<InventoryMovement>[] = [
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'almacen.sucursales.nombre',
      header: 'Sucursal',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'almacen.nombre',
      header: 'Almacen',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'detalle',
      header: 'Movimiento',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'origen',
      header: 'Origen',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'tipo_movimiento',
      header: 'Tipo',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'cantidad',
      header: 'Cantidad',
      cell: (info) => <span>{info.getValue() as number}</span>,
      enableColumnFilter: true,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
  })

  return (
    <Container>
      <table className="responsive-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.column.columnDef.header}
                  {header.column.getCanSort() && (
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <FaArrowsAltV />
                    </span>
                  )}
                  {
                    {
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string]
                  }
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((item) => (
            <tr key={item.id}>
              {item.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination table={table} />
    </Container>
  )
}

const Container = styled.div`
  position: relative;

  margin: 5% 3%;
  @media (min-width: ${v.bpbart}) {
    margin: 2%;
  }
  @media (min-width: ${v.bphomer}) {
    margin: 2em auto;
  }
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    @media (min-width: ${v.bpbart}) {
      font-size: 0.9em;
    }
    @media (min-width: ${v.bpmarge}) {
      font-size: 1em;
    }
    thead {
      position: absolute;
      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;

      @media (min-width: ${v.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
      }
      th {
        border-bottom: 2px solid ${({ theme }) => theme.neutral};
        font-weight: 700;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
    }
    tr {
      @media (min-width: ${v.bpbart}) {
        display: table-row;
      }
    }

    th,
    td {
      padding: 0.5em;
      vertical-align: middle;
      @media (min-width: ${v.bplisa}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bpbart}) {
        display: table-cell;
        padding: 0.5em;
      }
      @media (min-width: ${v.bpmarge}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bphomer}) {
        padding: 0.75em;
      }
    }
    tbody {
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }
      tr {
        margin-bottom: 1em;
        &:nth-of-type(even) {
          background-color: rgba(161, 161, 161, 0.1);
        }
        @media (min-width: ${v.bpbart}) {
          display: table-row;
          border-width: 1px;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      th[scope='row'] {
        @media (min-width: ${v.bplisa}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        }
        @media (min-width: ${v.bpbart}) {
          background-color: transparent;
          text-align: center;
          color: ${({ theme }) => theme.text};
        }
      }
      .ContentCell {
        text-align: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;

        border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        @media (min-width: ${v.bpbart}) {
          justify-content: center;
          border-bottom: none;
        }
      }
      td {
        text-align: right;
        @media (min-width: ${v.bpbart}) {
          text-align: center;
        }
      }
      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.8em;
        @media (min-width: ${v.bplisa}) {
          font-size: 0.9em;
        }
        @media (min-width: ${v.bpbart}) {
          content: none;
        }
      }
    }
  }
`
