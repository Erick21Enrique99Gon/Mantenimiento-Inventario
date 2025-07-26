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
  TextField
} from "@mui/material";
import { getRecursos } from "../../services/recursoService";
import { saveAs } from "file-saver";

const DevicesReport = () => {
  const [equipos, setEquipos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
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
    }));

      setEquipos(dispositivos);
      setFiltered(dispositivos);
    } catch (error) {
      console.error("Error obteniendo equipos:", error);
    }
  };

  const exportToCSV = () => {
    const BOM = "\uFEFF"; 
    const header = "Código,Descripción,Estado,Ubicación\n";
    const rows = equipos.map(e =>
      `${e.codigoInventario},"${e.descripcion}",${e.estado},"${e.ubicacion}"`
    );
    const csvContent = BOM + header + rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Reporte_Equipos.csv");
  };


  useEffect(() => {
    const result = equipos.filter(e =>
      e.descripcion.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, equipos]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" mb={2} fontWeight="bold">
        Reporte de Equipos
      </Typography>

      <TextField
        label="Buscar por descripción"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onChange={e => setSearch(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Ubicación</TableCell>
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
        onRowsPerPageChange={e => setRowsPerPage(parseInt(e.target.value, 10))}
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
