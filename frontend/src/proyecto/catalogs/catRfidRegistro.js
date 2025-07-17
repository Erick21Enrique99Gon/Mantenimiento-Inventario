import React, { useState, useEffect, useRef } from "react";
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
import { Add, Delete, Search } from "@mui/icons-material";
import {
  getRfidRegistros,
  createRfidRegistro,
  deleteRfidRegistro,
} from "../../services/rfid_registroService";

const estados = {
  4: "Activo",
  5: "Inactivo",
};

const CatRfidRegistro = () => {
  const [rfids, setRfids] = useState([]);
  const [filteredRfids, setFilteredRfids] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ rfid: "" });
  const [rfidError, setRfidError] = useState("");
  const rfidInputRef = useRef(null);

  // 🔥 Cargar datos al inicio
  useEffect(() => {
    fetchRfids();
  }, []);

  const fetchRfids = async () => {
    try {
      const data = await getRfidRegistros();
      console.log("📌 Datos obtenidos de la API:", data);
      setRfids(data);
      setFilteredRfids(data);
    } catch (error) {
      console.error("❌ Error obteniendo registros RFID:", error);
    }
  };

  // 🔎 Filtrar por búsqueda
  useEffect(() => {
    const filtered = rfids.filter((rfid) =>
      Object.values(rfid).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log("🔍 Datos filtrados:", filtered);
    setFilteredRfids(filtered);
  }, [searchTerm, rfids]);

  // 📌 Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRfidError("");
  };

  // 📌 Detectar el escaneo de tarjeta RFID
  const handleRFIDInput = (e) => {
    const rfidCode = e.target.value.trim();
    setFormData({ ...formData, rfid: rfidCode });
    setRfidError("");

    if (rfidCode) {
      const rfidExists = rfids.some((rfid) => rfid.rfid === rfidCode);
      if (rfidExists) {
        setRfidError("⚠️ Este código RFID ya está registrado.");
        setFormData({ ...formData, rfid: "" });
      }
    }
  };

  // 📌 Manejo del pegado (Ctrl + V)
  const handleRFIDPaste = (e) => {
    const pastedText = e.clipboardData.getData("Text").trim();
    handleRFIDInput({ target: { value: pastedText } });
  };

  // 🔹 Abrir formulario para agregar
  const handleOpenDialog = () => {
    setFormData({ rfid: "" }); // Reiniciar el formulario
    setRfidError("");
    setOpenDialog(true);

    // Autoenfocar el campo RFID cuando se abra el diálogo
    setTimeout(() => {
      if (rfidInputRef.current) {
        rfidInputRef.current.focus();
      }
    }, 100);
  };

  // 🔹 Cerrar formulario
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // ✅ Guardar nuevo registro RFID
  const handleSave = async () => {
    if (!formData.rfid) {
      setRfidError("⚠️ El campo RFID no puede estar vacío.");
      return;
    }

    try {
      const newRfid = { ...formData, estadoId: 5 }; // Siempre se guarda como Inactivo
      console.log("➕ Creando nuevo registro RFID:", newRfid);
      await createRfidRegistro(newRfid);
      fetchRfids();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ Error guardando registro RFID:", error);
    }
  };

  // ❌ Eliminar registro RFID
  const handleDelete = async (rfidId) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro RFID?")) {
      try {
        console.log("🗑️ Eliminando registro RFID con ID:", rfidId);
        await deleteRfidRegistro(rfidId);
        fetchRfids();
      } catch (error) {
        console.error("❌ Error eliminando registro RFID:", error);
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
        <Typography variant="h4">Catálogo de Registros RFID</Typography>

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
            onClick={handleOpenDialog}
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
                <TableCell>RFID</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRfids.length > 0 ? (
                filteredRfids
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rfid) => (
                    <TableRow key={rfid.rfidId}>
                      <TableCell>{rfid.rfidId}</TableCell>
                      <TableCell>{rfid.rfid}</TableCell>
                      <TableCell>{rfid.estado?.descripcion || estados[rfid.estadoId] || "Desconocido"}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(rfid.rfidId)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
          count={filteredRfids.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* 📌 Formulario Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Agregar Registro RFID</DialogTitle>
        <DialogContent>
          <TextField
            label="Escanear RFID"
            name="rfid"
            value={formData.rfid}
            onChange={handleRFIDInput}
            onPaste={handleRFIDPaste}
            fullWidth
            margin="dense"
            inputRef={rfidInputRef}
            error={Boolean(rfidError)}
            helperText={rfidError}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CatRfidRegistro;