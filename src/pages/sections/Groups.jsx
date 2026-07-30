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
  TablePagination,
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
import {getGroups,saveGroup,deleteGroup,getGroupById,} from "../../api/endpoints/groups";
import { getCohorts } from "../../api/endpoints/cohorts";
import { getTutorGroups } from "../../api/endpoints/tutors";
import { useAuth } from "../../context/AuthContext";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "../../components/ConfirmModal";

import { getStudents } from "../../api/endpoints/students";

const CREATE_GROUP_INITIAL_VALUES = {
  student_ids: [],
};


function Groups() {
  const { user } = useAuth();
  const [view, setView] = useState("gallery");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [groups, setGroups] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroupsForCurrentUser = async () => {
    if (user?.role === "Coordinator") {
      return getGroups();
    }

    const tutorId = user?.tutor?.id;
    if (!tutorId) {
      return [];
    }

    const assignedGroups = await getTutorGroups(tutorId);
    const fullGroups = await Promise.all(
      assignedGroups.map((group) => getGroupById(group.id)),
    );
    return fullGroups;
  };

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const [groupsData, cohortsData, studentsData] = await Promise.all([
        loadGroupsForCurrentUser(),
        getCohorts(),
        getStudents(),
      ]);

      setGroups(groupsData);
      const cohortsList = Array.isArray(cohortsData) ? cohortsData : (cohortsData?.items ?? []);
      const uniqueCohorts = Array.from(
        new Map(cohortsList.map((c) => [c.id, c])).values(),
      );
      setCohorts(uniqueCohorts);
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
      await saveGroup({
        id: 0,
        name: formData.name,
        cohort_id: Number(formData.cohort_id),
        current_stage_id: null,
        idea: formData.idea || "",
        major: "",
        status: "Active",
        student_ids: [],
        business_tutor_id: null,
        technical_tutor_id: null,
      });
      setCreateModalOpen(false);
      await loadGroups();
    } catch (err) {
      setError(err?.message || "No se pudo crear el grupo.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!deletingGroup) return;

    try {
      await deleteGroup(deletingGroup.id);

      setDeletingGroup(null);

      await loadGroups();
    } catch (err) {
      setError(err?.message || "No se pudo eliminar el grupo.");
    }
  };

  const handleEditGroup = async (formData) => {
    try {
      await saveGroup({
        id: editingGroup.id,
        name: formData.name,
        cohort_id: Number(formData.cohort_id),
        current_stage_id: editingGroup.currentStage?.id ?? null,
        idea: formData.idea || "",
        major: editingGroup.major || "",
        status: editingGroup.status,
        student_ids: editingGroup.students.map((s) => s.id),
        business_tutor_id: editingGroup.businessTutor?.id ?? null,
        technical_tutor_id: editingGroup.technicalTutor?.id ?? null,
      });

      setEditingGroup(null);

      await loadGroups();
    } catch (err) {
      setError(err?.message || "No se pudo editar el grupo.");
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
        <>
          <GroupsGrid
            groups={filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            onEdit={setEditingGroup}
            onDelete={setDeletingGroup}
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </>
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
                filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((group) => (
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Ver detalle">
                          <IconButton
                            size="small"
                            color="primary"
                            component={RouterLink}
                            to={`/groups/${group.id}`}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setEditingGroup(group)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeletingGroup(group)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
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
      <GenericCreateModal
        open={Boolean(editingGroup)}
        onClose={() => setEditingGroup(null)}
        title="Editar grupo"
        fields={createFields}
        initialValues={{
            name: editingGroup?.name,
            cohort_id: editingGroup?.cohortId,
            idea: editingGroup?.idea,
        }}
        onSubmit={handleEditGroup}
      />
      <ConfirmModal
          open={Boolean(deletingGroup)}
          title="Eliminar grupo"
          message={
              deletingGroup
                  ? `¿Desea eliminar el grupo "${deletingGroup.name}"?`
                  : ""
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteGroup}
          onClose={() => setDeletingGroup(null)}
      />
    </Box>
  );
}

export default Groups;
