import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Search } from "@mui/icons-material";
import { getUsuarios, updateUsuario } from "../../services/usuarioService";

const PasswordReset = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 Cargar usuarios al inicio
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (error) {
      setErrorMessage("Error al cargar los usuarios.");
    }
  };

  // 🔎 Filtrar usuarios por búsqueda
  useEffect(() => {
    const filtered = usuarios.filter((usuario) =>
      Object.values(usuario).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsuarios(filtered);
  }, [searchTerm, usuarios]);

  // 📌 Abrir el formulario de cambio de contraseña
  const handleOpenDialog = (usuario) => {
    setSelectedUser(usuario);
    setNewPassword("");
    setOpenDialog(true);
  };

  // 📌 Cerrar el formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // ✅ Guardar la nueva contraseña
  const handlePasswordReset = async () => {
    if (!newPassword) {
      setErrorMessage("La contraseña no puede estar vacía.");
      return;
    }

    try {
      await updateUsuario(selectedUser.usuarioId, { password: newPassword });
      setSuccessMessage("Contraseña actualizada correctamente.");
      handleCloseDialog();
    } catch (error) {
      setErrorMessage("Error al actualizar la contraseña.");
    }
  };

  // 📌 Control de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Gestión de Contraseñas</Typography>

        {/* 🔎 Barra de búsqueda */}
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="Buscar usuario"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </Box>

        {/* 📝 Tabla con paginación */}
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Carnet</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((usuario) => (
                    <TableRow key={usuario.usuarioId}>
                      <TableCell>{usuario.usuarioId}</TableCell>
                      <TableCell>{`${usuario.nombres} ${usuario.apellidos}`}</TableCell>
                      <TableCell>{usuario.carnet}</TableCell>
                      <TableCell>{usuario.rol?.descripcion || "No definido"}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenDialog(usuario)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay usuarios disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 📌 Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsuarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal para Restablecer Contraseña */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Restablecer Contraseña</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Usuario: <strong>{selectedUser?.nombres} {selectedUser?.apellidos}</strong>
          </Typography>
          <TextField
            label="Nueva Contraseña"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handlePasswordReset} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* 📌 Alertas de éxito y error */}
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage("")}>
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage("")}>
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default PasswordReset;