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

import { useGlobalStore } from '../../../store/GlobalStore'
import { v } from '../../../styles/variables'
import { useEditarSerializacionDefaultMutation } from '../../../tanstack/SerializacionStack'
import { Check } from '../../ui/toggles/Check'
import { Pagination } from './Pagination'
import { TableActionsContent } from './TableActionsContent'

interface TipoComprobante {
  nombre: string
}

interface Serialization {
  id: number
  tipo_comprobantes: TipoComprobante
  serie: string
  correlativo: string
  por_default: boolean
}

interface SerializationsTableProps {
  readonly data: Serialization[]
}

export function SerializationsTable({ data }: Readonly<SerializationsTableProps>) {
  if (data == null) return null

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { setStateClose, setItemSelect, setAccion } = useGlobalStore()
  const { mutate: mutateEditDefault } = useEditarSerializacionDefaultMutation()

  function handleEditDefault(item: Serialization) {
    setItemSelect(item)
    mutateEditDefault()
  }

  function handleEdit(item: Serialization) {
    setStateClose(true)
    setItemSelect(item)
    setAccion('Editar')
  }

  const columns: ColumnDef<Serialization>[] = [
    {
      accessorKey: 'tipo_comprobantes.nombre',
      header: 'Comprobante',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'serie',
      header: 'Serie',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'correlativo',
      header: 'Correlativo',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'por_default',
      header: 'Por default',
      cell: (info) => (
        <div className="ContentCell">
          <Check
            onChange={() => handleEditDefault(info.row.original)}
            checked={info.getValue() as boolean}
          />
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'acciones',
      header: '',
      enableSorting: false,
      cell: (info) => (
        <div data-title="Acciones" className="ContentCell">
          <TableActionsContent onEdit={() => handleEdit(info.row.original)} />
        </div>
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
    font-size: 0.9em;
    .ContentCell {
      display: flex;
      margin: auto;
      justify-content: center;
    }
    @media (max-width: 768px) {
      font-size: 0.8em;
      transform: scale(0.9);
    }

    thead {
      position: relative;
      padding: 0;
      border: 0;
      height: auto;
      width: auto;
      overflow: auto;

      th {
        border-bottom: 1px solid ${({ theme }) => theme.neutral};
        font-weight: 700;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody {
      tr {
        display: table-row;
        margin-bottom: 0;
        &:nth-of-type(even) {
          background-color: rgba(161, 161, 161, 0.1);
        }
        td {
          text-align: center;
          padding: 0.5em;
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);

          @media (max-width: 768px) {
            padding: 0.4em;
          }
        }
      }
    }
  }
`
