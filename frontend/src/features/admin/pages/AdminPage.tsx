import { List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";

const modules = [
  "Gestion avanzada de roles y permisos",
  "Control de accesos y auditoria",
  "Configuracion del sistema",
  "Logs de actividad",
];

export function AdminPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Pantalla de Administracion</Typography>
      <Paper>
        <List>
          {modules.map((item) => (
            <ListItem key={item}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
