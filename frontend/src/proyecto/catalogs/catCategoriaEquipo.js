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
  getCategoriasEquipo,
  createCategoriaEquipo,
  updateCategoriaEquipo,
  deleteCategoriaEquipo,
} from "../../services/categoria_equipoService";

const CatCategoriaEquipo = () => {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({ descripcion: "" });

  // 🔥 Cargar datos al inicio
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await getCategoriasEquipo();
      console.log("📌 Datos obtenidos de la API:", data);
      setCategorias(data);
      setFilteredCategorias(data);
    } catch (error) {
      console.error("❌ Error obteniendo categorías de equipo:", error);
    }
  };

  // 🔎 Filtrar por búsqueda
  useEffect(() => {
    const filtered = categorias.filter((categoria) =>
      Object.values(categoria).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log("🔍 Datos filtrados:", filtered);
    setFilteredCategorias(filtered);
  }, [searchTerm, categorias]);

  // 📌 Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Abrir formulario (Agregar o Editar)
  const handleOpenDialog = (categoria = null) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({ descripcion: categoria.descripcion });
    } else {
      setEditingCategoria(null);
      setFormData({ descripcion: "" });
    }
    setOpenDialog(true);
  };

  // 🔹 Cerrar formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategoria(null);
  };

  // ✅ Guardar (Agregar o Editar)
  const handleSave = async () => {
    try {
      if (editingCategoria) {
        console.log("✏️ Editando categoría de equipo:", editingCategoria);
        await updateCategoriaEquipo(editingCategoria.categoria_equipoId, formData);
      } else {
        console.log("➕ Creando nueva categoría de equipo:", formData);
        await createCategoriaEquipo(formData);
      }
      fetchCategorias();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ Error guardando categoría de equipo:", error);
    }
  };

  // ❌ Eliminar categoría de equipo
  const handleDelete = async (categoria_equipoId) => {
    if (window.confirm("¿Seguro que deseas eliminar esta categoría de equipo?")) {
      try {
        console.log("🗑️ Eliminando categoría de equipo con ID:", categoria_equipoId);
        await deleteCategoriaEquipo(categoria_equipoId);
        fetchCategorias();
      } catch (error) {
        console.error("❌ Error eliminando categoría de equipo:", error);
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
        <Typography variant="h4">Catálogo de Categorías de Equipo</Typography>

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

        {/* 📝 Tabla con paginación */}
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategorias.length > 0 ? (
                filteredCategorias
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((categoria) => (
                    <TableRow key={categoria.categoria_equipoId}>
                      <TableCell>{categoria.categoria_equipoId}</TableCell>
                      <TableCell>{categoria.descripcion}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenDialog(categoria)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(categoria.categoria_equipoId)}>
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
          count={filteredCategorias.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingCategoria ? "Editar Categoría de Equipo" : "Agregar Categoría de Equipo"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Descripción"
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

export default CatCategoriaEquipo;