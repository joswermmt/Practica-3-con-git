import { Card, CardContent, Grid, Typography } from "@mui/material";

const cards = [
  { title: "Usuarios activos", value: "128" },
  { title: "Alertas pendientes", value: "5" },
  { title: "Reportes hoy", value: "12" },
];

export function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard de Usuario
      </Typography>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{card.title}</Typography>
                <Typography variant="h5">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
