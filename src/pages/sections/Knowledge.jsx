import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'

// import { apiClient } from '../../api/client' // Línea para llamar a la API real, actualmente comentada para usar datos mockeados
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'

const columns = [
  { id: 'id', label: 'ID', width: '10%' },
  { id: 'stage_id', label: 'Etapa', width: '15%' },
  { id: 'title', label: 'Título', width: '30%' },
  { id: 'url', label: 'URL', width: '35%' },
]

const tableColumnCount = columns.length + 1

const mockMaterials = [
  {
    id: 12,
    stage_id: 2,
    title: 'Business Model Canvas Template',
    url: 'https://drive.google.com/bmc-template',
  },
  {
    id: 13,
    stage_id: 1,
    title: 'Guía para definir el problema',
    url: 'https://drive.google.com/problem-guide',
  },
  {
    id: 14,
    stage_id: 3,
    title: 'Plantilla de propuesta de valor',
    url: 'https://drive.google.com/value-proposition',
  },
]

function Knowledge() {
  const [materials, setMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedView, setSelectedView] = useState('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')

  const filteredMaterials = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('es')

    if (!normalizedSearch) return materials

    const fieldsToSearch =
      filterBy === 'all'
        ? columns.map((column) => column.id)
        : [filterBy]

    return materials.filter((material) =>
      fieldsToSearch.some((field) =>
        String(material[field] ?? '')
          .toLocaleLowerCase('es')
          .includes(normalizedSearch),
      ),
    )
  }, [filterBy, materials, searchTerm])

  const loadMaterials = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Llamada real a la API:
      // const { data } = await apiClient.get('/materials')
      // setMaterials(Array.isArray(data) ? data : [])

      // Datos mockeados:
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simula un retraso de 500 ms para la carga de datos
      setMaterials(mockMaterials)
    } catch (requestError) {
      setError(requestError)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMaterials()
  }, [loadMaterials])

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Materiales
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="materials-view-label">Vista</InputLabel>
            <Select
              labelId="materials-view-label"
              id="materials-view"
              value={selectedView}
              label="Vista"
              onChange={(event) => setSelectedView(event.target.value)}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {value === 'list' ? (
                    <ViewListIcon fontSize="small" />
                  ) : (
                    <GridViewIcon fontSize="small" />
                  )}
                  <span>{value === 'list' ? 'Tabla' : 'Galería'}</span>
                </Box>
              )}
            >
              <MenuItem value="list">
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <ViewListIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Tabla</ListItemText>
              </MenuItem>
              <MenuItem value="gallery">
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <GridViewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Galería</ListItemText>
              </MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained">+ Crear Material</Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          mb: 2,
        }}
      >
        <TextField
          id="materials-search"
          label="Buscar"
          placeholder="Ingrese un dato"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          size="small"
          fullWidth
        />

        <FormControl size="small" sx={{ minWidth: 210 }}>
          <InputLabel id="materials-filter-label">Filtrar por</InputLabel>
          <Select
            labelId="materials-filter-label"
            id="materials-filter"
            value={filterBy}
            label="Filtrar por"
            onChange={(event) => setFilterBy(event.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {columns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error ? (
        <ErrorState
          title="No se pudieron cargar los materiales"
          message={error.message}
          onRetry={loadMaterials}
        />
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 1,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Table aria-label="Tabla de materiales" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      width: column.width,
                      py: 1.5,
                      fontWeight: 600,
                      color: 'text.primary',
                      bgcolor: 'grey.50',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    width: '10%',
                    py: 1.5,
                    fontWeight: 600,
                    color: 'text.primary',
                    bgcolor: 'grey.50',
                  }}
                >
                  
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumnCount}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <CircularProgress
                      size={32}
                      aria-label="Cargando materiales"
                    />
                  </TableCell>
                </TableRow>
              ) : filteredMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableColumnCount} sx={{ p: 0 }}>
                    <EmptyState
                      title={
                        materials.length === 0
                          ? 'No hay materiales para mostrar'
                          : 'No se encontraron materiales'
                      }
                      description={
                        materials.length === 0
                          ? 'Los materiales que se agreguen aparecerán en esta tabla.'
                          : 'Probá con otro término o criterio de búsqueda.'
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id} hover>
                    <TableCell>{material.id}</TableCell>
                    <TableCell>{material.stage_id}</TableCell>
                    <TableCell>{material.title}</TableCell>

                    <TableCell sx={{ overflow: 'hidden' }}>
                      <Link
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {material.url}
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          aria-label={`Editar ${material.id}`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          aria-label={`Eliminar ${material.id}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default Knowledge
