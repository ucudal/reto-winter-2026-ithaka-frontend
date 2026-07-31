import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import esLocale from "@fullcalendar/react/locales/es";
import classicThemePlugin from "@fullcalendar/react/themes/classic";
import ReactQuill from "react-quill";
import {
  createMeeting,
  deleteMeeting,
  getMeetings,
  updateMeeting,
} from "../../api/endpoints/meetings";
import { getGroups } from "../../api/endpoints/groups";
import { getTutors } from "../../api/endpoints/tutors";
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
    status: "Scheduled",
    date: formatDateInput(startDate),
    startTime: formatTimeInput(startDate),
    endTime: formatTimeInput(endDate),
    participants: [],
    attendance: {},
    link: "",
    links: [],
    notes: "",
    nextSteps: "",
  };
};

const getEntityId = (value) =>
  value && typeof value === "object"
    ? (value.student_id ?? value.id)
    : value;

const normalizeIds = (values) =>
  Array.isArray(values)
    ? values
        .map(getEntityId)
        .filter((value) => value !== null && value !== undefined)
    : [];

const getGroupId = (meeting) =>
  meeting.group_id ?? meeting.groupId ?? meeting.group?.id ?? null;

const getTutorName = (tutor) =>
  tutor?.name || tutor?.user?.name || `Tutor #${tutor?.id}`;

const getParticipantName = (participant) =>
  participant?.name ||
  participant?.user?.name ||
  `Estudiante #${participant?.id}`;

const findById = (items, id) =>
  items.find((item) => String(item.id) === String(id));

const getAttendance = (participants) =>
  Object.fromEntries(
    (participants ?? []).map((participant) => [
      getEntityId(participant),
      Boolean(participant?.attended),
    ]),
  );

const toApiId = (value) => {
  const numericId = Number(value);
  return Number.isNaN(numericId) ? value : numericId;
};

const meetingToCalendarEvent = (meeting, availableGroups) => {
  if (!meeting?.date) return null;
  const start = new Date(meeting.date);
  if (Number.isNaN(start.getTime())) return null;

  const groupId = getGroupId(meeting);
  const group = findById(availableGroups, groupId) || meeting.group || null;
  const hoursSpent = Number(meeting.hours_spent ?? meeting.hoursSpent);
  const durationInHours =
    Number.isFinite(hoursSpent) && hoursSpent > 0 ? hoursSpent : 1;
  const end = new Date(start.getTime() + durationInHours * 60 * 60 * 1000);
  const groupName = group?.name;

  return {
    id: String(meeting.id),
    title:
      meeting.summary ||
      (groupName ? `Reunión - ${groupName}` : `Reunión #${meeting.id}`),
    start: meeting.date,
    end: end.toISOString(),
    extendedProps: {
      groupId,
      tutorIds: normalizeIds(meeting.tutor_ids ?? meeting.tutorIds),
      participantIds: normalizeIds(meeting.participants),
      attendance: getAttendance(meeting.participants),
      summary: meeting.summary ?? "",
      status: meeting.status ?? "Scheduled",
      notes: meeting.notes ?? "",
      nextSteps: meeting.next_steps ?? meeting.nextSteps ?? "",
      links: Array.isArray(meeting.links) ? meeting.links : [],
    },
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
  const links = Array.isArray(details.links) ? details.links : [];

  return {
    title: details.summary ?? "",
    group: details.groupId ?? "",
    tutors: details.tutorIds ?? [],
    status: details.status ?? "Scheduled",
    date: formatDateInput(startDate),
    startTime: formatTimeInput(startDate),
    endTime: formatTimeInput(endDate),
    participants: details.participantIds ?? [],
    attendance: details.attendance ?? {},
    link: links[0]?.url ?? "",
    links,
    notes: details.notes ?? "",
    nextSteps: details.nextSteps ?? "",
  };
};

function Meetings() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { user } = useAuth();

  const calendarRef = useRef(null);
  const [selectedView, setSelectedView] = useState("timeGridWeek");
  const [meetings, setMeetings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [meetingsError, setMeetingsError] = useState("");
  const [savingMeeting, setSavingMeeting] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState(null);
  const [popoverMode, setPopoverMode] = useState("create");
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [meetingForm, setMeetingForm] = useState(createMeetingForm);

  const loadMeetings = useCallback(async () => {
    try {
      setLoadingMeetings(true);
      setMeetingsError("");
      const data = await getMeetings();
      setMeetings(data);
    } catch (err) {
      setMeetingsError(err?.message || "No se pudieron cargar las reuniones.");
    } finally {
      setLoadingMeetings(false);
    }
  }, []);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  useEffect(() => {
    let ignore = false;

    const loadReferenceData = async () => {
      const [groupsResult, tutorsResult] = await Promise.allSettled([
        getGroups({ page_size: 100 }),
        getTutors(),
      ]);

      if (ignore) return;

      if (groupsResult.status === "fulfilled") {
        const val = groupsResult.value;
        setGroups(Array.isArray(val) ? val : (val?.items ?? []));
      }
      if (tutorsResult.status === "fulfilled") {
        const val = tutorsResult.value;
        setTutors(Array.isArray(val) ? val : (val?.items ?? []));
      }
    };

    loadReferenceData();

    return () => {
      ignore = true;
    };
  }, []);

  const calendarMeetings = useMemo(
    () =>
      meetings
        .map((meeting) => meetingToCalendarEvent(meeting, groups))
        .filter(Boolean),
    [groups, meetings],
  );

  const filteredMeetings = useMemo(() => {
    if (!user) return [];
    if (user.role !== "Student") return calendarMeetings;

    const studentGroupId =
      user.student?.group_id ?? user.student?.group?.id ?? null;

    if (studentGroupId === null) return [];

    return calendarMeetings.filter(
      (meeting) =>
        String(meeting.extendedProps?.groupId) === String(studentGroupId),
    );
  }, [calendarMeetings, user]);

  const selectedGroup = useMemo(
    () => findById(groups, meetingForm.group),
    [groups, meetingForm.group],
  );
  const participants = selectedGroup?.students ?? [];

  const handleViewChange = (event) => {
    const view = event.target.value;
    setSelectedView(view);
    calendarRef.current?.getApi().changeView(view);
  };

  const handleDateClick = (info) => {
    if (user?.role === "Student") return;

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
    if (user?.role === "Student") return;

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

  const handleDeleteMeeting = async () => {
    if (!selectedMeetingId) return;

    try {
      setSavingMeeting(true);
      setMeetingsError("");
      await deleteMeeting(selectedMeetingId);
      setMeetings((currentMeetings) =>
        currentMeetings.filter(
          (meeting) => String(meeting.id) !== String(selectedMeetingId),
        ),
      );
      handleClosePopover();
    } catch (err) {
      setMeetingsError(err?.message || "No se pudo eliminar la reunión.");
    } finally {
      setSavingMeeting(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setMeetingForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleGroupChange = (event) => {
    setMeetingForm((currentForm) => ({
      ...currentForm,
      group: event.target.value,
      participants: [],
      attendance: {},
    }));
  };

  const handleNotesChange = (notes) => {
    setMeetingForm((currentForm) => ({ ...currentForm, notes }));
  };

  const handleAttendanceChange = (participantId) => {
    setMeetingForm((currentForm) => ({
      ...currentForm,
      attendance: {
        ...currentForm.attendance,
        [participantId]: !currentForm.attendance[participantId],
      },
    }));
  };

  const hasInvalidTime =
    meetingForm.startTime &&
    meetingForm.endTime &&
    meetingForm.endTime <= meetingForm.startTime;

  const canCreateMeeting =
    meetingForm.group &&
    meetingForm.tutors.length > 0 &&
    meetingForm.date &&
    meetingForm.startTime &&
    meetingForm.endTime &&
    !hasInvalidTime;

  const isViewingMeeting = popoverMode === "view";
  const isEditingMeeting = popoverMode === "edit";

  const handleSubmitMeeting = async (event) => {
    event.preventDefault();

    if (!canCreateMeeting) return;

    const start = new Date(
      `${meetingForm.date}T${meetingForm.startTime}:00`,
    );
    const end = new Date(`${meetingForm.date}T${meetingForm.endTime}:00`);
    const existingLinks = meetingForm.links ?? [];
    const link = meetingForm.link.trim();
    const links = link
      ? [
          {
            type: existingLinks[0]?.type || "Drive",
            url: link,
          },
          ...existingLinks.slice(1),
        ]
      : existingLinks.slice(1);

    const meetingPayload = {
      group_id: toApiId(meetingForm.group),
      tutor_ids: meetingForm.tutors.map(toApiId),
      status: meetingForm.status,
      date: start.toISOString(),
      participants: meetingForm.participants.map((participantId) => ({
        student_id: toApiId(participantId),
        attended: Boolean(meetingForm.attendance[participantId]),
      })),
      summary: meetingForm.title.trim() || null,
      notes: meetingForm.notes || null,
      next_steps: meetingForm.nextSteps || null,
      hours_spent: Number(
        ((end.getTime() - start.getTime()) / (60 * 60 * 1000)).toFixed(2),
      ),
      links,
    };

    try {
      setSavingMeeting(true);
      setMeetingsError("");
      if (isEditingMeeting) {
        await updateMeeting(selectedMeetingId, meetingPayload);
      } else {
        await createMeeting(meetingPayload);
      }

      await loadMeetings();
      handleClosePopover();
    } catch (err) {
      setMeetingsError(err?.message || "No se pudo guardar la reunión.");
    } finally {
      setSavingMeeting(false);
    }
  };

  const handleCancelEdit = () => {
    const selectedMeeting = calendarMeetings.find(
      (meeting) => String(meeting.id) === String(selectedMeetingId),
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

      {meetingsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {meetingsError}
        </Alert>
      )}

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
        {loadingMeetings ? (
          <Box
            sx={{
              minHeight: "calc(100vh - 240px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
            events={filteredMeetings}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            selectable
            selectMirror
            selectMinDistance={5}
            select={handleDateSelection}
            height="calc(100vh - 240px)"
            dayMaxEvents
            nowIndicator
          />
        )}
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
                onChange={handleGroupChange}
                readOnly={isViewingMeeting}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
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
                    {selected.map((tutorId) => {
                      const tutor = findById(tutors, tutorId);
                      return (
                        <Chip
                          key={tutorId}
                          label={tutor ? getTutorName(tutor) : `Tutor #${tutorId}`}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {tutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    <Checkbox
                      checked={meetingForm.tutors.some(
                        (tutorId) => String(tutorId) === String(tutor.id),
                      )}
                    />
                    <ListItemText primary={getTutorName(tutor)} />
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
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
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
                    {selected.map((participantId) => {
                      const participant = findById(participants, participantId);
                      return (
                        <Chip
                          key={participantId}
                          label={
                            participant
                              ? getParticipantName(participant)
                              : `Estudiante #${participantId}`
                          }
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {participants.map((participant) => (
                  <MenuItem key={participant.id} value={participant.id}>
                    <Checkbox
                      checked={meetingForm.participants.some(
                        (participantId) =>
                          String(participantId) === String(participant.id),
                      )}
                    />
                    <ListItemText primary={getParticipantName(participant)} />
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
              {user?.role === "Student" ? (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleClosePopover}
                >
                  Cerrar
                </Button>
              ) : isViewingMeeting ? (
                <>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={handleDeleteMeeting}
                    disabled={savingMeeting}
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
                    disabled={!canCreateMeeting || savingMeeting}
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
                    disabled={!canCreateMeeting || savingMeeting}
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
              readOnly={user?.role === "Student"}
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
                    <Typography variant="body2">
                      {getParticipantName(
                        findById(participants, participant) || {
                          id: participant,
                        },
                      )}
                    </Typography>
                    <Checkbox
                      checked={Boolean(
                        meetingForm.attendance[participant],
                      )}
                      onChange={() => handleAttendanceChange(participant)}
                      disabled={user?.role === "Student"}
                      inputProps={{
                        "aria-label": `Marcar asistencia de ${getParticipantName(
                          findById(participants, participant) || {
                            id: participant,
                          },
                        )}`,
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
