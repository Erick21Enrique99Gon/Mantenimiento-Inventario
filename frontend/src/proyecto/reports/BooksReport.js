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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { getRecursos } from "../../services/recursoService";
import { getEditoriales } from "../../services/editorialService";
import { getCodigosLibro } from "../../services/codigo_libroService";
import { getEstados } from "../../services/estadoService";
import { saveAs } from "file-saver";

const BooksReport = () => {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Filtros
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [selectedEditorial, setSelectedEditorial] = useState("");
  const [selectedCodigo, setSelectedCodigo] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");

  // Datos para filtros desplegables
  const [editoriales, setEditoriales] = useState([]);
  const [codigosLibro, setCodigosLibro] = useState([]);
  const [estados, setEstados] = useState([]);

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Carga inicial
  useEffect(() => {
    fetchBooks();
    fetchEditoriales();
    fetchCodigosLibro();
    fetchEstados();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getRecursos();
      const libros = data.filter((item) => item.libro).map(item => ({
        recursoId: item.recursoId,
        titulo: item.libro.titulo,
        autor: item.libro.autor,
        anio: item.libro.anio,
        editorial: item.libro.editorial?.descripcion || "N/A",
        codigoLibro: item.libro.codigoLibro?.descripcion || "N/A",
        estado: item.libro.estado?.descripcion || "Desconocido",
      }));
      setBooks(libros);
      setFiltered(libros);
    } catch (error) {
      console.error("Error obteniendo libros:", error);
    }
  };

  const fetchEditoriales = async () => {
    try {
      const data = await getEditoriales();
      setEditoriales(data);
    } catch (error) {
      console.error("Error obteniendo editoriales:", error);
    }
  };

  const fetchCodigosLibro = async () => {
    try {
      const data = await getCodigosLibro();
      setCodigosLibro(data);
    } catch (error) {
      console.error("Error obteniendo códigos de libro:", error);
    }
  };

  const fetchEstados = async () => {
    try {
      const data = await getEstados();
      setEstados(data);
    } catch (error) {
      console.error("Error obteniendo estados:", error);
    }
  };

  // Filtrado
  useEffect(() => {
    const filteredBooks = books.filter(book => {
      return (
        book.titulo.toLowerCase().includes(searchTitle.toLowerCase()) &&
        book.autor.toLowerCase().includes(searchAuthor.toLowerCase()) &&
        (searchYear === "" || (book.anio?.toString() || "").includes(searchYear)) &&
        (selectedEditorial === "" || book.editorial === selectedEditorial) &&
        (selectedCodigo === "" || book.codigoLibro === selectedCodigo) &&
        (selectedEstado === "" || book.estado === selectedEstado)
      );
    });
    setFiltered(filteredBooks);
    setPage(0); 
  }, [searchTitle, searchAuthor, searchYear, selectedEditorial, selectedCodigo, selectedEstado, books]);

  const exportToCSV = () => {
    const BOM = "\uFEFF";
    const header = "Título,Autor,Año,Editorial,Código Libro,Estado\n";
    const rows = filtered.map(b =>
      `"${b.titulo}","${b.autor}","${b.anio || ''}","${b.editorial}","${b.codigoLibro}","${b.estado}"`
    );
    const csvContent = BOM + header + rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Reporte_Libros.csv");
  };

  // Paginación slice
  const paginatedBooks = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" mb={2} fontWeight="bold">
        Reporte de Libros
      </Typography>

      {/* Filtros */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          justifyContent: "center"
        }}
      >
        <TextField
          label="Buscar título"
          variant="outlined"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          size="small"
        />
        <TextField
          label="Buscar autor"
          variant="outlined"
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
          size="small"
        />
        <TextField
          label="Año"
          variant="outlined"
          type="number"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          size="small"
          sx={{ maxWidth: 100 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Editorial</InputLabel>
          <Select
            value={selectedEditorial}
            onChange={(e) => setSelectedEditorial(e.target.value)}
            label="Editorial"
          >
            <MenuItem value="">Todas</MenuItem>
            {editoriales.map((e) => (
              <MenuItem key={e.editorialId} value={e.descripcion}>
                {e.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Código Libro</InputLabel>
          <Select
            value={selectedCodigo}
            onChange={(e) => setSelectedCodigo(e.target.value)}
            label="Código Libro"
          >
            <MenuItem value="">Todos</MenuItem>
            {codigosLibro.map((c) => (
              <MenuItem key={c.codigoId} value={c.descripcion}>
                {c.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            label="Estado"
          >
            <MenuItem value="">Todos</MenuItem>
            {estados.map((e) => (
              <MenuItem key={e.estadoId} value={e.descripcion}>
                {e.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Editorial</TableCell>
              <TableCell>Código Libro</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((b, i) => (
                <TableRow key={i}>
                  <TableCell>{b.titulo}</TableCell>
                  <TableCell>{b.autor}</TableCell>
                  <TableCell>{b.anio || "N/A"}</TableCell>
                  <TableCell>{b.editorial}</TableCell>
                  <TableCell>{b.codigoLibro}</TableCell>
                  <TableCell>{b.estado}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        rowsPerPageOptions={[5, 10, 15]}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Botón exportar */}
      <Box mt={2} textAlign="center">
        <Button variant="contained" onClick={exportToCSV}>
          Exportar a CSV
        </Button>
      </Box>
    </Box>
  );
};

export default BooksReport;
