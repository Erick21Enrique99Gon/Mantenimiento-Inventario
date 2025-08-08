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

const DevicesReport = () => {
  const [equipos, setEquipos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    codigo: "",
    descripcion: "",
    estado: "",
    ubicacion: "",
    categoria: "",
    tipo: ""
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      const recursos = await getRecursos();
      const dispositivos = recursos
        .filter(r => r.equipo)
        .map(r => ({
          codigoInventario: r.equipo.codigoInventario
            ? typeof r.equipo.codigoInventario === "object"
              ? r.equipo.codigoInventario.codigo || "N/A"
              : r.equipo.codigoInventario
            : "N/A",
          descripcion: r.equipo.descripcion,
          estado: r.estado?.descripcion || "Desconocido",
          ubicacion: r.equipo.ubicacion?.descripcion || "No disponible",
          categoria: r.equipo.categoria_equipo?.descripcion || "No especificado",
          tipo: r.equipo.tipoEquipo?.descripcion || "No especificado"
        }));

      setEquipos(dispositivos);
      setFiltered(dispositivos);
    } catch (error) {
      console.error("Error obteniendo equipos:", error);
    }
  };

  const exportToCSV = () => {
    const BOM = "\uFEFF"; 
    const header = "Código,Descripción,Estado,Ubicación,Categoría,Tipo de Equipo\n";
    const rows = filtered.map(e =>
      `${e.codigoInventario},"${e.descripcion}",${e.estado},"${e.ubicacion}","${e.categoria}","${e.tipo}"`
    );
    const csvContent = BOM + header + rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Reporte_Equipos.csv");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const result = equipos.filter(e => {
      return (
        e.codigoInventario.toLowerCase().includes(filters.codigo.toLowerCase()) &&
        e.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase()) &&
        e.estado.toLowerCase().includes(filters.estado.toLowerCase()) &&
        e.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase()) &&
        e.categoria.toLowerCase().includes(filters.categoria.toLowerCase()) &&
        e.tipo.toLowerCase().includes(filters.tipo.toLowerCase())
      );
    });
    setFiltered(result);
    setPage(0);
  }, [filters, equipos]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" mb={2} fontWeight="bold">
        Reporte de Equipos
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
            label="Filtrar por Categoría"
            variant="outlined"
            fullWidth
            name="categoria"
            value={filters.categoria}
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
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Tipo de Equipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((e, index) => (
                <TableRow key={index}>
                  <TableCell>{e.codigoInventario}</TableCell>
                  <TableCell>{e.descripcion}</TableCell>
                  <TableCell>{e.estado}</TableCell>
                  <TableCell>{e.ubicacion}</TableCell>
                  <TableCell>{e.categoria}</TableCell>
                  <TableCell>{e.tipo}</TableCell>
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

export default DevicesReport;