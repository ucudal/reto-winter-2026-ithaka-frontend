import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

import { getStudents } from '../../api/endpoints/students'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    try {
      setLoading(true)
      setError('')

      const data = await getStudents()
      const items = Array.isArray(data) ? data : data?.items ?? []
      setStudents(items)
    } catch (err) {
      setError(err?.message || 'No se pudieron cargar los alumnos.')
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim()

    return students.filter((student) => {
      const matchesSearch =
        !term ||
        [
          student?.name,
          student?.email,
          student?.major,
          String(student?.group_id ?? ''),
          String(student?.id ?? ''),
        ]
          .join(' ')
          .toLowerCase()
          .includes(term)

      const matchesFilter = filter === 'all' || filter === 'active'

      return matchesSearch && matchesFilter
    })
  }, [students, search, filter])

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Inicio / Alumnos
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            Alumnos
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ px: 2.5, boxShadow: 2, textTransform: 'uppercase' }}
        >
          Nuevo alumno
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
          <TextField
            fullWidth
            label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ingrese un dato"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            size="small"
            label="Filtrar por"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ maxWidth: { md: 220 } }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Activo</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Paper sx={{ overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Account status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const initials = (student?.name || 'U')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()

                    return (
                      <TableRow key={student.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'grey.400' }}>
                              {initials}
                            </Avatar>
                            <Typography variant="body2">{student.name || '-'}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>{student.email || '-'}</TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">{student.major || '-'}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label="Active"
                            size="small"
                            sx={{
                              height: 24,
                              borderRadius: 999,
                              bgcolor: 'grey.100',
                              color: 'text.primary',
                            }}
                          />
                        </TableCell>

                        <TableCell>{student.id ?? '-'}</TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <IconButton size="small" aria-label="Editar alumno">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label="Eliminar alumno"
                              color="default"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      No hay alumnos para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  )
}

export default Students
