import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  CardActionArea,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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

  // Estado real: falta de tutor asignado (mismo criterio que la alerta GroupWithoutTutor del dashboard).
  const renderStatus = () => {
    const missingBusiness = !businessTutorName;
    const missingTechnical = !technicalTutorName;

    if (missingBusiness && missingTechnical) {
      return (
        <Chip
          icon={<WarningAmberIcon fontSize="small" style={{ color: "#fff" }} />}
          label="Sin tutores asignados"
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

    if (missingBusiness || missingTechnical) {
      return (
        <Chip
          icon={<WarningAmberIcon fontSize="small" style={{ color: "#fff" }} />}
          label={missingBusiness ? "Falta tutor de negocio" : "Falta tutor técnico"}
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

    if (group.status === "Inactive") {
      return (
        <Chip
          icon={<ErrorOutlineIcon fontSize="small" style={{ color: "#fff" }} />}
          label="Inactivo"
          size="small"
          sx={{
            bgcolor: "#757575",
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "flex-start",
            "& .MuiChip-icon": { color: "#fff" },
          }}
        />
      );
    }

    return null;
  };

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

          {/* Etapa actual */}
          <Box display="flex" alignItems="center" mt={1}>
            <Chip
              label={group.currentStage?.name || "Sin etapa"}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
