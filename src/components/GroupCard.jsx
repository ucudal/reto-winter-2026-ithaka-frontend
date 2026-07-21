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
} from "@mui/material";

export default function GroupCard({ group }) {
  
  const getInitials = (name) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");

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
                {getInitials(group.technicalTutor.name)}
              </Avatar>

              <Avatar>
                {getInitials(group.businessTutor.name)}
              </Avatar>
            </AvatarGroup>

            <Typography
              variant="body2"
              ml={2}
            >
              {group.technicalTutor.name}, {group.businessTutor.name}
            </Typography>
          </Box>
        </Box>

        
        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ my: 2 }} />

        
        <Typography
          variant="caption"
          color="primary"
        >
          {group.currentStage.name}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={40}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}
