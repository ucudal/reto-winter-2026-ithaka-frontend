import { TablePagination } from "@mui/material";

/**
 * Pager reutilizable para listados.
 *
 * El backend pagina con page/page_size pero devuelve una lista sin total, asi
 * que cuando la paginacion es del servidor usamos count={-1} (total desconocido)
 * y habilitamos "siguiente" solo si la pagina vino llena. En la ultima pagina el
 * total ya es exacto y se muestra como tal.
 *
 * Si el listado se pagina en memoria (total conocido), pasar totalCount.
 */
export default function PaginationControls({
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  hasNextPage = false,
  loadedRows = 0,
  totalCount = null,
  rowsPerPageOptions = [5, 10, 25],
  sx,
}) {
  const isServerPaginated = totalCount == null;
  const count = isServerPaginated
    ? hasNextPage
      ? -1
      : page * rowsPerPage + loadedRows
    : totalCount;

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={rowsPerPageOptions}
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(event, newPage) => onPageChange(newPage)}
      onRowsPerPageChange={(event) =>
        onRowsPerPageChange(parseInt(event.target.value, 10))
      }
      labelRowsPerPage="Filas por página:"
      labelDisplayedRows={({ from, to, count: total }) =>
        total === -1
          ? `${from}-${to} de más de ${to}`
          : `${from}-${to} de ${total}`
      }
      nextIconButtonProps={
        isServerPaginated ? { disabled: !hasNextPage } : undefined
      }
      sx={sx}
    />
  );
}
