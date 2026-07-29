import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  AlertTitle,
  Breadcrumbs,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

import { useAuth } from "../../context/AuthContext";
import { getDashboardSummary } from "../../api/endpoints/dashboard";
import { getOverloadedTutors } from "../../api/endpoints/tutors";
import { getPendingCheckpoints, submitCheckpointResponse } from "../../api/endpoints/checkpoints";
import PendingCheckpointModal from "../../components/PendingCheckpointModal";

// Cupo de referencia por grupo definido en la propuesta (22 hs de acompañamiento).
const GROUP_HOURS_QUOTA = 22;

const CARD_SX = {
  borderRadius: 2,
  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
};

function SectionHeader({ icon, title, helpText, chipLabel, chipColor = "default" }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        mb: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
        {icon}
        <Typography variant="body2" fontWeight="bold" noWrap>
          {title}
        </Typography>
      </Box>
      {chipLabel && (
        <Tooltip title={helpText} arrow placement="top">
          <Chip
            label={chipLabel}
            color={chipColor}
            size="small"
            variant="outlined"
            sx={{ flexShrink: 0, fontWeight: "medium", cursor: "help" }}
          />
        </Tooltip>
      )}
    </Box>
  );
}

function StatTile({ icon, label, value, severity }) {
  return (
    <Card sx={{ ...CARD_SX, position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          bgcolor: `${severity}.main`,
        }}
      />
      <CardContent sx={{ pl: 2.5, py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
            color: `${severity}.main`,
          }}
        >
          {icon}
          <Typography variant="caption" color="text.secondary" fontWeight="medium">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [overloadedTutors, setOverloadedTutors] = useState([]);
  const [pendingCheckpoints, setPendingCheckpoints] = useState([]);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      
      const shouldFetchCheckpoints = ["Student", "BusinessTutor", "TechnicalTutor"].includes(user?.role);
      
      const [summaryData, overloadedData, checkpointsData] = await Promise.all([
        getDashboardSummary(),
        getOverloadedTutors(),
        shouldFetchCheckpoints ? getPendingCheckpoints() : Promise.resolve([]),
      ]);
      setSummary(summaryData);
      setOverloadedTutors(overloadedData);
      setPendingCheckpoints(checkpointsData || []);
      if (checkpointsData && checkpointsData.length > 0) {
        setActiveCheckpoint(checkpointsData[0]);
      }
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los datos del resumen del Dashboard.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const {
    active_groups = 0,
    active_tutors = 0,
    groups_by_stage = [],
    groups_by_cohort = [],
    hours_by_group = [],
    capacity = { total_available_hours: 0, total_used_hours: 0, usage_percentage: 0 },
    pending_deliverables = 0,
    alerts = [],
  } = summary || {};

  const sortedHoursByGroup = [...hours_by_group].sort((a, b) => b.hours_used - a.hours_used);
  const topHoursByGroup = sortedHoursByGroup.slice(0, 8);

  const capacityStatus =
    capacity.usage_percentage > 90
      ? { label: "Sobrecargado", color: "error" }
      : capacity.usage_percentage > 75
      ? { label: "Cerca del límite", color: "warning" }
      : { label: "Uso saludable", color: "success" };

  const capacityColor = theme.palette[capacityStatus.color].main;

  const stageWithMostGroups = groups_by_stage.reduce(
    (max, item) => (!max || item.count > max.count ? item : max),
    null,
  );

  const cohortWithMostGroups = groups_by_cohort.reduce(
    (max, item) => (!max || item.count > max.count ? item : max),
    null,
  );

  const overQuotaCount = hours_by_group.filter(
    (item) => item.hours_used > GROUP_HOURS_QUOTA,
  ).length;

  const chartTickStyle = { fontSize: 10 };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 1.5 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 0.25 }}>
          <Typography color="text.primary" variant="body2">
            Resumen
          </Typography>
        </Breadcrumbs>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Panel Principal
        </Typography>
      </Box>

      {/* KPIs: lo más importante primero */}
      <Grid container spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile
            icon={<GroupIcon fontSize="small" />}
            label="Grupos Activos"
            value={active_groups}
            severity="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile
            icon={<SupervisorAccountIcon fontSize="small" />}
            label="Tutores Activos"
            value={active_tutors}
            severity="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile
            icon={<AssignmentLateIcon fontSize="small" />}
            label="Entregables Pendientes"
            value={pending_deliverables}
            severity="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile
            icon={<ReportProblemIcon fontSize="small" />}
            label="Alertas Activas"
            value={alerts.length}
            severity={alerts.length > 0 ? "error" : "success"}
          />
        </Grid>
      </Grid>

      {overloadedTutors.length > 0 && (
        <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
          <AlertTitle>Tutores con sobrecarga ({overloadedTutors.length})</AlertTitle>
          <List dense disablePadding>
            {overloadedTutors.map((tutor) => (
              <ListItem
                key={tutor.id ?? tutor.tutor_id}
                disableGutters
                secondaryAction={
                  <Chip
                    label={`${tutor.usage_percentage}% de uso`}
                    color="error"
                    size="small"
                  />
                }
              >
                <ListItemText primary={tutor.name} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {/* Los 4 gráficos, 2 por línea */}
      <Grid container spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ pb: "12px !important" }}>
              <SectionHeader
                icon={<AccessTimeIcon color="primary" sx={{ fontSize: 18 }} />}
                title="Capacidad"
                chipLabel={capacityStatus.label}
                chipColor={capacityStatus.color}
                helpText="Porcentaje de horas de tutoría usadas sobre el total disponible entre todos los tutores activos. Por encima del 75% está cerca del límite; por encima del 90%, sobrecargado."
              />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Gauge
                  value={Math.min(capacity.usage_percentage, 100)}
                  startAngle={-110}
                  endAngle={110}
                  height={150}
                  text={() => `${capacity.usage_percentage}%`}
                  sx={{
                    [`& .${gaugeClasses.valueArc}`]: { fill: capacityColor },
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 26,
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                {capacity.total_used_hours} / {capacity.total_available_hours} hs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ pb: "12px !important" }}>
              <SectionHeader
                icon={<FolderSpecialIcon color="primary" sx={{ fontSize: 18 }} />}
                title="Grupos por Etapa"
                chipLabel={stageWithMostGroups ? `Más en: ${stageWithMostGroups.stage}` : undefined}
                chipColor="primary"
                helpText="Cantidad de grupos activos según la etapa del proceso (Ideación, Anteproyecto, Proyecto Final) en la que se encuentran."
              />
              {groups_by_stage.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Sin etapas activas.
                </Typography>
              ) : (
                <BarChart
                  dataset={groups_by_stage}
                  xAxis={[{ scaleType: "band", dataKey: "stage", tickLabelStyle: chartTickStyle }]}
                  series={[
                    { dataKey: "count", label: "Grupos", color: theme.palette.primary.main },
                  ]}
                  height={190}
                  borderRadius={6}
                  grid={{ horizontal: true }}
                  slotProps={{ legend: { hidden: true } }}
                  margin={{ top: 8, bottom: 24, left: 24, right: 8 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ pb: "12px !important" }}>
              <SectionHeader
                icon={<CalendarMonthIcon color="primary" sx={{ fontSize: 18 }} />}
                title="Grupos por Cohorte"
                chipLabel={
                  groups_by_cohort.length > 0
                    ? `${groups_by_cohort.length} cohortes activas`
                    : undefined
                }
                chipColor="secondary"
                helpText="Cantidad de grupos activos agrupados por cohorte (año y semestre en el que ingresaron)."
              />
              {groups_by_cohort.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Sin cohortes activas.
                </Typography>
              ) : (
                <BarChart
                  dataset={groups_by_cohort}
                  xAxis={[{ scaleType: "band", dataKey: "cohort", tickLabelStyle: chartTickStyle }]}
                  series={[
                    { dataKey: "count", label: "Grupos", color: theme.palette.secondary.main },
                  ]}
                  height={190}
                  borderRadius={6}
                  grid={{ horizontal: true }}
                  slotProps={{ legend: { hidden: true } }}
                  margin={{ top: 8, bottom: 24, left: 24, right: 8 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ pb: "12px !important" }}>
              <SectionHeader
                icon={<QueryStatsIcon color="primary" sx={{ fontSize: 18 }} />}
                title="Horas por Grupo"
                chipLabel={
                  overQuotaCount > 0 ? `${overQuotaCount} superan el cupo` : "Dentro del cupo"
                }
                chipColor={overQuotaCount > 0 ? "error" : "success"}
                helpText={`Horas de tutoría registradas por grupo, comparadas contra el cupo de referencia de ${GROUP_HOURS_QUOTA}hs definido en la propuesta. La línea punteada marca ese límite.`}
              />
              {topHoursByGroup.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Sin horas registradas.
                </Typography>
              ) : (
                <BarChart
                  dataset={topHoursByGroup}
                  layout="horizontal"
                  yAxis={[
                    { scaleType: "band", dataKey: "group_name", tickLabelStyle: chartTickStyle },
                  ]}
                  series={[
                    {
                      dataKey: "hours_used",
                      label: "Horas",
                      color: theme.palette.primary.main,
                    },
                  ]}
                  height={190}
                  borderRadius={6}
                  grid={{ vertical: true }}
                  slotProps={{ legend: { hidden: true } }}
                  margin={{ top: 8, bottom: 24, left: 56, right: 8 }}
                  onItemClick={(event, item) => {
                    const group = topHoursByGroup[item.dataIndex];
                    if (group) navigate(`/groups/${group.group_id}`);
                  }}
                >
                  <ChartsReferenceLine
                    x={GROUP_HOURS_QUOTA}
                    lineStyle={{ stroke: theme.palette.error.main, strokeDasharray: "4 4" }}
                  />
                </BarChart>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {activeCheckpoint && (
        <PendingCheckpointModal
          open={Boolean(activeCheckpoint)}
          checkpoint={activeCheckpoint}
          onClose={() => setActiveCheckpoint(null)}
          onSubmitSuccess={async (id, answers) => {
            await submitCheckpointResponse(id, answers);
            setPendingCheckpoints((prev) => prev.filter((c) => c.id !== id));
          }}
        />
      )}
    </Box>
  );
}
