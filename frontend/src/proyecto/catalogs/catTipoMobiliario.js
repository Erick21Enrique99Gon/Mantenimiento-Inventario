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
  getTiposMobiliario,
  createTipoMobiliario,
  updateTipoMobiliario,
  deleteTipoMobiliario,
} from "../../services/tipo_mobiliarioService";

const CatTipoMobiliario = () => {
  const [tiposMobiliario, setTiposMobiliario] = useState([]);
  const [filteredTiposMobiliario, setFilteredTiposMobiliario] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTipoMobiliario, setEditingTipoMobiliario] = useState(null);
  const [formData, setFormData] = useState({ descripcion: "" });

  // 🔥 Cargar datos al inicio
  useEffect(() => {
    fetchTiposMobiliario();
  }, []);

  const fetchTiposMobiliario = async () => {
    try {
      const data = await getTiposMobiliario();
      console.log("📌 Datos obtenidos de la API:", data); // Log para depuración
      setTiposMobiliario(data);
      setFilteredTiposMobiliario(data);
    } catch (error) {
      console.error("❌ Error obteniendo tipos de mobiliario:", error);
    }
  };

  // 🔎 Filtrar por búsqueda
  useEffect(() => {
    const filtered = tiposMobiliario.filter((tipo) =>
      Object.values(tipo).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log("🔍 Datos filtrados:", filtered); // Log para depuración
    setFilteredTiposMobiliario(filtered);
  }, [searchTerm, tiposMobiliario]);

  // 📌 Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Abrir formulario (Agregar o Editar)
  const handleOpenDialog = (tipo = null) => {
    if (tipo) {
      setEditingTipoMobiliario(tipo);
      setFormData({ descripcion: tipo.descripcion }); // ✅ Se usa "descripcion"
    } else {
      setEditingTipoMobiliario(null);
      setFormData({ descripcion: "" });
    }
    setOpenDialog(true);
  };

  // 🔹 Cerrar formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTipoMobiliario(null);
  };

  // ✅ Guardar (Agregar o Editar)
  const handleSave = async () => {
    try {
      if (editingTipoMobiliario) {
        console.log("✏️ Editando tipo de mobiliario:", editingTipoMobiliario);
        await updateTipoMobiliario(editingTipoMobiliario.tipoMobiliarioId, formData);
      } else {
        console.log("➕ Creando nuevo tipo de mobiliario:", formData);
        await createTipoMobiliario(formData);
      }
      fetchTiposMobiliario();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ Error guardando tipo de mobiliario:", error);
    }
  };

  // ❌ Eliminar tipo de mobiliario
  const handleDelete = async (tipoMobiliarioId) => {
    if (window.confirm("¿Seguro que deseas eliminar este tipo de mobiliario?")) {
      try {
        console.log("🗑️ Eliminando tipo de mobiliario con ID:", tipoMobiliarioId);
        await deleteTipoMobiliario(tipoMobiliarioId);
        fetchTiposMobiliario();
      } catch (error) {
        console.error("❌ Error eliminando tipo de mobiliario:", error);
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
        <Typography variant="h4">Catálogo de Tipos de Mobiliario</Typography>

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
              {filteredTiposMobiliario.length > 0 ? (
                filteredTiposMobiliario.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tipo) => (
                  <TableRow key={tipo.tipoMobiliarioId}>
                    <TableCell>{tipo.tipoMobiliarioId}</TableCell>
                    <TableCell>{tipo.descripcion}</TableCell> {/* ✅ Se usa "descripcion" */}
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(tipo)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(tipo.tipoMobiliarioId)}>
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
          count={filteredTiposMobiliario.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingTipoMobiliario ? "Editar Tipo de Mobiliario" : "Agregar Tipo de Mobiliario"}</DialogTitle>
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

export default CatTipoMobiliario;