import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  LinearProgress,
  CardActionArea,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EventIcon from "@mui/icons-material/Event";

export default function GroupCard({ group }) {
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  const technicalTutorName = group.technicalTutor?.name;
  const businessTutorName = group.businessTutor?.name;

  // Render a mock date or warning/status based on group properties to match the design aesthetics
  const renderStatus = () => {
    if (group.status === "Overloaded") {
      return (
        <Chip
          icon={<ErrorOutlineIcon fontSize="small" style={{ color: "#fff" }} />}
          label="Sobrecarga"
          size="small"
          sx={{
            bgcolor: "#d32f2f",
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "flex-start",
            "& .MuiChip-icon": { color: "#fff" },
          }}
        />
      );
    }

    if (group.status === "Late" || group.id % 3 === 0) {
      return (
        <Chip
          icon={<WarningAmberIcon fontSize="small" style={{ color: "#fff" }} />}
          label="Entrega atrasada"
          size="small"
          sx={{
            bgcolor: "#ed6c02",
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "flex-start",
            "& .MuiChip-icon": { color: "#fff" },
          }}
        />
      );
    }

    if (group.status === "Meeting" || group.id === 4) {
      return (
        <Chip
          icon={<EventIcon fontSize="small" style={{ color: "#fff" }} />}
          label="En reunión"
          size="small"
          sx={{
            bgcolor: "#0288d1",
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "flex-start",
            "& .MuiChip-icon": { color: "#fff" },
          }}
        />
      );
    }

    // Default: Next delivery info
    const mockDay = (group.id * 7) % 28 + 1;
    return (
      <Box display="flex" alignItems="center" gap={1} color="text.secondary">
        <CalendarTodayIcon fontSize="small" sx={{ fontSize: 16 }} />
        <Typography variant="caption">
          Próxima entrega {mockDay} de Agosto
        </Typography>
      </Box>
    );
  };

  const progress = 35 + (group.id * 15) % 55; // Generate stable mock progress percentages (e.g. 35% - 90%)

  const studentFirstNames = group.students?.map((s) => s.name.split(" ")[0]).join(", ") || "";
  const tutorFirstNames = [
    businessTutorName?.split(" ")[0],
    technicalTutorName?.split(" ")[0],
  ].filter(Boolean).join(", ");

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/groups/${group.id}`} sx={{ p: 1.5 }}>
        <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          
          {/* Header: Title + Initials Avatar */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h6" fontWeight="bold" sx={{ pr: 1 }}>
              {group.name}
            </Typography>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "grey.300",
                color: "text.secondary",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {group.name ? group.name[0].toUpperCase() : "G"}
            </Avatar>
          </Box>

          {/* Status/Badge */}
          <Box minHeight={24} display="flex" alignItems="center">
            {renderStatus()}
          </Box>

          {/* Integrantes */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
              Integrantes
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5} gap={1}>
              <AvatarGroup
                max={3}
                sx={{
                  "& .MuiAvatar-root": {
                    width: 28,
                    height: 28,
                    fontSize: 11,
                    border: "2px solid #fff",
                  },
                }}
              >
                {group.students?.map((student) => (
                  <Avatar key={student.id} sx={{ bgcolor: "primary.light" }}>
                    {getInitials(student.name)}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  maxWidth: "70%",
                }}
              >
                {studentFirstNames || "Sin integrantes"}
              </Typography>
            </Box>
          </Box>

          {/* Tutores */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
              Tutores
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5} gap={1}>
              <AvatarGroup
                max={2}
                sx={{
                  "& .MuiAvatar-root": {
                    width: 28,
                    height: 28,
                    fontSize: 11,
                    border: "2px solid #fff",
                  },
                }}
              >
                {businessTutorName && (
                  <Avatar sx={{ bgcolor: "secondary.light" }}>
                    {getInitials(businessTutorName)}
                  </Avatar>
                )}
                {technicalTutorName && (
                  <Avatar sx={{ bgcolor: "info.light" }}>
                    {getInitials(technicalTutorName)}
                  </Avatar>
                )}
                {!businessTutorName && !technicalTutorName && (
                  <Avatar>?</Avatar>
                )}
              </AvatarGroup>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  maxWidth: "70%",
                }}
              >
                {tutorFirstNames || "Sin tutores asignados"}
              </Typography>
            </Box>
          </Box>

          {/* Stage Progress Bar */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography
              variant="body2"
              color="primary"
              fontWeight="bold"
              sx={{
                fontSize: 12,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "40%",
              }}
            >
              {group.currentStage?.name || "Sin etapa"}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                width: "55%",
                height: 5,
                borderRadius: 2,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
