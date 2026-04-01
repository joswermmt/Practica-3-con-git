import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "../../../shared/services/api";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "USER";
}

export function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setError("");
    try {
      const response = await api.get<UserRow[]>("/users", {
        params: search ? { search } : undefined,
      });
      setUsers(response.data);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/users/${id}`);
    await loadUsers();
  };

  const updateRole = async (id: string, role: UserRow["role"]) => {
    await api.put(`/users/${id}`, { role });
    await loadUsers();
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Gestion de Usuarios (CRUD)</Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          label="Buscar por nombre, email o rol"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="outlined" onClick={loadUsers}>
          Buscar
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value as UserRow["role"])}
                  >
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="MANAGER">MANAGER</MenuItem>
                    <MenuItem value="USER">USER</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <Button color="error" onClick={() => remove(user.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
