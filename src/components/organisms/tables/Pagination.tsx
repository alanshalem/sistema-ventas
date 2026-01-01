import type { Table } from "@tanstack/react-table"
import styled from "styled-components"

import { v } from "../../../styles/variables"
import { Button } from "../../molecules/Button"

interface PaginationProps<TData> {
  readonly table: Table<TData>
}

export function Pagination<TData>({ table }: Readonly<PaginationProps<TData>>) {
  return (
    <Container>
      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
        bgColor="#F3D20C"
        icon={<v.iconotodos />}
      />

      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        bgColor="#F3D20C"
        icon={<v.iconoflechaizquierda />}
      />

      <span>{table.getState().pagination.pageIndex + 1}</span>
      <p> de {table.getPageCount()} </p>

      <Button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        bgColor="#F3D20C"
        icon={<v.iconoflechaderecha />}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`
