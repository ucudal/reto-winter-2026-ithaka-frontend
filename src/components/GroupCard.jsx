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
  IconButton,
  Tooltip,
  getLinearProgressUtilityClass,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

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


  // TODO: Reemplazar este valor por el porcentaje real cuando
  // el backend exponga el progreso del grupo.
  const progress = 40;

  return (
    <Card
      sx={{
        minHeight: 340,
        borderRadius: 2,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {group.name}
          </Typography>

          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "grey.400",
              fontSize: 14,
            }}
          >
            E
          </Avatar>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
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
        </Box>

        
        <Chip
          label={group.status}
          size="small"
          color={group.status === "Finished" ? "success" : "primary"}
          sx={{
            alignSelf: "flex-start",
            width: "fit-content",
            mb: 1,
          }}
        />

    
        <Box mb={2} mt={0.5}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Integrantes
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            mt={1}
          >
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  fontSize: 12,
                },
              }}
            >
              {group.students.map((student) => (
                <Avatar key={student.id}>
                  {getInitials(student.name)}
                </Avatar>
              ))}
            </AvatarGroup>

            <Typography
              variant="body2"
              ml={2}
            >
              {group.students.map((s) => s.name).join(", ")}
            </Typography>
          </Box>
        </Box>

        
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Tutores
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            mt={1}
          >
            <AvatarGroup
              max={2}
              sx={{
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  fontSize: 12,
                },
              }}
            >
              <Avatar>
                {technicalTutorName ? getInitials(technicalTutorName) : "?"}
              </Avatar>

              <Avatar>
                {businessTutorName ? getInitials(businessTutorName) : "?"}
              </Avatar>
            </AvatarGroup>

            <Typography
              variant="body2"
              ml={2}
            >
              {technicalTutorName || "Sin asignar"}
              {" • "}
              {businessTutorName || "Sin asignar"}
            </Typography>
          </Box>
        </Box>

        
        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ my: 2 }} />

        
        <Typography
          variant="caption"
          color="primary"
        >
          {group.currentStage?.name || "Sin etapa asignada"}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}
