import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Breadcrumbs,
  Link,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupsGrid from "../../components/GroupsGrid";
import LoadingStateComponent from "../../components/LoadingStateComponent";
import ErrorState from "../../components/common/ErrorState";
import GenericCreateModal from "../../components/common/GenericCreateModal";
import { getGroups, createGroup } from "../../api/endpoints/groups";
import { getCohorts } from "../../api/endpoints/cohorts";
import { getStudents } from "../../api/endpoints/students";

const CREATE_GROUP_INITIAL_VALUES = {
  student_ids: [],
};

function Groups() {
  const [view, setView] = useState("gallery");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [groups, setGroups] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const [groupsData, cohortsData, studentsData] = await Promise.all([
        getGroups(),
        getCohorts(),
        getStudents(),
      ]);

      setGroups(groupsData);
      setCohorts(Array.isArray(cohortsData) ? cohortsData : (cohortsData?.items ?? []));
      setStudents(Array.isArray(studentsData) ? studentsData : (studentsData?.items ?? []));
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los grupos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (formData) => {
    try {
      setCreating(true);
      await createGroup({
        name: formData.name,
        cohort_id: Number(formData.cohort_id),
        idea: formData.idea || null,
        student_ids: formData.student_ids.map(Number),
      });
      setCreateModalOpen(false);
      await loadGroups();
    } catch (err) {
      setError(err?.message || "No se pudo crear el grupo.");
    } finally {
      setCreating(false);
    }
  };

  const createFields = [
    { name: "name", label: "Nombre del grupo", required: true },
    {
      name: "cohort_id",
      label: "Cohorte",
      type: "select",
      required: true,
      options: cohorts.map((c) => ({
        value: c.id,
        label: `${c.year} - ${c.semester}° semestre`,
      })),
    },
    { name: "idea", label: "Idea de proyecto", type: "textarea" },
    {
      name: "student_ids",
      label: "Alumnos",
      type: "select",
      multiple: true,
      required: true,
      options: students
        .filter((student) => student.group_id == null)
        .map((student) => ({
          value: student.id,
          label: student.name,
        })),
    },
  ];

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesSearch =
        group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.idea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.major?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "" || group.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [groups, searchTerm, statusFilter]);

  const statusOptions = useMemo(
    () => [...new Set(groups.map((g) => g.status).filter(Boolean))],
    [groups],
  );

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
        <Typography color="text.primary">Grupos</Typography>
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
        <Typography variant="h4">Grupos</Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="groups-view-label">Vista</InputLabel>
            <Select
              labelId="groups-view-label"
              id="groups-view"
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
              <MenuItem value="gallery">Galería</MenuItem>
              <MenuItem value="list">Tabla</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              height: 40,
            }}
          >
            Agregar grupo
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          alignItems: "stretch",
        }}
      >
        <TextField
          label="Buscar"
          placeholder="Ingrese un dato"
          variant="outlined"
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
          <MenuItem value="">Todos</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <LoadingStateComponent />
      ) : error ? (
        <ErrorState message={error} onRetry={loadGroups} />
      ) : view === "gallery" ? (
        <GroupsGrid groups={filteredGroups} />
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Grupo</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Carrera</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Idea de proyecto</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Etapa actual</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Tutores</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No se encontraron grupos</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => (
                  <TableRow key={group.id} hover>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {group.name}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {group.students?.map((s) => s.name).join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell>{group.major}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {group.idea}
                    </TableCell>
                    <TableCell>
                      <Chip label={group.currentStage?.name || "Sin etapa"} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" display="block">
                        <strong>Negocio:</strong> {group.businessTutor?.name || "-"}
                      </Typography>
                      <Typography variant="body2" display="block">
                        <strong>Técnico:</strong> {group.technicalTutor?.name || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={group.status} size="small" color="default" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" color="primary" component={RouterLink} to={`/groups/${group.id}`}>
                          <VisibilityIcon fontSize="small" />
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

      <GenericCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Agregar grupo"
        fields={createFields}
        initialValues={CREATE_GROUP_INITIAL_VALUES}
        onSubmit={handleCreateGroup}
        loading={creating}
      />
    </Box>
  );
}

export default Groups;
