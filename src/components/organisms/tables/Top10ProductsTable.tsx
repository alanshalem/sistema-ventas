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

interface Top10Product {
  nombre_producto: string
  total_vendido: number
  porcentaje: string
}

interface Top10ProductsTableProps {
  readonly data: Top10Product[]
  readonly setOpenRegister: (open: boolean) => void
  readonly setSelectedData: (data: Top10Product) => void
  readonly setAction: (action: string) => void
}

export function Top10ProductsTable({
  data,
}: Readonly<Top10ProductsTableProps>) {
  if (data == null) return null

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const columns: ColumnDef<Top10Product>[] = [
    {
      accessorKey: 'nombre_producto',
      header: 'Producto',
      cell: (info) => <span>{info.getValue() as string}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'total_vendido',
      header: 'Total',
      cell: (info) => <span>{info.getValue() as number}</span>,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'porcentaje',
      header: '%',
      cell: (info) => <span>{info.getValue() as string}</span>,
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
