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
import { getTiposMobiliario } from "../../../services/tipo_mobiliarioService";
import { getEstados } from "../../../services/estadoService";
import environment from "../../../config/environment";

const Furniture = () => {
  const [furniture, setFurniture] = useState([]);
  const [types, setTypes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [codigoInventario, setCodigoInventario] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchFurniture();
    fetchTypes();
    fetchEstados();
  }, []);

  const fetchFurniture = async () => {
    try {
      const data = await getRecursos();
      const mobiliario = data.filter((item) => item.mobiliario);
      setFurniture(mobiliario);
    } catch (error) {
      console.error("Error fetching furniture:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await getTiposMobiliario();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching furniture types:", error);
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

  // ✅ Filtrar mobiliario según los valores ingresados en los filtros
  const filteredFurniture = furniture.filter(
    (item) =>
      item.mobiliario.descripcion.toLowerCase().includes(search.toLowerCase()) &&
      (selectedType === "" || item.mobiliario.tipoMobiliario?.tipoMobiliarioId === selectedType) &&
      (selectedEstado === "" || item.mobiliario.estado?.estadoId === selectedEstado) &&
      (codigoInventario === "" || (item.mobiliario.codigoInventario?.codigo || "").toString().includes(codigoInventario))
  );

  // ✅ Calcular la cantidad de páginas correctamente
  const totalPages = Math.ceil(filteredFurniture.length / itemsPerPage);

  // ✅ Obtener los elementos de la página actual
  const paginatedFurniture = filteredFurniture.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // ✅ Resetear la paginación cuando se aplican filtros
  useEffect(() => {
    setPage(1);
  }, [search, selectedType, selectedEstado, codigoInventario]);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Mobiliario Disponible
      </Typography>

      {/* Controles de Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Buscar mobiliario"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Mobiliario</InputLabel>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {types.map((type) => (
                <MenuItem key={type.tipoMobiliarioId} value={type.tipoMobiliarioId}>
                  {type.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
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
        <Grid item xs={12} sm={3}>
          <TextField
            label="Código de Inventario"
            variant="outlined"
            fullWidth
            onChange={(e) => setCodigoInventario(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Tarjetas de Mobiliario */}
      <Grid container spacing={3}>
        {paginatedFurniture.length > 0 ? (
          paginatedFurniture.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.recursoId}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, cursor: "pointer", transform: "scale(1.03)" },
                }}
                onClick={() => navigate(`/resource/details/${item.recursoId}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={typeof item.imagen_recurso === "string" && item.imagen_recurso.startsWith("uploads/") ? `${environment.API_URL}/${item.imagen_recurso}` : item.imagen_recurso || ""}
                  alt={item.mobiliario.descripcion}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `${environment.API_URL}/uploads/recurso/mobiliario.jpg`;
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>{item.mobiliario.descripcion}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}><strong>Tipo Mobiliario:</strong> {item.mobiliario.tipoMobiliario?.descripcion || "N/A"}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}><strong>Código de Inventario:</strong> {item.mobiliario.codigoInventario?.codigo || "N/A"}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}><strong>Estado:</strong> {item.mobiliario.estado?.descripcion || "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: "center", mt: 3, color: "gray" }}>No se encontraron resultados.</Typography>
          </Grid>
        )}
      </Grid>

      {/* Paginación */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" size="large" />
        </Box>
      )}
    </Box>
  );
};

export default Furniture;