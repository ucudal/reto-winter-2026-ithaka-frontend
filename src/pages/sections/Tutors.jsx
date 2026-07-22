import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, MenuItem, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Chip, IconButton, Breadcrumbs, Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

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
    <Box sx={{ p: 3 }}>
      <Breadcrumbs sx={{ mb: 1 }}>
        <Link underline="hover" color="inherit" href="#">
          Home
        </Link>
        <Typography color="text.primary">Tutors</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Tutors
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          NEW TUTOR
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Search"
            placeholder="Enter value"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            size="small"
          />
          <TextField
            select
            label="Filter by"
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            sx={{ minWidth: 180 }}
            size="small"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="role">Role</MenuItem>
            <MenuItem value="specialty">Specialty</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Specialty</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Availability</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                  <TableCell>{tutor.role}</TableCell>
                  <TableCell>{tutor.specialty}</TableCell>
                  <TableCell>{tutor.availability}</TableCell>
                  <TableCell>
                    <Chip 
                      label={tutor.status} 
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
