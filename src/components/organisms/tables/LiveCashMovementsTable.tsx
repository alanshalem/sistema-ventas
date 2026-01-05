import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table'
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

import { Pagination } from './Pagination'

interface CashMovement {
  fecha_movimiento: string
  caja_nombre: string
  tipo_movimiento: string
  usuario_nombre: string
  monto: number
}

interface LiveCashMovementsTableProps {
  readonly data: CashMovement[]
  readonly setOpenRegister: (open: boolean) => void
  readonly setSelectedData: (data: CashMovement) => void
  readonly setAction: (action: string) => void
}

export function LiveCashMovementsTable({
  data,
}: Readonly<LiveCashMovementsTableProps>) {
  if (data == null) return null

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const columns: ColumnDef<CashMovement>[] = [
    {
      accessorKey: 'fecha_movimiento',
      header: 'Fecha',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'caja_nombre',
      header: 'Caja',
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
      accessorKey: 'usuario_nombre',
      header: 'Usuario',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'monto',
      header: 'Monto',
      cell: (info) => <span>{info.getValue() as number}</span>,
      enableColumnFilter: true,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
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
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    font-size: 0.9em;
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
