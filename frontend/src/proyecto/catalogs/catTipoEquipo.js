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
  getTiposEquipo,
  createTipoEquipo,
  updateTipoEquipo,
  deleteTipoEquipo,
} from "../../services/tipo_equipoService";

const CatTipoEquipo = () => {
  const [tiposEquipo, setTiposEquipo] = useState([]);
  const [filteredTiposEquipo, setFilteredTiposEquipo] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTipoEquipo, setEditingTipoEquipo] = useState(null);
  const [formData, setFormData] = useState({ descripcion: "" });

  // 🔥 Cargar datos al inicio
  useEffect(() => {
    fetchTiposEquipo();
  }, []);

  const fetchTiposEquipo = async () => {
    try {
      const data = await getTiposEquipo();
      console.log("📌 Datos obtenidos de la API:", data); // Log para depuración
      setTiposEquipo(data);
      setFilteredTiposEquipo(data);
    } catch (error) {
      console.error("❌ Error obteniendo tipos de equipo:", error);
    }
  };

  // 🔎 Filtrar por búsqueda
  useEffect(() => {
    const filtered = tiposEquipo.filter((tipo) =>
      Object.values(tipo).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log("🔍 Datos filtrados:", filtered); // Log para depuración
    setFilteredTiposEquipo(filtered);
  }, [searchTerm, tiposEquipo]);

  // 📌 Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Abrir formulario (Agregar o Editar)
  const handleOpenDialog = (tipo = null) => {
    if (tipo) {
      setEditingTipoEquipo(tipo);
      setFormData({ descripcion: tipo.descripcion }); // ✅ Se usa "descripcion"
    } else {
      setEditingTipoEquipo(null);
      setFormData({ descripcion: "" });
    }
    setOpenDialog(true);
  };

  // 🔹 Cerrar formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTipoEquipo(null);
  };

  // ✅ Guardar (Agregar o Editar)
  const handleSave = async () => {
    try {
      if (editingTipoEquipo) {
        console.log("✏️ Editando tipo de equipo:", editingTipoEquipo);
        await updateTipoEquipo(editingTipoEquipo.tipoEquipoId, formData);
      } else {
        console.log("➕ Creando nuevo tipo de equipo:", formData);
        await createTipoEquipo(formData);
      }
      fetchTiposEquipo();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ Error guardando tipo de equipo:", error);
    }
  };

  // ❌ Eliminar tipo de equipo
  const handleDelete = async (tipoEquipoId) => {
    if (window.confirm("¿Seguro que deseas eliminar este tipo de equipo?")) {
      try {
        console.log("🗑️ Eliminando tipo de equipo con ID:", tipoEquipoId);
        await deleteTipoEquipo(tipoEquipoId);
        fetchTiposEquipo();
      } catch (error) {
        console.error("❌ Error eliminando tipo de equipo:", error);
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
        <Typography variant="h4">Catálogo de Tipos de Equipo</Typography>

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
              {filteredTiposEquipo.length > 0 ? (
                filteredTiposEquipo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tipo) => (
                  <TableRow key={tipo.tipoEquipoId}>
                    <TableCell>{tipo.tipoEquipoId}</TableCell>
                    <TableCell>{tipo.descripcion}</TableCell> {/* ✅ Se usa "descripcion" */}
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(tipo)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(tipo.tipoEquipoId)}>
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
          count={filteredTiposEquipo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingTipoEquipo ? "Editar Tipo de Equipo" : "Agregar Tipo de Equipo"}</DialogTitle>
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

export default CatTipoEquipo;