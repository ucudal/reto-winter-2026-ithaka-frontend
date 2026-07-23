import { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Link as RouterLink } from "react-router-dom";

const filterOptions = [
  { value: "group", label: "Grupo" },
  { value: "tutors", label: "Tutores involucrados" },
  { value: "date", label: "Fecha" },
  { value: "participants", label: "Participantes" },
  { value: "notes", label: "Notas" },
  { value: "nextSteps", label: "Próximos pasos" },
  { value: "hoursInvested", label: "Horas invertidas" },
  { value: "url", label: "URL" },
];

function Meetings() {
  const [selectedView, setSelectedView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  return (
    <Box sx={{ width: "100%" }}>
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

        <Typography color="text.primary">Reuniones</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Reuniones
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="meetings-view-label">Vista</InputLabel>
            <Select
              labelId="meetings-view-label"
              id="meetings-view"
              value={selectedView}
              label="Vista"
              onChange={(event) => setSelectedView(event.target.value)}
              renderValue={(value) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {value === "list" ? (
                    <ViewListIcon fontSize="small" />
                  ) : (
                    <GridViewIcon fontSize="small" />
                  )}
                  <span>{value === "list" ? "Tabla" : "Galería"}</span>
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

          <Button variant="contained">+ Crear Reunión</Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          mb: 2,
        }}
      >
        <TextField
          id="meetings-search"
          label="Buscar"
          placeholder="Ingrese un dato"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          size="small"
          fullWidth
        />

        <FormControl size="small" sx={{ minWidth: 210 }}>
          <InputLabel id="meetings-filter-label">Filtrar por</InputLabel>
          <Select
            labelId="meetings-filter-label"
            id="meetings-filter"
            value={filterBy}
            label="Filtrar por"
            onChange={(event) => setFilterBy(event.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {filterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default Meetings;
