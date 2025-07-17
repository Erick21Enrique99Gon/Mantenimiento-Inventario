import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Button, Typography, Box, TablePagination,
} from "@mui/material";
import { getPrestamos } from "../../services/prestamoService";
import { getDetallesPrestamo } from "../../services/detalle_prestamoService";
import { getHistoriales } from "../../services/historialService";
import { getRecursos } from "../../services/recursoService";
import { realizarDevolucion } from "../../services/procedimientoService";

const Return = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [searchPrestamo, setSearchPrestamo] = useState("");
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      const [prestamosData, detallesData, historialesData, recursosData] = await Promise.all([
        getPrestamos(),
        getDetallesPrestamo(),
        getHistoriales(),
        getRecursos(),
      ]);

      const prestamosActivos = prestamosData.filter(p => p.estado?.descripcion === "Activo");

      const prestamosFinales = prestamosActivos.map(prestamo => {
        const detalle = detallesData.find(d => d.prestamo?.prestamoId === prestamo.prestamoId) || {};
        const historial = historialesData.find(h => h.prestamo?.prestamoId === prestamo.prestamoId);
        const prestario = historial?.usuario_prestario || {};
        const recurso = recursosData.find(r => r.recursoId === detalle.recurso?.recursoId) || {};

        let recursoDescripcion = "Sin descripción";
        if (recurso.libro) recursoDescripcion = `Libro: ${recurso.libro.titulo} - ${recurso.libro.autor}`;
        else if (recurso.mobiliario) recursoDescripcion = `Mobiliario: ${recurso.mobiliario.descripcion}`;
        else if (recurso.equipo) recursoDescripcion = `Equipo: ${recurso.equipo.descripcion}`;

        return {
          id: prestamo.prestamoId,
          observacion: prestamo.observacion,
          prestario,
          recurso: {
            descripcion: recursoDescripcion,
            ubicacion: recurso.libro?.ubicacion?.descripcion || recurso.mobiliario?.ubicacion?.descripcion || recurso.equipo?.ubicacion?.descripcion || "Ubicación no disponible",
            estado: recurso.estado?.descripcion || "Desconocido",
          },
        };
      });

      setPrestamos(prestamosFinales);
    } catch (error) {
      console.error("❌ Error obteniendo préstamos:", error);
    }
  };

  const handleImageChange = (event) => {
    setImagen(event.target.files[0] || null);
  };

  const handleDevolucion = async () => {
    if (!selectedPrestamo) {
      alert("Debe seleccionar un préstamo para realizar la devolución");
      return;
    }

    try {
      await realizarDevolucion(selectedPrestamo.id, imagen);
      alert("✅ Devolución registrada exitosamente");
      setImagen(null);
      fetchPrestamos();
    } catch (error) {
      console.error("❌ Error al realizar la devolución:", error);
      alert("❌ Error al realizar la devolución: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Gestión de Devoluciones
      </Typography>

      <TextField
        label="Buscar préstamo"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setSearchPrestamo(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prestario</TableCell>
              <TableCell>DPI Prestario</TableCell>
              <TableCell>Recurso</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamos
              .filter(p => (p.prestario?.nombres || "").toLowerCase().includes(searchPrestamo.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((p) => (
                <TableRow
                  key={p.id}
                  onClick={() => setSelectedPrestamo(p)}
                  sx={{ cursor: "pointer", backgroundColor: selectedPrestamo?.id === p.id ? "#f0f0f0" : "" }}
                >
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.prestario.nombres} {p.prestario.apellidos}</TableCell>
                  <TableCell>{p.prestario.dpi}</TableCell>
                  <TableCell>{p.recurso.descripcion}</TableCell>
                  <TableCell>{p.recurso.ubicacion}</TableCell>
                  <TableCell>{p.recurso.estado}</TableCell>
                  <TableCell>{p.observacion}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={prestamos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Subir Imagen de Devolución
          <input type="file" hidden onChange={handleImageChange} accept="image/*" />
        </Button>
        {imagen && <Typography sx={{ mt: 1 }}>Imagen seleccionada: {imagen.name}</Typography>}
      </Box>

      <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth onClick={handleDevolucion}>
        Realizar Devolución
      </Button>
    </Box>
  );
};

export default Return;