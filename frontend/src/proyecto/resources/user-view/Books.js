import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRecursos } from "../../../services/recursoService";
import { getEditoriales } from "../../../services/editorialService";
import { getCodigosLibro } from "../../../services/codigo_libroService";
import { getEstados } from "../../../services/estadoService";
import environment from "../../../config/environment";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [codigosLibro, setCodigosLibro] = useState([]);
  const [estados, setEstados] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [selectedEditorial, setSelectedEditorial] = useState("");
  const [selectedCodigo, setSelectedCodigo] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // 🔥 Cantidad de libros por página
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchBooks();
    fetchEditoriales();
    fetchCodigosLibro();
    fetchEstados();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getRecursos();
      const libros = data.filter((item) => item.libro);
      setBooks(libros);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchEditoriales = async () => {
    try {
      const data = await getEditoriales();
      setEditoriales(data);
    } catch (error) {
      console.error("Error fetching editorials:", error);
    }
  };

  const fetchCodigosLibro = async () => {
    try {
      const data = await getCodigosLibro();
      setCodigosLibro(data);
    } catch (error) {
      console.error("Error fetching book codes:", error);
    }
  };

  const fetchEstados = async () => {
    try {
      const data = await getEstados();
      setEstados(data);
    } catch (error) {
      console.error("Error fetching estados:", error);
    }
  };

  // ✅ Filtrar libros según los valores ingresados en los filtros
  const filteredBooks = books.filter(
    (book) =>
      book.libro.titulo.toLowerCase().includes(searchTitle.toLowerCase()) &&
      book.libro.autor.toLowerCase().includes(searchAuthor.toLowerCase()) &&
      (searchYear === "" || book.libro.anio?.toString().includes(searchYear)) &&
      (selectedEditorial === "" || book.libro.editorial?.editorialId === selectedEditorial) &&
      (selectedCodigo === "" || book.libro.codigoLibro?.codigoId === Number(selectedCodigo)) &&
      (selectedEstado === "" || book.libro.estado?.estadoId === selectedEstado)
  );

  // ✅ Calcular la cantidad de páginas correctamente
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // ✅ Obtener los elementos de la página actual
  const paginatedBooks = filteredBooks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // ✅ Resetear la paginación cuando se aplican filtros
  useEffect(() => {
    setPage(1);
  }, [searchTitle, searchAuthor, searchYear, selectedEditorial, selectedCodigo, selectedEstado]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Libros Disponibles
      </Typography>

      {/* Controles de Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Autor"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Año"
            variant="outlined"
            fullWidth
            type="number"
            onChange={(e) => setSearchYear(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Editorial</InputLabel>
            <Select value={selectedEditorial} onChange={(e) => setSelectedEditorial(e.target.value)}>
              <MenuItem value="">Todas</MenuItem>
              {editoriales.map((editorial) => (
                <MenuItem key={editorial.editorialId} value={editorial.editorialId}>
                  {editorial.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Código</InputLabel>
            <Select value={selectedCodigo} onChange={(e) => setSelectedCodigo(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {codigosLibro.map((codigo) => (
                <MenuItem key={codigo.codigoId} value={codigo.codigoId}>
                  {codigo.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select value={selectedEstado} onChange={(e) => setSelectedEstado(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {estados.map((estado) => (
                <MenuItem key={estado.estadoId} value={estado.estadoId}>
                  {estado.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tarjetas de Libros */}
      <Grid container spacing={3}>
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.recursoId}>
              <Card
                sx={{ borderRadius: 3, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6, cursor: "pointer", transform: "scale(1.03)" } }}
                onClick={() => navigate(`/resource/details/${book.recursoId}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={typeof book.imagen_recurso === "string" && book.imagen_recurso.startsWith("uploads/") ? `${environment.API_URL}/${book.imagen_recurso}` : book.imagen_recurso || ""}
                  alt={book.libro.titulo}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `${environment.API_URL}/uploads/recurso/portada.png`;
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {book.libro.titulo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Autor:</strong> {book.libro.autor || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Año:</strong> {book.libro.anio || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Editorial:</strong> {book.libro.editorial?.descripcion || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Código de Libro:</strong> {book.libro.codigoLibro?.descripcion || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Estado:</strong> {book.libro.estado?.descripcion || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 3, color: "gray" }}>No se encontraron resultados.</Typography>
        )}
      </Grid>

      {/* Paginación */}
      {totalPages > 1 && <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} /></Box>}
    </Box>
  );
};

export default Books;