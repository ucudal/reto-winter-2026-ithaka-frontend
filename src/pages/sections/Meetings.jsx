import { useRef, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import esLocale from "@fullcalendar/react/locales/es";
import classicThemePlugin from "@fullcalendar/react/themes/classic";
import ReactQuill from "react-quill";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";
import "react-quill/dist/quill.snow.css";

const notesEditorModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const tabContentHeight = "min(480px, calc(100vh - 81px))";

const calendarViews = [
  { value: "timeGridDay", label: "Día" },
  { value: "timeGridWeek", label: "Semana" },
  { value: "dayGridMonth", label: "Mes" },
];

const groups = ["Grupo 1", "Grupo 2", "Grupo 3"];
const tutors = ["Ana Pérez", "Juan Silva", "María Rodríguez", "Carlos Gómez"];
const participants = [
  "Sofía Martínez",
  "Mateo Fernández",
  "Valentina López",
  "Santiago García",
  "Camila Rodríguez",
  "Joaquín Pereira",
];

const mockedMeetings = [
  {
    id: "1",
    title: "Seguimiento Grupo 1",
    start: "2026-07-22T10:00:00",
    end: "2026-07-22T11:00:00",
    extendedProps: {
      group: "Grupo 1",
      tutors: ["Ana Pérez", "Juan Silva"],
      participants: ["Sofía Martínez", "Mateo Fernández"],
      attendance: {
        "Sofía Martínez": true,
        "Mateo Fernández": true,
      },
      link: "https://meet.google.com/abc-defg-hij",
    },
  },
  {
    id: "2",
    title: "Revisión técnica Grupo 2",
    start: "2026-07-23T09:30:00",
    end: "2026-07-23T10:30:00",
    extendedProps: {
      group: "Grupo 2",
      tutors: ["María Rodríguez"],
      participants: ["Valentina López", "Santiago García"],
      attendance: {
        "Valentina López": true,
        "Santiago García": false,
      },
      link: "https://teams.microsoft.com/l/meetup-join/revision-grupo-2",
    },
  },
  {
    id: "3",
    title: "Tutoría Grupo 3",
    start: "2026-07-23T15:00:00",
    end: "2026-07-23T16:00:00",
    extendedProps: {
      group: "Grupo 3",
      tutors: ["Carlos Gómez"],
      participants: ["Camila Rodríguez", "Joaquín Pereira"],
      attendance: {
        "Camila Rodríguez": false,
        "Joaquín Pereira": false,
      },
      link: "https://meet.google.com/uvw-xyz-123",
    },
  },
  {
    id: "4",
    title: "Planificación de próximos pasos",
    start: "2026-07-24T11:00:00",
    end: "2026-07-24T12:00:00",
    extendedProps: {
      group: "Grupo 1",
      tutors: ["Ana Pérez"],
      participants: ["Sofía Martínez", "Mateo Fernández", "Valentina López"],
      attendance: {
        "Sofía Martínez": true,
        "Mateo Fernández": false,
        "Valentina López": true,
      },
      link: "https://teams.microsoft.com/l/meetup-join/planificacion",
    },
  },
];

const padNumber = (value) => String(value).padStart(2, "0");

const formatDateInput = (date) =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate(),
  )}`;

const formatTimeInput = (date) =>
  `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;

const createMeetingForm = (
  startDate = new Date(),
  endDate = new Date(startDate.getTime() + 60 * 60 * 1000),
) => {

  return {
    title: "",
    group: "",
    tutors: [],
    date: formatDateInput(startDate),
    startTime: formatTimeInput(startDate),
    endTime: formatTimeInput(endDate),
    participants: [],
    attendance: {},
    link: "",
    notes: "",
  };
};

const meetingToForm = (meeting) => {
  const startDate =
    meeting.start instanceof Date ? meeting.start : new Date(meeting.start);
  const endDate = meeting.end
    ? meeting.end instanceof Date
      ? meeting.end
      : new Date(meeting.end)
    : new Date(startDate.getTime() + 60 * 60 * 1000);
  const details = meeting.extendedProps ?? {};

  return {
    title: meeting.title,
    group: details.group ?? "",
    tutors: details.tutors ?? [],
    date: formatDateInput(startDate),
    startTime: formatTimeInput(startDate),
    endTime: formatTimeInput(endDate),
    participants: details.participants ?? [],
    attendance: details.attendance ?? {},
    link: details.link ?? "",
    notes: details.notes ?? "",
  };
};

function Meetings() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const calendarRef = useRef(null);
  const [selectedView, setSelectedView] = useState("dayGridMonth");
  const [meetings, setMeetings] = useState(mockedMeetings);
  const [popoverPosition, setPopoverPosition] = useState(null);
  const [popoverMode, setPopoverMode] = useState("create");
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [meetingForm, setMeetingForm] = useState(createMeetingForm);

  const handleViewChange = (event) => {
    const view = event.target.value;

    setSelectedView(view);
    calendarRef.current?.getApi().changeView(view);
  };

  const handleDateClick = (info) => {
    const isTimedView = ["timeGridDay", "timeGridWeek"].includes(
      info.view.type,
    );
    const isMonthView = info.view.type === "dayGridMonth";

    if ((!isTimedView && !isMonthView) || (isTimedView && info.allDay)) {
      return;
    }

    const newMeetingForm = createMeetingForm(info.date);

    setMeetingForm(
      isMonthView
        ? {
            ...newMeetingForm,
            startTime: "",
            endTime: "",
          }
        : newMeetingForm,
    );
    setSelectedMeetingId(null);
    setPopoverMode("create");
    setActiveTab(0);
    setPopoverPosition({
      top: info.jsEvent.clientY,
      left: info.jsEvent.clientX,
    });
  };

  const handleDateSelection = (info) => {
    if (
      !["timeGridDay", "timeGridWeek"].includes(info.view.type) ||
      info.allDay
    ) {
      calendarRef.current?.getApi().unselect();
      return;
    }

    setMeetingForm(createMeetingForm(info.start, info.end));
    setSelectedMeetingId(null);
    setPopoverMode("create");
    setActiveTab(0);
    setPopoverPosition({
      top: info.jsEvent.clientY,
      left: info.jsEvent.clientX,
    });
  };

  const handleEventClick = (info) => {
    const { event, jsEvent } = info;
    jsEvent.preventDefault();
    setMeetingForm(meetingToForm(event));
    setSelectedMeetingId(event.id);
    setPopoverMode("view");
    setActiveTab(0);
    setPopoverPosition({
      top: jsEvent.clientY,
      left: jsEvent.clientX,
    });
  };

  const handleClosePopover = () => {
    setPopoverPosition(null);
    setSelectedMeetingId(null);
    calendarRef.current?.getApi().unselect();
  };

  const handleDeleteMeeting = () => {
    if (!selectedMeetingId) return;

    // await apiClient.delete(`/api/meetings/${selectedMeetingId}`);
    setMeetings((currentMeetings) =>
      currentMeetings.filter((meeting) => meeting.id !== selectedMeetingId),
    );
    handleClosePopover();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setMeetingForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleNotesChange = (notes) => {
    setMeetingForm((currentForm) => ({ ...currentForm, notes }));

    if (selectedMeetingId) {
      setMeetings((currentMeetings) =>
        currentMeetings.map((meeting) =>
          meeting.id === selectedMeetingId
            ? {
                ...meeting,
                extendedProps: {
                  ...meeting.extendedProps,
                  notes,
                },
              }
            : meeting,
        ),
      );
    }
  };

  const handleAttendanceChange = (participant) => {
    const attendance = {
      ...meetingForm.attendance,
      [participant]: !meetingForm.attendance[participant],
    };

    setMeetingForm((currentForm) => ({
      ...currentForm,
      attendance,
    }));

    if (selectedMeetingId) {
      setMeetings((currentMeetings) =>
        currentMeetings.map((meeting) =>
          meeting.id === selectedMeetingId
            ? {
                ...meeting,
                extendedProps: {
                  ...meeting.extendedProps,
                  attendance,
                },
              }
            : meeting,
        ),
      );
    }
  };

  const hasInvalidTime =
    meetingForm.startTime &&
    meetingForm.endTime &&
    meetingForm.endTime <= meetingForm.startTime;

  const canCreateMeeting =
    meetingForm.title.trim() &&
    meetingForm.group &&
    meetingForm.tutors.length > 0 &&
    meetingForm.date &&
    meetingForm.startTime &&
    meetingForm.endTime &&
    !hasInvalidTime;
  const isViewingMeeting = popoverMode === "view";
  const isEditingMeeting = popoverMode === "edit";

  const handleSubmitMeeting = (event) => {
    event.preventDefault();

    if (!canCreateMeeting) return;

    const meetingData = {
      title: meetingForm.title.trim(),
      start: `${meetingForm.date}T${meetingForm.startTime}:00`,
      end: `${meetingForm.date}T${meetingForm.endTime}:00`,
      extendedProps: {
        group: meetingForm.group,
        tutors: meetingForm.tutors,
        participants: meetingForm.participants,
        attendance: Object.fromEntries(
          meetingForm.participants.map((participant) => [
            participant,
            Boolean(meetingForm.attendance[participant]),
          ]),
        ),
        link: meetingForm.link.trim(),
        notes: meetingForm.notes,
      },
    };

    setMeetings((currentMeetings) => {
      if (isEditingMeeting) {
        return currentMeetings.map((meeting) =>
          meeting.id === selectedMeetingId
            ? {
                ...meeting,
                ...meetingData,
              }
            : meeting,
        );
      }

      return [
        ...currentMeetings,
        {
          id: `mock-${Date.now()}`,
          ...meetingData,
        },
      ];
    });

    handleClosePopover();
  };

  const handleCancelEdit = () => {
    const selectedMeeting = meetings.find(
      (meeting) => meeting.id === selectedMeetingId,
    );

    if (selectedMeeting) {
      setMeetingForm(meetingToForm(selectedMeeting));
    }

    setPopoverMode("view");
  };

  const handleStartEdit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPopoverMode("edit");
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
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
            borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
            color: isDarkMode ? "#f3f4f6" : "#374151",
            "&:hover": {
              backgroundColor: isDarkMode ? "#4b5563" : "#f3f4f6",
              borderColor: isDarkMode ? "#6b7280" : "#9ca3af",
              color: isDarkMode ? "#ffffff" : "#111827",
            },
            "&:active, &.fc-button-active": {
              backgroundColor: isDarkMode ? "#1f2937" : "#e5e7eb",
              borderColor: isDarkMode ? "#374151" : "#9ca3af",
              color: isDarkMode ? "#ffffff" : "#111827",
            },
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
          plugins={[
            classicThemePlugin,
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}
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
          events={meetings}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          selectable
          selectMirror
          selectMinDistance={5}
          select={handleDateSelection}
          height="calc(100vh - 220px)"
          dayMaxEvents
          nowIndicator
        />
      </Paper>

      <Popover
        open={Boolean(popoverPosition)}
        onClose={handleClosePopover}
        anchorReference="anchorPosition"
        anchorPosition={popoverPosition ?? { top: 0, left: 0 }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: 480,
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "calc(100vh - 32px)",
              borderRadius: 2,
              boxShadow: 6,
              overflow: "hidden",
            },
          },
        }}
      >
        
        <Tabs
          value={activeTab}
          onChange={(_event, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          aria-label="Secciones de la reunión"
          sx={{ px: 1 }}
        >
          <Tab
            label={
              isViewingMeeting
                ? "Detalles"
                : isEditingMeeting
                  ? "Editar"
                  : "Crear"
            }
          />
          <Tab label="Notas" />
          <Tab label="Asistencia" />
        </Tabs>

        <Divider />

        {activeTab === 0 && (
          <Box
            component="form"
            onSubmit={handleSubmitMeeting}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              height: tabContentHeight,
              boxSizing: "border-box",
              overflowY: "auto",
            }}
          >
            <TextField
              name="title"
              label="Título"
              value={meetingForm.title}
              onChange={handleFormChange}
              size="small"
              required
              InputProps={{ readOnly: isViewingMeeting }}
              autoFocus={!isViewingMeeting}
              fullWidth
            />

            <FormControl size="small" required fullWidth>
              <InputLabel id="meeting-group-label">Grupo</InputLabel>
              <Select
                labelId="meeting-group-label"
                name="group"
                value={meetingForm.group}
                label="Grupo"
                onChange={handleFormChange}
                readOnly={isViewingMeeting}
              >
                {groups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" required fullWidth>
              <InputLabel id="meeting-tutors-label">Tutores</InputLabel>
              <Select
                labelId="meeting-tutors-label"
                name="tutors"
                multiple
                value={meetingForm.tutors}
                label="Tutores"
                onChange={handleFormChange}
                readOnly={isViewingMeeting}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((tutor) => (
                      <Chip key={tutor} label={tutor} size="small" />
                    ))}
                  </Box>
                )}
              >
                {tutors.map((tutor) => (
                  <MenuItem key={tutor} value={tutor}>
                    <Checkbox checked={meetingForm.tutors.includes(tutor)} />
                    <ListItemText primary={tutor} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1.4fr 1fr 1fr" },
                gap: 1,
              }}
            >
              <TextField
                name="date"
                label="Fecha"
                type="date"
                value={meetingForm.date}
                onChange={handleFormChange}
                size="small"
                required
                InputProps={{ readOnly: isViewingMeeting }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="startTime"
                label="Inicio"
                type="time"
                value={meetingForm.startTime}
                onChange={handleFormChange}
                size="small"
                required
                InputProps={{ readOnly: isViewingMeeting }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="endTime"
                label="Fin"
                type="time"
                value={meetingForm.endTime}
                onChange={handleFormChange}
                size="small"
                required
                InputProps={{ readOnly: isViewingMeeting }}
                error={Boolean(hasInvalidTime)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {hasInvalidTime && (
              <Typography variant="caption" color="error" sx={{ mt: -1.5 }}>
                La hora de fin debe ser posterior a la hora de inicio.
              </Typography>
            )}

            <FormControl size="small" fullWidth>
              <InputLabel id="meeting-participants-label">
                Participantes
              </InputLabel>
              <Select
                labelId="meeting-participants-label"
                name="participants"
                multiple
                value={meetingForm.participants}
                label="Participantes"
                onChange={handleFormChange}
                readOnly={isViewingMeeting}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((participant) => (
                      <Chip
                        key={participant}
                        label={participant}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {participants.map((participant) => (
                  <MenuItem key={participant} value={participant}>
                    <Checkbox
                      checked={meetingForm.participants.includes(participant)}
                    />
                    <ListItemText primary={participant} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="link"
              label="Link a reunión"
              placeholder="https://meet.google.com/..."
              type="url"
              value={meetingForm.link}
              onChange={handleFormChange}
              size="small"
              InputProps={{ readOnly: isViewingMeeting }}
              fullWidth
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                pt: 0.5,
              }}
            >
              {isViewingMeeting ? (
                <>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={handleDeleteMeeting}
                  >
                    Eliminar
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleStartEdit}
                  >
                    Editar
                  </Button>
                </>
              ) : isEditingMeeting ? (
                <>
                  <Button type="button" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!canCreateMeeting}
                  >
                    Guardar cambios
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" onClick={handleClosePopover}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!canCreateMeeting}
                  >
                    Crear reunión
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box
            sx={{
              p: 2,
              height: tabContentHeight,
              boxSizing: "border-box",
              "& .quill": {
                display: "flex",
                flexDirection: "column",
                height: "100%",
              },
              "& .ql-toolbar": {
                flexShrink: 0,
              },
              "& .ql-container": {
                flex: 1,
                minHeight: 0,
              },
              "& .ql-editor": {
                overflowY: "auto",
              },
            }}
          >
            <ReactQuill
              theme="snow"
              value={meetingForm.notes}
              onChange={handleNotesChange}
              modules={notesEditorModules}
            />
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ p: 2, minHeight: 160 }}>
            {meetingForm.participants.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay participantes seleccionados para esta reunión.
              </Typography>
            ) : (
              <Box
                component="ul"
                sx={{
                  p: 0,
                  m: 0,
                  listStyle: "none",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                {meetingForm.participants.map((participant, index) => (
                  <Box
                    component="li"
                    key={participant}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      px: 1.5,
                      py: 0.5,
                      borderBottom:
                        index < meetingForm.participants.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2">{participant}</Typography>
                    <Checkbox
                      checked={Boolean(
                        meetingForm.attendance[participant],
                      )}
                      onChange={() => handleAttendanceChange(participant)}
                      inputProps={{
                        "aria-label": `Marcar asistencia de ${participant}`,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Popover>
    </Box>
  );
}

export default Meetings;
