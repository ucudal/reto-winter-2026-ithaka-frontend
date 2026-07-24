import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import SearchIcon from "@mui/icons-material/Search";

const initialTutorsData = [
  {
    id: 8,
    name: "María Pérez",
    role: "Business",
    specialty: "Strategy and market validation",
    availability: "Monday and Wednesday afternoon",
    max_capacity: 22,
    status: "Active",
  },
  {
    id: 9,
    name: "Carlos Ruiz",
    role: "Technical",
    specialty: "Software Architecture & Cloud",
    availability: "Tuesday and Thursday morning",
    max_capacity: 20,
    status: "Active",
  },
  {
    id: 10,
    name: "Jane Smith",
    role: "Business",
    specialty: "Financial Modeling",
    availability: "Friday all day",
    max_capacity: 15,
    status: "Inactive",
  },
];

export default function Tutors() {
  const [tutors, setTutors] = useState(initialTutorsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("name");
  const [view, setView] = useState("list");

  const filteredTutors = tutors.filter((tutor) => {
    const valueToSearch = tutor[filterProperty]?.toString().toLowerCase() || "";
    return valueToSearch.includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Inicio
        </Link>
        <Typography color="text.primary">Tutores</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4">Tutores</Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="tutors-view-label">Vista</InputLabel>
            <Select
              labelId="tutors-view-label"
              id="tutors-view"
              value={view}
              label="Vista"
              onChange={(e) => setView(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  {view === "gallery" ? (
                    <ViewModuleIcon fontSize="small" />
                  ) : (
                    <ViewListIcon fontSize="small" />
                  )}
                </InputAdornment>
              }
            >
              <MenuItem value="list">Tabla</MenuItem>
              <MenuItem value="gallery">Galería</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<AddIcon />} sx={{ height: 40 }}>
            Agregar tutor
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "stretch" }}>
          <TextField
            label="Buscar"
            placeholder="Ingrese un dato"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 60,
              },
            }}
          />
          <TextField
            select
            label="Filtrar por"
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            variant="filled"
            sx={{
              width: 280,
              "& .MuiFilledInput-root": {
                height: 60,
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                "&.Mui-focused": {
                  bgcolor: "action.hover",
                },
                "&:before": {
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                },
                "&:after": {
                  borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                },
              },
              "& .MuiInputLabel-root": {
                color: "primary.main",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main",
              },
            }}
          >
            <MenuItem value="name">Nombre</MenuItem>
            <MenuItem value="role">Rol</MenuItem>
            <MenuItem value="specialty">Especialidad</MenuItem>
            <MenuItem value="status">Estado</MenuItem>
          </TextField>
        </Box>

        {view === "list" ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Especialidad</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Disponibilidad</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Estado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTutors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No se encontraron tutores</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTutors.map((tutor) => (
                    <TableRow key={tutor.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: "action.selected",
                              color: "text.secondary",
                              width: 32,
                              height: 32,
                              fontSize: "0.875rem",
                            }}
                          >
                            {tutor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {tutor.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {tutor.role === "Business" ? "Negocio" : "Técnico"}
                      </TableCell>
                      <TableCell>{tutor.specialty}</TableCell>
                      <TableCell>{tutor.availability}</TableCell>
                      <TableCell>
                        <Chip
                          label={tutor.status === "Active" ? "Activo" : "Inactivo"}
                          size="small"
                          color={tutor.status === "Active" ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label={`Editar ${tutor.name}`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Eliminar ${tutor.name}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {filteredTutors.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography color="text.secondary">No se encontraron tutores</Typography>
                </Box>
              </Grid>
            ) : (
              filteredTutors.map((tutor) => (
                <Grid item xs={12} sm={6} md={4} key={tutor.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            width: 48,
                            height: 48,
                          }}
                        >
                          {tutor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {tutor.name}
                          </Typography>
                          <Chip
                            label={tutor.role === "Business" ? "Tutor de Negocio" : "Tutor Técnico"}
                            size="small"
                            color={tutor.role === "Business" ? "secondary" : "primary"}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Especialidad:</strong> {tutor.specialty}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Disponibilidad:</strong> {tutor.availability}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 0 }}>
                      <Chip
                        label={tutor.status === "Active" ? "Activo" : "Inactivo"}
                        size="small"
                        color={tutor.status === "Active" ? "success" : "default"}
                      />
                      <Box>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            aria-label={`Editar ${tutor.name}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            aria-label={`Eliminar ${tutor.name}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
