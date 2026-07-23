import { Typography, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import StudentWorkspace from "../sections/StudentsWorkspace"

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "Student") {
    return <StudentWorkspace />;
  }

  return (
    <Box>
      <Typography variant="h4">
        Dashboard
      </Typography>
    </Box>
  );
}

export default Dashboard;
