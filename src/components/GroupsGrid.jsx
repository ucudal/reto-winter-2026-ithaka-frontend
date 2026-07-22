import { Grid } from "@mui/material";
import EmptyState from "./common/EmptyState";
import GroupCard from "./GroupCard";

export default function GroupsGrid({ groups }) {
  if (groups.length === 0) {
    return (
      <EmptyState
        title="No hay grupos"
        description="Todavía no hay grupos cargados."
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {groups.map((group) => (
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          key={group.id}
        >
          <GroupCard group={group} />
        </Grid>
      ))}
    </Grid>
  );
}
