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
  getCodigosLibro,
  createCodigoLibro,
  updateCodigoLibro,
  deleteCodigoLibro,
} from "../../services/codigo_libroService";

const CatCodigoLibro = () => {
  const [codigos, setCodigos] = useState([]);
  const [filteredCodigos, setFilteredCodigos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCodigo, setEditingCodigo] = useState(null);
  const [formData, setFormData] = useState({ descripcion: "" });

  // 🔥 Cargar datos al inicio
  useEffect(() => {
    fetchCodigos();
  }, []);

  const fetchCodigos = async () => {
    try {
      const data = await getCodigosLibro();
      console.log("📌 Datos obtenidos de la API:", data); // Log para depuración
      setCodigos(data);
      setFilteredCodigos(data);
    } catch (error) {
      console.error("❌ Error obteniendo códigos de libro:", error);
    }
  };

  // 🔎 Filtrar por búsqueda
  useEffect(() => {
    const filtered = codigos.filter((codigo) =>
      Object.values(codigo).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log("🔍 Datos filtrados:", filtered); // Log para depuración
    setFilteredCodigos(filtered);
  }, [searchTerm, codigos]);

  // 📌 Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Abrir formulario (Agregar o Editar)
  const handleOpenDialog = (codigo = null) => {
    if (codigo) {
      setEditingCodigo(codigo);
      setFormData({ descripcion: codigo.descripcion });
    } else {
      setEditingCodigo(null);
      setFormData({ descripcion: "" });
    }
    setOpenDialog(true);
  };

  // 🔹 Cerrar formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCodigo(null);
  };

  // ✅ Guardar (Agregar o Editar)
  const handleSave = async () => {
    try {
      if (editingCodigo) {
        console.log("✏️ Editando código de libro:", editingCodigo);
        await updateCodigoLibro(editingCodigo.codigoId, formData);
      } else {
        console.log("➕ Creando nuevo código de libro:", formData);
        await createCodigoLibro(formData);
      }
      fetchCodigos();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ Error guardando código de libro:", error);
    }
  };

  // ❌ Eliminar código de libro
  const handleDelete = async (codigoId) => {
    if (window.confirm("¿Seguro que deseas eliminar este código de libro?")) {
      try {
        console.log("🗑️ Eliminando código de libro con ID:", codigoId);
        await deleteCodigoLibro(codigoId);
        fetchCodigos();
      } catch (error) {
        console.error("❌ Error eliminando código de libro:", error);
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
        <Typography variant="h4">Catálogo de Códigos de Libro</Typography>

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
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCodigos.length > 0 ? (
                filteredCodigos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((codigo) => (
                  <TableRow key={codigo.codigoId}>
                    <TableCell>{codigo.codigoId}</TableCell>
                    <TableCell>{codigo.descripcion}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(codigo)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(codigo.codigoId)}>
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
          count={filteredCodigos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingCodigo ? "Editar Código de Libro" : "Agregar Código de Libro"}</DialogTitle>
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

export default CatCodigoLibro;