<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react'

=======
import { useEffect, useMemo, useState } from "react";
>>>>>>> origin/testing
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
<<<<<<< HEAD
} from '@mui/material'

import { Link as RouterLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'

import { getStudents } from '../../api/endpoints/students'
import EmptyState from "../../components/common/EmptyState";

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('name')
=======
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import { getStudents } from "../../api/endpoints/students";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
>>>>>>> origin/testing

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      setError("");

<<<<<<< HEAD
      const data = await getStudents()
      const items = Array.isArray(data) ? data : data?.items ?? []

      setStudents(items)
=======
      const data = await getStudents();
      const items = Array.isArray(data) ? data : (data?.items ?? []);
      setStudents(items);
>>>>>>> origin/testing
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los alumnos.");
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = useMemo(() => {
<<<<<<< HEAD
    return students.filter((student) => {
      const valueToSearch =
        student[filter]?.toString().toLowerCase() || ''

      return valueToSearch.includes(search.toLowerCase())
    })
  }, [students, search, filter])
=======
    const term = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        !term ||
        [
          student?.name,
          student?.email,
          student?.major,
          String(student?.group_id ?? ""),
          String(student?.id ?? ""),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesFilter = filter === "all" || filter === "active";

      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);
>>>>>>> origin/testing


  return (
<<<<<<< HEAD
    <Box sx={{ width: '100%' }}>

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
=======
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
>>>>>>> origin/testing
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
<<<<<<< HEAD
          sx={{ height: 40 }}
=======
          sx={{ px: 2.5, boxShadow: 2, textTransform: "uppercase" }}
>>>>>>> origin/testing
        >
          Nuevo alumno
        </Button>

<<<<<<< HEAD
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

=======
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
>>>>>>> origin/testing
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


<<<<<<< HEAD
        {loading ? (

          <Box
            sx={{
              py: 8,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
=======
      <Paper sx={{ overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
>>>>>>> origin/testing
            <CircularProgress />
          </Box>

        ) : (

          <TableContainer>

            <Table>

              <TableHead>

                <TableRow>
<<<<<<< HEAD

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

=======
                  <TableCell sx={{ fontWeight: 600 }}>Alumno</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Carrera</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Estado de cuenta
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Acciones
                  </TableCell>
>>>>>>> origin/testing
                </TableRow>

              </TableHead>


              <TableBody>

                {filteredStudents.length > 0 ? (

                  filteredStudents.map((student) => {
<<<<<<< HEAD

                    const initials =
                      (student.name || 'U')
                        .split(' ')
                        .filter(Boolean)
                        .map((part) => part[0])
                        .join('')
                        .toUpperCase()

=======
                    const initials = (student?.name || "U")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase();
>>>>>>> origin/testing

                    return (

                      <TableRow
                        key={student.id}
                        hover
                      >

                        <TableCell>
<<<<<<< HEAD

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
=======
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: 12,
                                bgcolor: "grey.400",
>>>>>>> origin/testing
                              }}
                            >
                              {initials}
                            </Avatar>
<<<<<<< HEAD


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
=======
                            <Typography variant="body2">
                              {student.name || "-"}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>{student.email || "-"}</TableCell>

                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <SchoolOutlinedIcon
                              sx={{ fontSize: 18, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {student.major || "-"}
                            </Typography>
                          </Stack>
>>>>>>> origin/testing
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
<<<<<<< HEAD
                            color="success"
=======
                            sx={{
                              height: 24,
                              borderRadius: 999,
                              bgcolor: "grey.100",
                              color: "text.primary",
                            }}
>>>>>>> origin/testing
                          />

                        </TableCell>


                        <TableCell>
                          {student.id ?? '-'}
                        </TableCell>

<<<<<<< HEAD

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

=======
                        <TableCell>{student.id ?? "-"}</TableCell>

                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              aria-label="Editar alumno"
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label="Eliminar alumno"
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
>>>>>>> origin/testing
                        </TableCell>

                      </TableRow>
<<<<<<< HEAD

                    )

=======
                    );
>>>>>>> origin/testing
                  })

                ) : (

                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="No hay alumnos para mostrar"
                        description="No se encontraron alumnos que coincidan con la búsqueda."
                      />
                    </TableCell>
                  </TableRow>

                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </Paper>

    </Box>
  );
}

export default Students;
