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
          defaultValue="property"
          variant="filled"
          sx={{
            width: 280,

            "& .MuiFilledInput-root": {
              height: 60,
              backgroundColor: "#f5f5f5",

              "&:hover": {
                backgroundColor: "#f5f5f5",
              },

              "&.Mui-focused": {
                backgroundColor: "#f5f5f5",
              },

              "&:before": {
                borderBottom: "1px solid #BDBDBD",
              },

              "&:after": {
                borderBottom: "2px solid #1976d2",
              },
            },

            "& .MuiInputLabel-root": {
              color: "#1976d2",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#1976d2",
            },
          }}
        >
          <MenuItem value="property">Property</MenuItem>
          <MenuItem value="progress">En progreso</MenuItem>
          <MenuItem value="finished">Finalizados</MenuItem>
        </TextField>
      </Box>

      
      <GroupsGrid groups={mockGroups} />

    </Box>
  );
}

export default Groups;
