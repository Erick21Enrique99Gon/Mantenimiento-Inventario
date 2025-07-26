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

const FurnitureReport = () => {
  const [mobiliarios, setMobiliarios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
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
        }));
      setMobiliarios(muebles);
      setFiltered(muebles);
    } catch (error) {
      console.error("Error obteniendo mobiliarios:", error);
    }
  };

  const exportToCSV = () => {
    const BOM = "\uFEFF";
    const header = "Código,Descripción,Estado,Ubicación\n";
    const rows = mobiliarios.map(m =>
      `${m.codigoInventario},"${m.descripcion}",${m.estado},"${m.ubicacion}"`
    );
    const csvContent = BOM + header + rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Reporte_Mobiliario.csv");
  };


  useEffect(() => {
    const result = mobiliarios.filter(m =>
      m.descripcion.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, mobiliarios]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" mb={2} fontWeight="bold">
        Reporte de Mobiliario
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
              .map((m, index) => (
                <TableRow key={index}>
                  <TableCell>{m.codigoInventario}</TableCell> 
                  <TableCell>{m.descripcion}</TableCell>
                  <TableCell>{m.estado}</TableCell>
                  <TableCell>{m.ubicacion}</TableCell>
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

export default FurnitureReport;
