import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Button, Typography, Box, TablePagination,
} from "@mui/material";
import { getPrestamos } from "../../services/prestamoService";
import { getDetallesPrestamo } from "../../services/detalle_prestamoService";
import { getHistoriales } from "../../services/historialService";
import { getRecursos } from "../../services/recursoService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import environment from "../../config/environment";

const LoansReports = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      const [prestamosData, detallesPrestamoData, historialesData, recursosData] = await Promise.all([
        getPrestamos(),
        getDetallesPrestamo(),
        getHistoriales(),
        getRecursos(),
      ]);

      const prestamosFinales = prestamosData.map(prestamo => {
        const detalle = detallesPrestamoData.find(d => d.prestamo?.prestamoId === prestamo.prestamoId) || {};
        const historial = historialesData.find(h => h.prestamo?.prestamoId === prestamo.prestamoId);

        const prestario = historial?.usuario_prestario || {};
        const prestamista = historial?.usuario_prestamista || {};

        const recursoCompleto = recursosData.find(r => r.recursoId === detalle.recurso?.recursoId) || {};

        let recursoDescripcion = "Sin descripción";
        if (recursoCompleto.libro) {
          recursoDescripcion = `Libro: ${recursoCompleto.libro.titulo} - ${recursoCompleto.libro.autor}`;
        } else if (recursoCompleto.mobiliario) {
          recursoDescripcion = `Mobiliario: ${recursoCompleto.mobiliario.descripcion}`;
        } else if (recursoCompleto.equipo) {
          recursoDescripcion = `Equipo: ${recursoCompleto.equipo.descripcion}`;
        }

        return {
          id: prestamo.prestamoId,
          prestario,
          prestamista,
          recurso: {
            descripcion: recursoDescripcion,
            ubicacion: recursoCompleto.libro?.ubicacion?.descripcion ||
                       recursoCompleto.mobiliario?.ubicacion?.descripcion ||
                       recursoCompleto.equipo?.ubicacion?.descripcion || "Ubicación no disponible",
          },
          observacion: prestamo.observacion,
          estado: prestamo.estado?.descripcion || "Desconocido",
          imagenPrestamo: historial?.imagen_prestamo || null,
          imagenDevolucion: historial?.imagen_devolucion || null,
          fechaPrestamo: historial?.fecha_prestamo || "No registrada",
          fechaDevolucion: historial?.fecha_devolucion || "No registrada",
        };
      });

      setPrestamos(prestamosFinales);
    } catch (error) {
      console.error("❌ Error obteniendo préstamos combinados:", error);
      setPrestamos([]);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(prestamos.map(p => ({
      ID: p.id,
      "Prestario": `${p.prestario.nombres} ${p.prestario.apellidos}`,
      "DPI Prestario": p.prestario.dpi,
      "Prestamista": `${p.prestamista.nombres} ${p.prestamista.apellidos}`,
      "DPI Prestamista": p.prestamista.dpi,
      Recurso: p.recurso.descripcion,
      Ubicación: p.recurso.ubicacion,
      Estado: p.estado,
      "Fecha Préstamo": p.fechaPrestamo,
      "Fecha Devolución": p.fechaDevolucion,
      "Imagen Préstamo": p.imagenPrestamo || "No disponible",
      "Imagen Devolución": p.imagenDevolucion || "No disponible",
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Préstamos");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "Prestamos_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Préstamos", 14, 10);

    const tableData = prestamos.map(p => [
      p.id,
      `${p.prestario.nombres} ${p.prestario.apellidos}`,
      p.prestario.dpi,
      `${p.prestamista.nombres} ${p.prestamista.apellidos}`,
      p.prestamista.dpi,
      p.recurso.descripcion,
      p.recurso.ubicacion,
      p.estado,
      p.fechaPrestamo,
      p.fechaDevolucion
    ]);

    autoTable(doc, {
      head: [["ID", "Prestario", "DPI Prestario", "Prestamista", "DPI Prestamista", "Recurso", "Ubicación", "Estado", "Fecha Préstamo", "Fecha Devolución"]],
      body: tableData,
      startY: 20,
      styles: { fontSize: 7 }
    });

    doc.save("Prestamos_Report.pdf");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Reporte de Préstamos
      </Typography>

      <TextField label="Buscar préstamo" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(e) => setSearch(e.target.value)} />

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 1300 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Prestario</TableCell>
            <TableCell>DPI Prestario</TableCell>
            <TableCell>Prestamista</TableCell>
            <TableCell>DPI Prestamista</TableCell>
            <TableCell>Recurso</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha Préstamo</TableCell>
            <TableCell>Fecha Devolución</TableCell>
            <TableCell>Imagen Préstamo</TableCell>
            <TableCell>Imagen Devolución</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prestamos
            .filter(p => p.prestario?.nombres?.toLowerCase().includes(search.toLowerCase()))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(p => (
              <TableRow key={p.id}>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.prestario.nombres} {p.prestario.apellidos}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.prestario.dpi}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.prestamista.nombres} {p.prestamista.apellidos}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.prestamista.dpi}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.recurso.descripcion}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.recurso.ubicacion}</TableCell>
                <TableCell>{p.estado}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.fechaPrestamo}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{p.fechaDevolucion}</TableCell>
                <TableCell>
                  {p.imagenPrestamo ? (
                    <img src={`${environment.API_URL}/${p.imagenPrestamo}`} alt="Prestamo" width="50" />
                  ) : "No disponible"}
                </TableCell>
                <TableCell>
                  {p.imagenDevolucion ? (
                    <img src={`${environment.API_URL}/${p.imagenDevolucion}`} alt="Devolucion" width="50" />
                  ) : "No disponible"}
                </TableCell>
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
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      />

      <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={exportToExcel}>
        Exportar a Excel
      </Button>
      <Button variant="contained" color="secondary" onClick={exportToPDF}>
        Exportar a PDF
      </Button>
    </Box>
  );
};

export default LoansReports;