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
import { getCategoriasEquipo } from "../../../services/categoria_equipoService";
import { getTiposEquipo } from "../../../services/tipo_equipoService";
import { getEstados } from "../../../services/estadoService";
import environment from "../../../config/environment";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [codigoInventario, setCodigoInventario] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevices();
    fetchCategories();
    fetchTypes();
    fetchEstados();
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await getRecursos();
      const equipos = data.filter((item) => item.equipo);
      setDevices(equipos);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategoriasEquipo();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await getTiposEquipo();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
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

  const filteredDevices = devices.filter(
    (device) =>
      device.equipo.descripcion.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || device.equipo.categoria_equipo?.categoria_equipoId === selectedCategory) &&
      (selectedType === "" || device.equipo.tipoEquipo?.tipoEquipoId === selectedType) &&
      (selectedEstado === "" || device.equipo.estado?.estadoId === selectedEstado) &&
      (codigoInventario === "" || (device.equipo.codigoInventario?.codigo || "").toString().includes(codigoInventario))
  );

  // ✅ Calcular la cantidad de páginas correctamente
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

  // ✅ Obtener los elementos de la página actual
  const paginatedDevices = filteredDevices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // ✅ Resetear la paginación cuando se aplican filtros
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedType, selectedEstado, codigoInventario]);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Equipos Disponibles
      </Typography>

      {/* Controles de Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Buscar equipo"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <MenuItem value="">Todas</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.categoria_equipoId} value={category.categoria_equipoId}>
                  {category.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Equipo</InputLabel>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {types.map((type) => (
                <MenuItem key={type.tipoEquipoId} value={type.tipoEquipoId}>
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
            label="Código Inventario"
            variant="outlined"
            fullWidth
            onChange={(e) => setCodigoInventario(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Tarjetas de Equipos */}
      <Grid container spacing={3}>
        {paginatedDevices.length > 0 ? (
          paginatedDevices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.recursoId}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, cursor: "pointer", transform: "scale(1.03)" },
                }}
                onClick={() => navigate(`/resource/details/${device.recursoId}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`${environment.API_URL}/${device.imagen_recurso}`}
                  alt={device.equipo.descripcion}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `${environment.API_URL}/uploads/recurso/equipo.jpg`;
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {device.equipo.descripcion}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Categoría:</strong> {device.equipo.categoria_equipo?.descripcion || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Tipo de Equipo:</strong> {device.equipo.tipoEquipo?.descripcion || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Código Inventario:</strong> {device.equipo.codigoInventario?.codigo || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Estado:</strong> {device.equipo.estado?.descripcion || "N/A"}
                  </Typography>      
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 3, color: "gray" }}>
            No se encontraron resultados.
          </Typography>
        )}
      </Grid>

      {/* ✅ Paginación */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} />
        </Box>
      )}
    </Box>
  );
};

export default Devices;