import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useParams } from "react-router-dom";

export default function CohortLifecycleConfiguration() {
  const { id } = useParams();

  const [stages, setStages] = useState([
    {
      id: 1,
      name: "Inicio del programa",
      description: "Comienzo del cohorte",
      date: "2026-08-01",
    },
    {
      id: 2,
      name: "Primera entrega",
      description: "Entrega del primer avance",
      date: "2026-09-15",
    },
  ]);

  const [newStage, setNewStage] = useState({
    name: "",
    description: "",
    date: "",
  });

  const handleAddStage = () => {
    if (!newStage.name) return;

    setStages((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newStage,
      },
    ]);

    setNewStage({
      name: "",
      description: "",
      date: "",
    });
  };

  const handleDelete = (id) => {
    setStages((prev) => prev.filter((stage) => stage.id !== id));
  };

  const moveStage = (index, direction) => {
    const updated = [...stages];

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= updated.length) return;

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setStages(updated);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Configuración del ciclo de vida del Cohorte {id}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Etapas e hitos
        </Typography>

        <Stack spacing={2}>
          {stages.map((stage, index) => (
            <Paper
              key={stage.id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {index + 1}. {stage.name}
                </Typography>

                <Typography>
                  {stage.description}
                </Typography>

                <Typography variant="body2">
                  Fecha: {stage.date}
                </Typography>
              </Box>

              <Box>
                <IconButton onClick={() => moveStage(index, -1)}>
                  <ArrowUpwardIcon />
                </IconButton>

                <IconButton onClick={() => moveStage(index, 1)}>
                  <ArrowDownwardIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(stage.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Paper>


      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Agregar nuevo hito
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nombre"
            value={newStage.name}
            onChange={(e) =>
              setNewStage({
                ...newStage,
                name: e.target.value,
              })
            }
          />

          <TextField
            label="Descripción"
            value={newStage.description}
            onChange={(e) =>
              setNewStage({
                ...newStage,
                description: e.target.value,
              })
            }
          />

          <TextField
            label="Fecha"
            type="date"
            value={newStage.date}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setNewStage({
                ...newStage,
                date: e.target.value,
              })
            }
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddStage}
          >
            Agregar hito
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
