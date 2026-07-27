import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { getTutorCapacity } from "../../api/endpoints/tutors";

export default function TutorDetail() {
  const { id } = useParams();

  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCapacity = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTutorCapacity(id);
        console.log(data);
        setCapacity(data);

      } catch (err) {
        setError(
          err?.message || "No se pudo cargar la capacidad del tutor."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCapacity();
  }, [id]);


  const percentage = capacity?.usage_percentage ?? 0;


  return (
    <Box sx={{ width: "100%" }}>

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          component={RouterLink}
          to="/tutors"
          underline="hover"
          color="inherit"
        >
          Tutores
        </Link>

        <Typography color="text.primary">
          Detalle del tutor
        </Typography>
      </Breadcrumbs>


      <Typography variant="h4" sx={{ mb: 3 }}>
        Perfil del tutor
      </Typography>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>

      ) : error ? (

        <Alert severity="error">
          {error}
        </Alert>

      ) : (

        <Paper sx={{ p: 3, borderRadius: 2 }}>

          <Typography variant="h6">
            Capacidad del tutor
          </Typography>


          <Card sx={{ mt: 2 }}>
            <CardContent>

              <Typography>
                Capacidad máxima:
                <strong>
                  {" "}
                  {capacity.max_capacity} hs
                </strong>
              </Typography>


              <Typography>
                Horas asignadas:
                <strong>
                  {" "}
                  {capacity.assigned_hours} hs
                </strong>
              </Typography>


              <Typography>
                Horas disponibles:
                <strong>
                  {" "}
                  {capacity.available_hours} hs
                </strong>
              </Typography>


              <Box sx={{ mt: 3 }}>

                <Typography sx={{ mb: 1 }}>
                  Uso de capacidad:
                  {" "}
                  {percentage.toFixed(1)}%
                </Typography>


                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                  }}
                />

              </Box>


            </CardContent>
          </Card>


        </Paper>

      )}

    </Box>
  );
}
