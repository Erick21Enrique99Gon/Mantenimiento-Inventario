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
} from "@mui/material";

import { Add, Edit, Delete, Search } from "@mui/icons-material";
import {
  getUbicaciones,
  createUbicacion,
  updateUbicacion,
  deleteUbicacion,
} from "../../services/ubicacionService";

const CatUbicacion = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [filteredUbicaciones, setFilteredUbicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState(null);
  const [formData, setFormData] = useState({ descripcion: "" });

  // 🔥 Cargar datos al inicio
  useEffect(() => {
    fetchUbicaciones();
  }, []);

  const fetchUbicaciones = async () => {
    try {
      const data = await getUbicaciones();
      console.log("📌 Datos obtenidos de la API:", data); // Log para depuración
      setUbicaciones(data);
      setFilteredUbicaciones(data);
    } catch (error) {
      console.error("❌ Error obteniendo ubicaciones:", error);
    }
  };

  // 🔎 Filtrar por búsqueda
  useEffect(() => {
    const filtered = ubicaciones.filter((ubicacion) =>
      Object.values(ubicacion).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log("🔍 Datos filtrados:", filtered); // Log para depuración
    setFilteredUbicaciones(filtered);
  }, [searchTerm, ubicaciones]);

  // 📌 Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Abrir formulario (Agregar o Editar)
  const handleOpenDialog = (ubicacion = null) => {
    if (ubicacion) {
      setEditingUbicacion(ubicacion);
      setFormData({ descripcion: ubicacion.descripcion }); // ✅ Se usa "descripcion"
    } else {
      setEditingUbicacion(null);
      setFormData({ descripcion: "" });
    }
    setOpenDialog(true);
  };

  // 🔹 Cerrar formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUbicacion(null);
  };

  // ✅ Guardar (Agregar o Editar)
  const handleSave = async () => {
    try {
      if (editingUbicacion) {
        console.log("✏️ Editando ubicación:", editingUbicacion);
        await updateUbicacion(editingUbicacion.ubicacionId, formData);
      } else {
        console.log("➕ Creando nueva ubicación:", formData);
        await createUbicacion(formData);
      }
      fetchUbicaciones();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ Error guardando ubicación:", error);
    }
  };

  // ❌ Eliminar ubicación
  const handleDelete = async (ubicacionId) => {
    if (window.confirm("¿Seguro que deseas eliminar esta ubicación?")) {
      try {
        console.log("🗑️ Eliminando ubicación con ID:", ubicacionId);
        await deleteUbicacion(ubicacionId);
        fetchUbicaciones();
      } catch (error) {
        console.error("❌ Error eliminando ubicación:", error);
      }
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
        <Typography variant="h4">Catálogo de Ubicaciones</Typography>

        {/* 🔎 Filtro de búsqueda */}
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="Buscar"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ ml: 2 }}
            onClick={() => handleOpenDialog()}
          >
            Agregar
          </Button>
        </Box>

        {/* 📝 Tabla con paginación y scroll */}
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell> {/* ✅ Se usa "descripcion" */}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUbicaciones.length > 0 ? (
                filteredUbicaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ubicacion) => (
                  <TableRow key={ubicacion.ubicacionId}>
                    <TableCell>{ubicacion.ubicacionId}</TableCell>
                    <TableCell>{ubicacion.descripcion}</TableCell> {/* ✅ Se usa "descripcion" */}
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(ubicacion)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(ubicacion.ubicacionId)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hay datos disponibles
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
          count={filteredUbicaciones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingUbicacion ? "Editar Ubicación" : "Agregar Ubicación"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Descripción" // ✅ Se usa "descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CatUbicacion;