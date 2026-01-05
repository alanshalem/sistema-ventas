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
import { toast } from 'sonner'
import styled from 'styled-components'
import Swal from 'sweetalert2'

import { useMetodosPagoStore } from '../../../store/MetodosPagoStore'
import { v } from '../../../styles/variables'
import { Icon } from '../../atoms/Icon'
import { ImageContent } from '../../molecules/ImageContent'
import { Pagination } from './Pagination'
import { TableActionsContent } from './TableActionsContent'

interface PaymentMethod {
  id: number
  nombre: string
  icono?: string
  delete_update?: boolean
}

interface PaymentMethodsTableProps {
  readonly data: PaymentMethod[]
  readonly setOpenRegister: (open: boolean) => void
  readonly setSelectedData: (data: PaymentMethod) => void
  readonly setAction: (action: string) => void
}

export function PaymentMethodsTable({
  data,
  setOpenRegister,
  setSelectedData,
  setAction,
}: Readonly<PaymentMethodsTableProps>) {
  if (data == null) return null

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const queryClient = useQueryClient()
  const { eliminarMetodosPago } = useMetodosPagoStore()

  function handleDelete(item: PaymentMethod) {
    if (item.delete_update === false) {
      toast.error(
        'Oops... Este registro no se permite eliminar ya que es valor por defecto.'
      )
      return
    }
    Swal.fire({
      title: '¿Estás seguro(a)(e)?',
      text: 'Una vez eliminado, ¡no podrá recuperar este registro!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarMetodosPago({ id: item.id })
        queryClient.invalidateQueries({ queryKey: ['mostrar metodos pago'] })
      }
    })
  }

  function handleEdit(item: PaymentMethod) {
    if (item.delete_update === false) {
      toast.error(
        'Oops... Este registro no se permite modificar ya que es valor por defecto.'
      )
      return
    }
    setOpenRegister(true)
    setSelectedData(item)
    setAction('Editar')
  }

  const columns: ColumnDef<PaymentMethod>[] = [
    {
      accessorKey: 'icono',
      header: 'Icono',
      enableSorting: false,
      cell: (info) => (
        <td data-title="Color" className="ContentCell">
          {info.getValue() !== '-' ? (
            <ImageContent image={info.getValue() as string} />
          ) : (
            <Icon>{<v.emptyImageIcon />}</Icon>
          )}
        </td>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'nombre',
      header: 'Descripcion',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'acciones',
      header: '',
      enableSorting: false,
      cell: (info) => (
        <td data-title="Acciones" className="ContentCell">
          <TableActionsContent
            onEdit={() => handleEdit(info.row.original)}
            onDelete={() => handleDelete(info.row.original)}
          />
        </td>
      ),
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
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
