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
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const initialDeliverablesData = [
  {
    id: 5,
    group_id: 45,
    expected_date: "2026-04-20",
    status: "Out of date",
  },
  {
    id: 6,
    group_id: 46,
    expected_date: "2026-07-31",
    status: "Pending",
  },
  {
    id: 7,
    group_id: 47,
    expected_date: "2026-08-10",
    status: "Pending",
  },
];

export default function Deliverables() {
  const [deliverables, setDeliverables] = useState(initialDeliverablesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("group_id");

  const filteredDeliverables = deliverables.filter((deliverable) => {
    const valueToSearch = deliverable[filterProperty]?.toString().toLowerCase() || "";
    return valueToSearch.includes(searchTerm.toLowerCase());
  });

  const renderStatusChip = (status) => {
    if (status === "Pending") {
      return <Chip label="Pendiente" size="small" color="warning" />;
    }
    if (status === "Out of date") {
      return <Chip label="Atrasado" size="small" color="error" />;
    }
    return <Chip label={status} size="small" color="default" />;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Inicio
        </Link>
        <Typography color="text.primary">Entregables</Typography>
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
        <Typography variant="h4">Entregables</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ height: 40 }}>
          Agregar entregable
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "stretch" }}>
          <TextField
            label="Buscar"
            placeholder="Ingrese un dato"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
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
                backgroundColor: "#f5f5f5",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "&.Mui-focused": {
                  backgroundColor: "#f5f5f5",
                },
                "&:before": {
                  borderBottom: "1px solid #BDBDBD",
                },
                "&:after": {
                  borderBottom: "2px solid #1976d2",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#1976d2",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1976d2",
              },
            }}
          >
            <MenuItem value="group_id">ID Grupo</MenuItem>
            <MenuItem value="expected_date">Fecha esperada</MenuItem>
            <MenuItem value="status">Estado</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID Entregable</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ID Grupo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha esperada</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDeliverables.map((deliverable) => (
                <TableRow key={deliverable.id} hover>
                  <TableCell>#{deliverable.id}</TableCell>
                  <TableCell>Grupo {deliverable.group_id}</TableCell>
                  <TableCell>{deliverable.expected_date}</TableCell>
                  <TableCell>{renderStatusChip(deliverable.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label={`Editar ${deliverable.id}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Eliminar ${deliverable.id}`}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}