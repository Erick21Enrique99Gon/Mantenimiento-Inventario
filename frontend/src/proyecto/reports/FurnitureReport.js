import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Grid
} from "@mui/material";
import { getRecursos } from "../../services/recursoService";
import { saveAs } from "file-saver";

const FurnitureReport = () => {
  const [mobiliarios, setMobiliarios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    codigo: "",
    descripcion: "",
    estado: "",
    ubicacion: "",
    tipo: ""
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchMobiliarios();
  }, []);

  const fetchMobiliarios = async () => {
    try {
      const recursos = await getRecursos();
      const muebles = recursos
        .filter(r => r.mobiliario)
        .map(r => ({
          codigoInventario: r.mobiliario.codigoInventario
            ? typeof r.mobiliario.codigoInventario === "object"
              ? r.mobiliario.codigoInventario.codigo || "N/A"
              : r.mobiliario.codigoInventario
            : "N/A",
          descripcion: r.mobiliario.descripcion,
          estado: r.estado?.descripcion || "Desconocido",
          ubicacion: r.mobiliario.ubicacion?.descripcion || "No disponible",
          tipo: r.mobiliario.tipoMobiliario?.descripcion || "No especificado"
        }));
      setMobiliarios(muebles);
      setFiltered(muebles);
    } catch (error) {
      console.error("Error obteniendo mobiliarios:", error);
    }
  };

  const exportToCSV = () => {
    const BOM = "\uFEFF";
    const header = "Código,Descripción,Estado,Ubicación,Tipo de Mobiliario\n";
    const rows = filtered.map(m =>
      `${m.codigoInventario},"${m.descripcion}",${m.estado},"${m.ubicacion}","${m.tipo}"`
    );
    const csvContent = BOM + header + rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Reporte_Mobiliario.csv");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const result = mobiliarios.filter(m => {
      return (
        m.codigoInventario.toLowerCase().includes(filters.codigo.toLowerCase()) &&
        m.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase()) &&
        m.estado.toLowerCase().includes(filters.estado.toLowerCase()) &&
        m.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase()) &&
        m.tipo.toLowerCase().includes(filters.tipo.toLowerCase())
      );
    });
    setFiltered(result);
    setPage(0);
  }, [filters, mobiliarios]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" mb={2} fontWeight="bold">
        Reporte de Mobiliario
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Filtrar por Código"
            variant="outlined"
            fullWidth
            name="codigo"
            value={filters.codigo}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Filtrar por Descripción"
            variant="outlined"
            fullWidth
            name="descripcion"
            value={filters.descripcion}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Filtrar por Estado"
            variant="outlined"
            fullWidth
            name="estado"
            value={filters.estado}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Filtrar por Ubicación"
            variant="outlined"
            fullWidth
            name="ubicacion"
            value={filters.ubicacion}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Filtrar por Tipo"
            variant="outlined"
            fullWidth
            name="tipo"
            value={filters.tipo}
            onChange={handleFilterChange}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Tipo de Mobiliario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((m, index) => (
                <TableRow key={index}>
                  <TableCell>{m.codigoInventario}</TableCell>
                  <TableCell>{m.descripcion}</TableCell>
                  <TableCell>{m.estado}</TableCell>
                  <TableCell>{m.ubicacion}</TableCell>
                  <TableCell>{m.tipo}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        rowsPerPageOptions={[5, 10, 15]}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={exportToCSV}>
          Exportar a CSV
        </Button>
      </Box>
    </Box>
  );
};

export default FurnitureReport;