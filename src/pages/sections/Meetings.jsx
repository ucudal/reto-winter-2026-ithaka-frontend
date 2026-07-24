import { useRef, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import esLocale from "@fullcalendar/react/locales/es";
import classicThemePlugin from "@fullcalendar/react/themes/classic";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

const calendarViews = [
  { value: "timeGridDay", label: "Día" },
  { value: "timeGridWeek", label: "Semana" },
  { value: "dayGridMonth", label: "Mes" },
];

const mockedMeetings = [
  {
    id: "1",
    title: "Seguimiento Grupo 1",
    start: "2026-07-22T10:00:00",
    end: "2026-07-22T11:00:00",
  },
  {
    id: "2",
    title: "Revisión técnica Grupo 2",
    start: "2026-07-23T09:30:00",
    end: "2026-07-23T10:30:00",
  },
  {
    id: "3",
    title: "Tutoría Grupo 3",
    start: "2026-07-23T15:00:00",
    end: "2026-07-23T16:00:00",
  },
  {
    id: "4",
    title: "Planificación de próximos pasos",
    start: "2026-07-24T11:00:00",
    end: "2026-07-24T12:00:00",
  },
];

function Meetings() {
  const calendarRef = useRef(null);
  const [selectedView, setSelectedView] = useState("dayGridMonth");

  const handleViewChange = (event) => {
    const view = event.target.value;

    setSelectedView(view);
    calendarRef.current?.getApi().changeView(view);
  };

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
              onChange={handleViewChange}
            >
              {calendarViews.map((view) => (
                <MenuItem key={view.value} value={view.value}>
                  {view.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1, sm: 1.5 },
          borderRadius: 1,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          "& .fc": {
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontSize: "0.82rem",
            "--fc-border-color": "rgba(0, 0, 0, 0.12)",
            "--fc-button-bg-color": "transparent",
            "--fc-button-border-color": "rgba(0, 0, 0, 0.23)",
            "--fc-button-text-color": "rgba(0, 0, 0, 0.87)",
            "--fc-button-hover-bg-color": "rgba(0, 0, 0, 0.04)",
            "--fc-button-hover-border-color": "rgba(0, 0, 0, 0.23)",
            "--fc-button-active-bg-color": "rgba(0, 0, 0, 0.08)",
            "--fc-button-active-border-color": "rgba(0, 0, 0, 0.23)",
            "--fc-today-bg-color": "rgba(25, 118, 210, 0.08)",
          },
          "& .fc *": {
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          },
          "& .fc .fc-toolbar": {
            alignItems: "center",
            gap: 1,
            marginBottom: "0.75rem",
          },
          "& .meetings-calendar-title": {
            fontSize: { xs: "1rem", sm: "1.1rem" },
            fontWeight: 600,
            textTransform: "capitalize",
          },
          "& .fc .fc-button": {
            borderRadius: "4px",
            boxShadow: "none",
            textTransform: "none",
            padding: "0.3rem 0.55rem",
          },
          "& .fc .fc-col-header-cell-cushion": {
            color: "text.primary",
            fontWeight: 600,
            textDecoration: "none",
            textTransform: "capitalize",
          },
          "& .fc .fc-daygrid-day-number": {
            color: "text.primary",
            textDecoration: "none",
          },
        }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[classicThemePlugin, dayGridPlugin, timeGridPlugin]}
          themeSystem="classic"
          initialView={selectedView}
          locale={esLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          buttons={{
            today: {
              text: "Hoy",
              display: "text",
            },
          }}
          toolbarTitleClass="meetings-calendar-title"
          allDayText="Todo el día"
          events={mockedMeetings}
          height={450}
          dayMaxEvents
          nowIndicator
        />
      </Paper>
    </Box>
  );
}

export default Meetings;
