import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkIcon from "@mui/icons-material/Link";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { getMaterials, createMaterial, upsertMaterial, deleteMaterial } from "../../api/endpoints/materials";
import ConfirmModal from "../../components/ConfirmModal";
import CreateMaterialModal from "../../components/CreateMaterialModal";
import EditMaterialModal from "../../components/EditMaterialModal";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const columns = [
  { id: "id", label: "ID", width: "10%" },
  { id: "stage_id", label: "Etapa", width: "15%" },
  { id: "title", label: "Título", width: "30%" },
  { id: "url", label: "URL", width: "35%" },
];

const tableColumnCount = columns.length + 1;

function getPlatformDetails(url = "") {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("drive.google.com") || lowerUrl.includes("docs.google.com")) {
    return {
      label: "Google Drive",
      color: "#0F9D58",
      icon: <InsertDriveFileIcon fontSize="small" sx={{ color: "#0F9D58" }} />,
    };
  }
  if (lowerUrl.includes("sharepoint.com")) {
    return {
      label: "SharePoint",
      color: "#0078D4",
      icon: <CloudQueueIcon fontSize="small" sx={{ color: "#0078D4" }} />,
    };
  }
  if (lowerUrl.includes("github.com")) {
    return {
      label: "GitHub",
      color: "text.primary",
      icon: <GitHubIcon fontSize="small" />,
    };
  }
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return {
      label: "YouTube",
      color: "#FF0000",
      icon: <YouTubeIcon fontSize="small" sx={{ color: "#FF0000" }} />,
    };
  }
  return {
    label: "Enlace",
    color: "text.secondary",
    icon: <LinkIcon fontSize="small" />,
  };
}

function Knowledge() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredMaterials = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("es");

    if (!normalizedSearch) return materials;

    const fieldsToSearch =
      filterBy === "all" ? columns.map((column) => column.id) : [filterBy];

    return materials.filter((material) =>
      fieldsToSearch.some((field) =>
        String(material[field] ?? "")
          .toLocaleLowerCase("es")
          .includes(normalizedSearch),
      ),
    );
  }, [filterBy, materials, searchTerm]);

  const [totalCount, setTotalCount] = useState(0);

  const loadMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchTerm || undefined,
      };
      const res = await getMaterials(params);
      setMaterials(res?.items ?? []);
      setTotalCount(res?.total ?? 0);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const handleDeleteMaterial = async () => {
    if (!materialToDelete) return;

    const materialId = materialToDelete.id;
    try {
      await deleteMaterial(materialId);
      showToast("Material eliminado correctamente.", "success");
      loadMaterials();
      setMaterialToDelete(null);
    } catch (err) {
      showToast(err?.message || "No se pudo eliminar el material.", "error");
    }
  };

  const handleEditMaterial = async (updatedFields) => {
    if (!materialToEdit) return;

    const materialId = materialToEdit.id;
    try {
      const payload = {
        id: materialId,
        title: updatedFields.title || materialToEdit.title,
        url: updatedFields.url || materialToEdit.url,
        stage_id: updatedFields.stage_id
          ? Number(updatedFields.stage_id)
          : materialToEdit.stage_id ?? null,
      };
      const updatedData = await upsertMaterial(payload);
      showToast("Material actualizado correctamente.", "success");
      setMaterials((currentMaterials) =>
        currentMaterials.map((material) =>
          material.id === materialId ? { ...material, ...updatedData } : material,
        ),
      );
      setMaterialToEdit(null);
    } catch (err) {
      showToast(err?.message || "No se pudo actualizar el material.", "error");
    }
  };

  const handleCreateMaterial = (createdMaterial) => {
    if (createdMaterial) {
      setMaterials((currentMaterials) => [
        createdMaterial,
        ...currentMaterials,
      ]);
      showToast("Material creado correctamente.", "success");
    }
    setIsCreateModalOpen(false);
  };

  return (
    <Box>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Typography color="text.primary">Materiales</Typography>
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
          Materiales
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="materials-view-label">Vista</InputLabel>
            <Select
              labelId="materials-view-label"
              id="materials-view"
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

          <Button
            variant="contained"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Crear Material
          </Button>
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
          id="materials-search"
          label="Buscar"
          placeholder="Ingrese un dato"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          size="small"
          fullWidth
        />

        <FormControl size="small" sx={{ minWidth: 210 }}>
          <InputLabel id="materials-filter-label">Filtrar por</InputLabel>
          <Select
            labelId="materials-filter-label"
            id="materials-filter"
            value={filterBy}
            label="Filtrar por"
            onChange={(event) => setFilterBy(event.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {columns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error ? (
        <ErrorState
          title="No se pudieron cargar los materiales"
          message={error.message}
          onRetry={loadMaterials}
        />
      ) : selectedView === "list" ? (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 1,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Table aria-label="Tabla de materiales" sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      width: column.width,
                      py: 1.5,
                      fontWeight: 600,
                      color: "text.primary",
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{
                    width: "10%",
                    py: 1.5,
                    fontWeight: 600,
                    color: "text.primary",
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumnCount}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <CircularProgress
                      size={32}
                      aria-label="Cargando materiales"
                    />
                  </TableCell>
                </TableRow>
              ) : filteredMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableColumnCount} sx={{ p: 0 }}>
                    <EmptyState
                      title={
                        materials.length === 0
                          ? "No hay materiales para mostrar"
                          : "No se encontraron materiales"
                      }
                      description={
                        materials.length === 0
                          ? "Los materiales que se agreguen aparecerán en esta tabla."
                          : "Probá con otro término o criterio de búsqueda."
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id} hover>
                    <TableCell>{material.id}</TableCell>
                    <TableCell>{material.stage_id}</TableCell>
                    <TableCell>{material.title}</TableCell>

                    <TableCell sx={{ overflow: "hidden" }}>
                      {(() => {
                        const platform = getPlatformDetails(material.url);
                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {platform.icon}
                            <Link
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                              }}
                            >
                              {platform.label}
                            </Link>
                          </Box>
                        );
                      })()}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label={`Editar ${material.id}`}
                          onClick={() => setMaterialToEdit(material)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Eliminar ${material.id}`}
                          onClick={() => setMaterialToDelete(material)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
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
      ) : isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} aria-label="Cargando materiales" />
        </Box>
      ) : filteredMaterials.length === 0 ? (
        <Paper variant="outlined">
          <EmptyState
            title={
              materials.length === 0
                ? "No hay materiales para mostrar"
                : "No se encontraron materiales"
            }
            description={
              materials.length === 0
                ? "Los materiales que se agreguen aparecerán en esta galería."
                : "Probá con otro término o criterio de búsqueda."
            }
          />
        </Paper>
      ) : (
        <Box
          aria-label="Galería de materiales"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              variant="outlined"
              sx={{
                minWidth: 0,
                minHeight: 235,
                display: "flex",
                flexDirection: "column",
                borderColor: "divider",
                borderRadius: 1,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
                transition: "box-shadow 150ms ease, transform 150ms ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 2.5,
                  "&:last-child": { pb: 2 },
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: 2,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="p"
                      color="text.secondary"
                    >
                      Título
                    </Typography>
                    <Typography
                      variant="caption"
                      component="p"
                      color="text.secondary"
                      sx={{ flexShrink: 0, fontWeight: 600 }}
                    >
                      #{material.id}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="h2" lineHeight={1.3}>
                    {material.title}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    component="p"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Etapa
                  </Typography>
                  <Typography variant="body1">{material.stage_id}</Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    component="p"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    URL
                  </Typography>
                  {(() => {
                    const platform = getPlatformDetails(material.url);
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {platform.icon}
                        <Link
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: 500,
                          }}
                        >
                          {platform.label}
                        </Link>
                      </Box>
                    );
                  })()}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: "auto",
                    pt: 0.5,
                  }}
                >
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label={`Editar ${material.id}`}
                      onClick={() => setMaterialToEdit(material)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Eliminar ${material.id}`}
                      onClick={() => setMaterialToDelete(material)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <ConfirmModal
        open={Boolean(materialToDelete)}
        title="Eliminar material"
        message={
          materialToDelete
            ? `¿Estás seguro de que querés eliminar el material “${materialToDelete.title}”? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteMaterial}
        onClose={() => setMaterialToDelete(null)}
      />

      <EditMaterialModal
        open={Boolean(materialToEdit)}
        material={materialToEdit}
        onSave={handleEditMaterial}
        onClose={() => setMaterialToEdit(null)}
      />

      <CreateMaterialModal
        open={isCreateModalOpen}
        onCreate={handleCreateMaterial}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
}

export default Knowledge;
