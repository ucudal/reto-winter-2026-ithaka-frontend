import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import GroupCard from "../../components/GroupCard";

export default function StudentWorkspace() {
  const studentGroup = {
    id: 1,
    name: "EcoRoute",
    status: "In progress",

    students: [
      { id: 1, name: "Juan Pérez" },
      { id: 2, name: "Ana Gómez" },
      { id: 3, name: "Martín Silva" },
    ],

    technicalTutor: {
      name: "Pedro Tutor",
    },

    businessTutor: {
      name: "María Tutor",
    },

    currentStage: {
      name: "Development",
    },
  };

  const deliveries = [
    {
      id: 1,
      title: "Entrega Sprint 1",
      dueDate: "30/07/2026",
    },
    {
      id: 2,
      title: "Demo Intermedia",
      dueDate: "15/08/2026",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight={600}
        sx={{ mb: 3 }}
      >
        Mi Workspace
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Mi grupo
          </Typography>

          <GroupCard group={studentGroup} />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 3 }}
      >
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
              >
                Próximas entregas
              </Typography>

              {deliveries.map((delivery) => (
                <Box
                  key={delivery.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600}>
                    {delivery.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Fecha límite: {delivery.dueDate}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
              >
                Información del grupo
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                >
                  Tutor técnico
                </Typography>

                <Typography sx={{ mb: 2 }}>
                  {studentGroup.technicalTutor.name}
                </Typography>

                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                >
                  Tutor de negocio
                </Typography>

                <Typography>
                  {studentGroup.businessTutor.name}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}