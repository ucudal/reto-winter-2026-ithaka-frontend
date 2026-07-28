import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getHomePathForRole } from "../../routes/roleHome";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";

const initialDeliverablesData = [
  {
    id: 1,
    group_id: 8,
    group_name: "Grupo 8 - Proyecto Ithaka",
    stage_name: "Etapa 1: Diagnóstico",
    expected_date: "2026-04-20",
    status: "Overdue",
  },
  {
    id: 2,
    group_id: 9,
    group_name: "Grupo 9 - Innovación Tech",
    stage_name: "Etapa 1: Diagnóstico",
    expected_date: "2026-07-31",
    status: "Pending",
  },
  {
    id: 3,
    group_id: 10,
    group_name: "Grupo 10 - EcoStart",
    stage_name: "Etapa 2: Propuesta",
    expected_date: "2026-08-10",
    status: "In review",
  },
];

export default function Deliverables() {
  const { user } = useAuth();
  const [deliverables, setDeliverables] = useState(initialDeliverablesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("ALL");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({
    group_id: "",
    group_name: "",
    stage_name: "",
    expected_date: "",
    status: "Pending",
  });

  const searchedDeliverables = deliverables.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.group_name.toLowerCase().includes(term) ||
      item.stage_name.toLowerCase().includes(term) ||
      item.id.toString().includes(term)
    );
  });

  const filteredDeliverables = searchedDeliverables.filter((item) => {
    if (currentTab === "ALL") return true;
    return item.status === currentTab;
  });

  const handleOpenStatusMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeliverableId(id);
  };

  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
    setSelectedDeliverableId(null);
  };

  const handleChangeStatus = (newStatus) => {
    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === selectedDeliverableId
          ? { ...item, status: newStatus }
          : item,
      ),
    );
    handleCloseStatusMenu();
  };

  const handleCreateDeliverable = () => {
    if (
      !newDeliverable.stage_name ||
      !newDeliverable.group_name ||
      !newDeliverable.expected_date
    ) {
      return;
    }

    const createdItem = {
      id: deliverables.length + 1,
      group_id: Number(newDeliverable.group_id) || deliverables.length + 10,
      group_name: newDeliverable.group_name,
      stage_name: newDeliverable.stage_name,
      expected_date: newDeliverable.expected_date,
      status: newDeliverable.status,
    };

    setDeliverables([createdItem, ...deliverables]);
    setOpenCreateModal(false);
    setNewDeliverable({
      group_id: "",
      group_name: "",
      stage_name: "",
      expected_date: "",
      status: "Pending",
    });
  };

  const renderStatusChip = (status) => {
    switch (status) {
      case "Pending":
        return <Chip label="Pendiente" size="small" color="warning" />;
      case "Overdue":
        return <Chip label="Atrasado" size="small" color="error" />;
      case "Approved":
        return <Chip label="Aprobado" size="small" color="success" />;
      case "In review":
        return <Chip label="En Revisión" size="small" color="info" />;
      default:
        return <Chip label={status} size="small" color="default" />;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link
          component={RouterLink}
          to={getHomePathForRole(user?.role)}
          underline="hover"
          color="inherit"
        >
          Inicio
        </Link>
        <Typography color="text.primary">Entregables</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Entregables
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ height: 40 }}
          onClick={() => setOpenCreateModal(true)}
        >
          Agregar entregable
        </Button>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Todos" value="ALL" />
          <Tab label="Pendientes" value="Pending" />
          <Tab label="En revisión" value="In review" />
          <Tab label="Aprobados" value="Approved" />
          <Tab label="Atrasados" value="Overdue" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Buscar por grupo o etapa"
          placeholder="Ej. Grupo 8, Etapa 1..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        />
      </Box>

      <Grid container spacing={2}>
        {filteredDeliverables.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    ENTREGABLE #{item.id}
                  </Typography>
                  {renderStatusChip(item.status)}
                </Box>

                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontSize: "1.05rem", fontWeight: "bold", mb: 1 }}
                >
                  {item.stage_name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    color: "text.secondary",
                  }}
                >
                  <GroupsIcon fontSize="small" />
                  <Typography variant="body2">{item.group_name}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">
                    Fecha límite: <strong>{item.expected_date}</strong>
                  </Typography>
                </Box>
              </CardContent>

              <CardActions
                sx={{ justifyContent: "flex-end", px: 2, pb: 2, pt: 0 }}
              >
                <Tooltip title="Cambiar estado del entregable">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => handleOpenStatusMenu(e, item.id)}
                  >
                    <EditNoteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseStatusMenu}
      >
        <MenuItem onClick={() => handleChangeStatus("Pending")}>
          Marcar como Pendiente
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("In review")}>
          Marcar como En Revisión
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("Approved")}>
          Marcar como Aprobado
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("Overdue")}>
          Marcar como Atrasado
        </MenuItem>
      </Menu>

      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nuevo Entregable</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            label="Nombre de la etapa / hito"
            placeholder="Ej. Etapa 1: Diagnóstico"
            value={newDeliverable.stage_name}
            onChange={(e) =>
              setNewDeliverable({
                ...newDeliverable,
                stage_name: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Nombre del grupo"
            placeholder="Ej. Grupo 8 - Proyecto Ithaka"
            value={newDeliverable.group_name}
            onChange={(e) =>
              setNewDeliverable({
                ...newDeliverable,
                group_name: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            type="date"
            label="Fecha esperada de entrega"
            InputLabelProps={{ shrink: true }}
            value={newDeliverable.expected_date}
            onChange={(e) =>
              setNewDeliverable({
                ...newDeliverable,
                expected_date: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            select
            label="Estado inicial"
            value={newDeliverable.status}
            onChange={(e) =>
              setNewDeliverable({ ...newDeliverable, status: e.target.value })
            }
            fullWidth
          >
            <MenuItem value="Pending">Pendiente</MenuItem>
            <MenuItem value="In review">En revisión</MenuItem>
            <MenuItem value="Approved">Aprobado</MenuItem>
            <MenuItem value="Overdue">Atrasado</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateDeliverable}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
