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
import { Delete, Search } from "@mui/icons-material";
import { getUsuarios, deleteUsuario } from "../../services/usuarioService";

const DeleteUserTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  // 📌 Abrir el diálogo de confirmación de eliminación
  const handleOpenDialog = (usuario) => {
    setSelectedUser(usuario);
    setOpenDialog(true);
  };

  // 📌 Cerrar el diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 🗑️ Eliminar usuario
  const handleDeleteUser = async () => {
    try {
      await deleteUsuario(selectedUser.usuarioId);
      setSuccessMessage(`Usuario ${selectedUser.nombres} ${selectedUser.apellidos} eliminado.`);
      setUsuarios(usuarios.filter((u) => u.usuarioId !== selectedUser.usuarioId));
      handleCloseDialog();
    } catch (error) {
      setErrorMessage("Error al eliminar el usuario.");
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
        <Typography variant="h4">Gestión de Usuarios (Eliminar)</Typography>

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
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDialog(usuario)}
                        >
                          <Delete />
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

      {/* 📌 Diálogo de confirmación de eliminación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar a{" "}
            <strong>
              {selectedUser?.nombres} {selectedUser?.apellidos}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Eliminar
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

export default DeleteUserTable;
