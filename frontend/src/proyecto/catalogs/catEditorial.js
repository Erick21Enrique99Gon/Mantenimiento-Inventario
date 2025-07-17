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
  getEditoriales,
  createEditorial,
  updateEditorial,
  deleteEditorial,
} from "../../services/editorialService";

const CatEditorial = () => {
  const [editoriales, setEditoriales] = useState([]);
  const [filteredEditoriales, setFilteredEditoriales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEditorial, setEditingEditorial] = useState(null);
  const [formData, setFormData] = useState({ descripcion: "" });

  // 🔥 Cargar datos al inicio
  useEffect(() => {
    fetchEditoriales();
  }, []);

  const fetchEditoriales = async () => {
    try {
      const data = await getEditoriales();
      console.log("📌 Datos obtenidos de la API:", data); // Log para depuración
      setEditoriales(data);
      setFilteredEditoriales(data);
    } catch (error) {
      console.error("❌ Error obteniendo editoriales:", error);
    }
  };

  // 🔎 Filtrar por búsqueda
  useEffect(() => {
    const filtered = editoriales.filter((editorial) =>
      Object.values(editorial).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log("🔍 Datos filtrados:", filtered); // Log para depuración
    setFilteredEditoriales(filtered);
  }, [searchTerm, editoriales]);

  // 📌 Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Abrir formulario (Agregar o Editar)
  const handleOpenDialog = (editorial = null) => {
    if (editorial) {
      setEditingEditorial(editorial);
      setFormData({ descripcion: editorial.descripcion }); // ✅ Se usa "descripcion" en lugar de "nombre"
    } else {
      setEditingEditorial(null);
      setFormData({ descripcion: "" });
    }
    setOpenDialog(true);
  };

  // 🔹 Cerrar formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEditorial(null);
  };

  // ✅ Guardar (Agregar o Editar)
  const handleSave = async () => {
    try {
      if (editingEditorial) {
        console.log("✏️ Editando editorial:", editingEditorial);
        await updateEditorial(editingEditorial.editorialId, formData);
      } else {
        console.log("➕ Creando nueva editorial:", formData);
        await createEditorial(formData);
      }
      fetchEditoriales();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ Error guardando editorial:", error);
    }
  };

  // ❌ Eliminar editorial
  const handleDelete = async (editorialId) => {
    if (window.confirm("¿Seguro que deseas eliminar esta editorial?")) {
      try {
        console.log("🗑️ Eliminando editorial con ID:", editorialId);
        await deleteEditorial(editorialId);
        fetchEditoriales();
      } catch (error) {
        console.error("❌ Error eliminando editorial:", error);
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
        <Typography variant="h4">Catálogo de Editoriales</Typography>

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
                <TableCell>Descripción</TableCell> {/* ✅ Cambio de "Nombre" a "Descripción" */}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEditoriales.length > 0 ? (
                filteredEditoriales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((editorial) => (
                  <TableRow key={editorial.editorialId}>
                    <TableCell>{editorial.editorialId}</TableCell>
                    <TableCell>{editorial.descripcion}</TableCell> {/* ✅ Se usa "descripcion" */}
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(editorial)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(editorial.editorialId)}>
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
          count={filteredEditoriales.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingEditorial ? "Editar Editorial" : "Agregar Editorial"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Descripción" // ✅ Cambio de "Nombre" a "Descripción"
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

export default CatEditorial;