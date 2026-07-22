import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, MenuItem, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Chip, IconButton, Breadcrumbs, Link
} from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const initialTutorsData = [
  {
    id: 8,
    name: "María Pérez",
    role: "Business",
    specialty: "Strategy and market validation",
    availability: "Monday and Wednesday afternoon",
    max_capacity: 22,
    status: "Active"
  },
  {
    id: 9,
    name: "Carlos Ruiz",
    role: "Technical",
    specialty: "Software Architecture & Cloud",
    availability: "Tuesday and Thursday morning",
    max_capacity: 20,
    status: "Active"
  },
  {
    id: 10,
    name: "Jane Smith",
    role: "Business",
    specialty: "Financial Modeling",
    availability: "Friday all day",
    max_capacity: 15,
    status: "Inactive"
  }
];

export default function Tutors() {
  const [tutors, setTutors] = useState(initialTutorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState('name');

  const filteredTutors = tutors.filter(tutor => {
    const valueToSearch = tutor[filterProperty]?.toString().toLowerCase() || '';
    return valueToSearch.includes(searchTerm.toLowerCase());
  });

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
        <Typography variant="h4">
          Tutores
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ height: 40 }}
        >
          Agregar tutor
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'stretch' }}>
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
            <MenuItem value="name">Nombre</MenuItem>
            <MenuItem value="role">Rol</MenuItem>
            <MenuItem value="specialty">Especialidad</MenuItem>
            <MenuItem value="status">Estado</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Especialidad</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Disponibilidad</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTutors.map((tutor) => (
                <TableRow key={tutor.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'action.selected', color: 'text.secondary', width: 32, height: 32, fontSize: '0.875rem' }}>
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {tutor.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{tutor.role === 'Business' ? 'Negocio' : 'Técnico'}</TableCell>
                  <TableCell>{tutor.specialty}</TableCell>
                  <TableCell>{tutor.availability}</TableCell>
                  <TableCell>
                    <Chip 
                      label={tutor.status === 'Active' ? 'Activo' : 'Inactivo'} 
                      size="small"
                      color={tutor.status === 'Active' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
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
