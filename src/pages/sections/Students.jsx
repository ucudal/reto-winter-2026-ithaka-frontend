import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
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
} from '@mui/material'

import { Link as RouterLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import { getStudents } from '../../api/endpoints/students'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('name')

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
    return students.filter((student) => {
      const valueToSearch =
        student[filter]?.toString().toLowerCase() || ''

      return valueToSearch.includes(search.toLowerCase())
    })
  }, [students, search, filter])


  return (
    <Box sx={{ width: '100%' }}>

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
        >
          Inicio
        </Link>

        <Typography color="text.primary">
          Alumnos
        </Typography>
      </Breadcrumbs>


      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >

        <Typography variant="h4">
          Alumnos
        </Typography>


        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ height: 40 }}
        >
          Nuevo alumno
        </Button>

      </Box>


      <Paper sx={{ p: 2, borderRadius: 2 }}>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            alignItems: 'stretch',
          }}
        >

          <TextField
            label="Buscar"
            placeholder="Ingrese un dato"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 60,
              },
            }}
          />


          <TextField
            select
            label="Filtrar por"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                height: 60,
              },
            }}
          >

            <MenuItem value="name">
              Nombre
            </MenuItem>

            <MenuItem value="email">
              Email
            </MenuItem>

            <MenuItem value="major">
              Carrera
            </MenuItem>

          </TextField>

        </Box>


        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}


        {
          loading ? (

            <Box
              sx={{
                py: 8,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>

          ) : (

            <TableContainer>

              <Table>

                <TableHead>

                  <TableRow>

                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Usuario
                    </TableCell>

                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Email
                    </TableCell>

                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Carrera
                    </TableCell>

                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Estado
                    </TableCell>

                    <TableCell sx={{ fontWeight: 'bold' }}>
                      ID
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Acciones
                    </TableCell>

                  </TableRow>

                </TableHead>


                <TableBody>

                  {filteredStudents.map((student) => {

                    const initials =
                      (student.name || 'U')
                        .split(' ')
                        .filter(Boolean)
                        .map((part) => part[0])
                        .join('')
                        .toUpperCase()


                    return (

                      <TableRow
                        key={student.id}
                        hover
                      >

                        <TableCell>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >

                            <Avatar
                              sx={{
                                bgcolor: 'action.selected',
                                color: 'text.secondary',
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem',
                              }}
                            >
                              {initials}
                            </Avatar>


                            <Typography
                              variant="body2"
                              fontWeight="medium"
                            >
                              {student.name || '-'}
                            </Typography>

                          </Box>

                        </TableCell>


                        <TableCell>
                          {student.email || '-'}
                        </TableCell>


                        <TableCell>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >

                            <SchoolOutlinedIcon
                              sx={{
                                fontSize: 18,
                                color: 'text.secondary',
                              }}
                            />

                            <Typography variant="body2">
                              {student.major || '-'}
                            </Typography>

                          </Stack>

                        </TableCell>


                        <TableCell>

                          <Chip
                            label="Activo"
                            size="small"
                            color="success"
                          />

                        </TableCell>


                        <TableCell>
                          {student.id ?? '-'}
                        </TableCell>


                        <TableCell align="right">

                          <IconButton
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>


                          <IconButton
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>

                        </TableCell>


                      </TableRow>

                    )

                  })}


                </TableBody>

              </Table>

            </TableContainer>

          )
        }

      </Paper>

    </Box>
  )
}

export default Students
