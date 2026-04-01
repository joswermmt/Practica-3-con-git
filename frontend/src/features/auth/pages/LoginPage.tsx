import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { api } from "../../../shared/services/api";

export function LoginPage() {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setMessage("");
    try {
      const response = await api.post("/auth/login", { email, password });
      setMessage(`Bienvenido ${response.data.user.name}`);
    } catch {
      setError("Credenciales invalidas o usuario no registrado.");
    }
  };

  const register = async () => {
    setError("");
    setMessage("");
    try {
      const response = await api.post("/auth/register", {
        name: "Administrador",
        email,
        password,
        role: "ADMIN",
      });
      setMessage(`Usuario creado: ${response.data.user.email}`);
    } catch {
      setError("No fue posible registrar el usuario.");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 460 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Login / Registro</Typography>
        <Typography variant="body2">MVP inicial con autenticacion JWT.</Typography>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField
          label="Contrasena"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={submit}>
            Ingresar
          </Button>
          <Button variant="outlined" onClick={register}>
            Registrar
          </Button>
        </Stack>
        <Box>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Stack>
    </Paper>
  );
}
