import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import GroupsGrid from "../../components/GroupsGrid";
import { mockGroups } from "../../data/mockGroups";

function Groups() {
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

        <Typography color="text.primary">
          Grupos
        </Typography>
      </Breadcrumbs>

      
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4">
          Grupos
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            select
            size="small"
            label="Vista"
            defaultValue="gallery"
            sx={{ width: 170 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ViewModuleIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="gallery">
              Galería
            </MenuItem>
          </TextField>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              height: 40,
            }}
          >
            Agregar grupo
          </Button>
        </Box>
      </Box>

    
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          alignItems: "stretch",
        }}
      >
        
        <TextField
          label="Buscar"
          placeholder="Ingrese un dato"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 60,
            },
          }}
        />

        
        <TextField
          select
          label="Filtrar por"
          defaultValue=""
          variant="filled"
          sx={{
            width: 280,

            "& .MuiFilledInput-root": {
              height: 60,
              bgcolor: "action.hover",

              "&:hover": {
                bgcolor: "action.hover",
              },

              "&.Mui-focused": {
                bgcolor: "action.hover",
              },

              "&:before": {
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              },

              "&:hover:not(.Mui-disabled):before": {
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              },

              "&:after": {
                borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
              },
            },

            "& .MuiInputLabel-root": {
              color: "primary.main",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "primary.main",
            },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="progress">En progreso</MenuItem>
          <MenuItem value="finished">Finalizados</MenuItem>
        </TextField>
      </Box>

      
      <GroupsGrid groups={mockGroups} />

    </Box>
  );
}

export default Groups;
