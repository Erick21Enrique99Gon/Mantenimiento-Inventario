import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecursos } from "../../../services/recursoService";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import environment from "../../../config/environment";

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResource();
  }, []);

  const fetchResource = async () => {
    try {
      const data = await getRecursos();
      const foundResource = data.find((item) => item.recursoId === parseInt(id));
      setResource(foundResource);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching resource details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>Cargando detalles...</Typography>;
  }

  if (!resource) {
    return <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>Recurso no encontrado.</Typography>;
  }

  // Determinar el tipo de recurso
  const { libro, equipo, mobiliario, imagen_recurso, estado } = resource;
  let resourceDetails;

  if (libro) {
    resourceDetails = (
      <>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>{libro.titulo}</Typography>
        <Typography variant="body1"><strong>Autor:</strong> {libro.autor}</Typography>
        <Typography variant="body1"><strong>Año:</strong> {libro.anio}</Typography>
        <Typography variant="body1"><strong>Edición:</strong> {libro.edicion}</Typography>
        <Typography variant="body1"><strong>ISBN:</strong> {libro.isbn}</Typography>
        <Typography variant="body1"><strong>Número:</strong> {libro.numero}</Typography>
        <Typography variant="body1"><strong>Código:</strong> {libro.codigoLibro?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>Editorial:</strong> {libro.editorial?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>Ubicación:</strong> {libro.ubicacion?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>RFID:</strong> {libro.rfid?.rfid || "No asignado"}</Typography>
      </>
    );
  } else if (equipo) {
    resourceDetails = (
      <>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>{equipo.descripcion}</Typography>
        <Typography variant="body1"><strong>TRESP:</strong> {equipo.tresp}</Typography>
        <Typography variant="body1"><strong>Valor:</strong> {equipo.valor}</Typography>
        <Typography variant="body1"><strong>Código Inventario:</strong> {equipo.codigoInventario?.codigo || "N/A"}</Typography>
        <Typography variant="body1"><strong>Categoría:</strong> {equipo.categoria_equipo?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>Tipo de Equipo:</strong> {equipo.tipoEquipo?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>Ubicación:</strong> {equipo.ubicacion?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>RFID:</strong> {equipo.rfid?.rfid || "No asignado"}</Typography>
      </>
    );
  } else if (mobiliario) {
    resourceDetails = (
      <>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>{mobiliario.descripcion}</Typography>
        <Typography variant="body1"><strong>TRESP:</strong> {mobiliario.tresp}</Typography>
        <Typography variant="body1"><strong>Valor:</strong> {mobiliario.valor}</Typography>
        <Typography variant="body1"><strong>Código Inventario:</strong> {mobiliario.codigoInventario?.codigo || "N/A"}</Typography>
        <Typography variant="body1"><strong>Tipo de Mobiliario:</strong> {mobiliario.tipoMobiliario?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>Ubicación:</strong> {mobiliario.ubicacion?.descripcion || "N/A"}</Typography>
        <Typography variant="body1"><strong>RFID:</strong> {mobiliario.rfid?.rfid || "No asignado"}</Typography>
      </>
    );
  } else {
    resourceDetails = <Typography variant="body1">No hay detalles disponibles para este recurso.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        variant="contained" 
        startIcon={<ArrowBackIcon />} 
        sx={{ mb: 2 }} 
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>

      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="300"
              image={`${environment.API_URL}/${imagen_recurso}`}
              alt="Imagen del recurso"
              sx={{ objectFit: "cover", borderRadius: 2 }}
              onError={(e) => {
                e.target.src = `${environment.API_URL}/uploads/recurso/Recur.png`;
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              {resourceDetails}
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Estado:</strong> {estado?.descripcion || "N/A"}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ResourceDetails;