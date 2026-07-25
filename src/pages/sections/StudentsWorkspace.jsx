import { useMemo, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useAuth } from "../../context/AuthContext";
import { mockGroups } from "../../data/mockGroups";
import { mockDeliverables, mockMinutes } from "../../data/mockWorkspace";
import EmptyState from "../../components/common/EmptyState";
import { getGroupById } from "../../api/endpoints/groups";

const LINK_LABELS = {
  Drive: "Drive",
  GitHub: "Repositorio",
  "One Pager": "One Pager",
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDueMeta(dueDate, status) {
  if (status === "submitted") {
    return { label: "Entregado", color: "success" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const days = Math.abs(diffDays);
    return {
      label: `Vencida hace ${days} día${days === 1 ? "" : "s"}`,
      color: "error",
    };
  }
  if (diffDays === 0) {
    return { label: "Vence hoy", color: "error" };
  }
  if (diffDays <= 7) {
    return { label: `Vence en ${diffDays} día${diffDays === 1 ? "" : "s"}`, color: "warning" };
  }
  return { label: `Vence el ${formatDate(dueDate)}`, color: "default" };
}

export default function StudentWorkspace() {
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);

  useEffect(() => {
    async function loadWorkspaceGroup() {
      if (!user) {
        setLoadingWorkspace(false);
        return;
      }
      
      const realGroupId = user.student?.group_id;
      if (realGroupId) {
        try {
          const realGroup = await getGroupById(realGroupId);
          setGroup(realGroup);
          setLoadingWorkspace(false);
          return;
        } catch (err) {
          console.error("Error fetching real group for student workspace:", err);
        }
      }
      
      // Fallback to mock data matching student email or name
      const emailToMatch = user.student?.email || user.email;
      const nameToMatch = user.student?.name || user.name;
      const mock = mockGroups.find((g) =>
        g.students.some((s) =>
          (s.email && s.email === emailToMatch) ||
          (s.name && s.name.toLowerCase() === nameToMatch.toLowerCase())
        )
      );
      setGroup(mock || null);
      setLoadingWorkspace(false);
    }
    loadWorkspaceGroup();
  }, [user]);

  const deliverables = useMemo(() => {
    if (!group) return [];
    return mockDeliverables
      .filter((d) => d.groupId === group.id)
      .map((d) => ({ ...d, meta: getDueMeta(d.dueDate, d.status) }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [group]);

  const minutes = useMemo(() => {
    if (!group) return [];
    return mockMinutes
      .filter((m) => m.groupId === group.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [group]);

  if (loadingWorkspace) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return (
      <Box sx={{ p: 3 }}>
        <EmptyState
          title="Todavía no estás en ningún grupo"
          description="Cuando te asignen a un grupo de trabajo, tu workspace va a aparecer acá con tus compañeros, tutores y entregas."
        />
      </Box>
    );
  }

  const nextDeliverable = deliverables.find((d) => d.status !== "submitted");
  const teammates = group.students.filter((s) =>
    s.email ? s.email !== user.email : s.name !== user.name
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Inicio / Mi Workspace
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            {group.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {group.idea}
          </Typography>
        </Box>

        <Chip
          label={group.currentStage?.name || "Sin etapa"}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {nextDeliverable && (
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "primary.contrastText",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1 }}>
                Próxima entrega
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {nextDeliverable.title}
              </Typography>
            </Box>

            <Chip
              label={nextDeliverable.meta.label}
              sx={{
                bgcolor: "rgba(255,255,255,0.16)",
                color: "inherit",
                fontWeight: 600,
              }}
            />
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <GroupsIcon color="action" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Compañeros de grupo
                </Typography>
              </Stack>

              <Stack spacing={1.5}>
                {teammates.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Sos el único integrante registrado en este grupo.
                  </Typography>
                ) : (
                  teammates.map((mate) => (
                    <Stack key={mate.id} direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "grey.400" }}>
                        {getInitials(mate.name)}
                      </Avatar>
                      <Typography variant="body2">{mate.name}</Typography>
                    </Stack>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <SchoolIcon color="action" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Tutores asignados
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                    {getInitials(group.technicalTutor?.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      {group.technicalTutor?.name || "Sin asignar"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tutor técnico
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                    {getInitials(group.businessTutor?.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      {group.businessTutor?.name || "Sin asignar"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tutora de negocio
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <LinkIcon color="action" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Links de interés
                </Typography>
              </Stack>

              {(group.links ?? []).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Todavía no cargaron links para este grupo.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {(group.links ?? []).map((link, index) => (
                    <Button
                      key={`${link.type}-${index}`}
                      component="a"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      endIcon={<OpenInNewIcon fontSize="small" />}
                      sx={{ justifyContent: "space-between", textTransform: "none" }}
                    >
                      {LINK_LABELS[link.type] || link.type}
                    </Button>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <EventNoteOutlinedIcon color="action" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Minutas recientes
                </Typography>
              </Stack>

              {minutes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Todavía no hay minutas cargadas para este grupo.
                </Typography>
              ) : (
                <Stack divider={<Divider />} spacing={1.5}>
                  {minutes.slice(0, 3).map((minute) => (
                    <Box key={minute.id}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={600}>
                          {minute.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(minute.date)}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        {minute.summary}
                      </Typography>
                      <Button
                        component="a"
                        href={minute.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                        sx={{ textTransform: "none", pl: 0 }}
                      >
                        Ver minuta
                      </Button>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <DescriptionOutlinedIcon color="action" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Próximas entregas
                </Typography>
              </Stack>

              {deliverables.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay entregas cargadas para tu grupo todavía.
                </Typography>
              ) : (
                <Stack divider={<Divider />} spacing={1.5}>
                  {deliverables.map((deliverable) => (
                    <Stack
                      key={deliverable.id}
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {deliverable.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {deliverable.stage}
                        </Typography>
                      </Box>

                      <Chip
                        label={deliverable.meta.label}
                        color={deliverable.meta.color}
                        size="small"
                        variant={deliverable.meta.color === "default" ? "outlined" : "filled"}
                      />
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}