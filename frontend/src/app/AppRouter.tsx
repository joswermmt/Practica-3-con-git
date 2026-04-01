import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { UsersPage } from "../features/users/pages/UsersPage";
import { AdminPage } from "../features/admin/pages/AdminPage";

export function AppRouter() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestion de Usuarios
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/auth/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/users">
              Usuarios
            </Button>
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box py={4}>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Box>
      </Container>
    </>
  );
}
