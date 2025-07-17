import React from "react";
import { Box, Typography, Container } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

const Home = () => (
  <PageContainer title="Inicio" description="Página de inicio">
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Typography variant="h2" sx={{ mb: 2 }}>
          DTT Tutor de Infraestructura
        </Typography>

        {/* 🔹 Misión */}
        <Box sx={{ textAlign: "left", width: "100%", mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Misión
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Optimizar la infraestructura del laboratorio ECYS 013-014 y laboratorios de la India para 
            crear un entorno tecnológico moderno y eficiente que fomente la investigación, el 
            aprendizaje y el desarrollo de soluciones informáticas avanzadas.
          </Typography>
        </Box>

        {/* 🔹 Visión */}
        <Box sx={{ textAlign: "left", width: "100%", mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Visión
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Ser un referente en la modernización y gestión eficiente de laboratorios tecnológicos, 
            proporcionando un ambiente óptimo para la innovación, el desarrollo profesional y la 
            colaboración académica.
          </Typography>
        </Box>

        {/* 🔹 Objetivos */}
        <Box sx={{ textAlign: "left", width: "100%", mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Objetivos
          </Typography>
          <ul style={{ textAlign: "left", color: "#666" }}>
            <li>
              Contribuir al óptimo funcionamiento de los laboratorios 013 y 014 mediante supervisión, 
              mantenimiento y proyectos adicionales.
            </li>
            <li>
              Modernizar y renovar los equipos existentes para garantizar un rendimiento óptimo y 
              una mayor capacidad de procesamiento.
            </li>
            <li>
              Implementar herramientas y recursos tecnológicos que fomenten la colaboración remota 
              y la participación de expertos en proyectos de investigación.
            </li>
          </ul>
        </Box>

        {/* 🔹 Inventario Disponible */}
        <Box sx={{ textAlign: "left", width: "100%", mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Inventario Disponible
          </Typography>

          {/* 📚 Libros */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
            📚 Libros
          </Typography>
          <Typography variant="body1" color="textSecondary">
            La biblioteca del laboratorio cuenta con una gran variedad de libros especializados en 
            programación, bases de datos, metodologías de desarrollo y diseño de sistemas. Algunos de 
            los títulos disponibles incluyen *Métodos Orientados a Objetos*, *Fundamentos de Bases de Datos* 
            y *Introducción al Diseño de Sistemas*.
          </Typography>

          {/* 🏢 Mobiliario */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
            🏢 Mobiliario
          </Typography>
          <Typography variant="body1" color="textSecondary">
            El inventario incluye escritorios, sillas ergonómicas, pizarras y equipos auxiliares para 
            facilitar el aprendizaje y el trabajo en los laboratorios. Además, se dispone de banderas 
            institucionales y equipamiento adicional para eventos académicos.
          </Typography>

          {/* 🖥️ Equipos Tecnológicos */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
            🖥️ Equipos Tecnológicos
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Los laboratorios están equipados con computadoras de alto rendimiento, servidores para pruebas 
            y simulaciones, y dispositivos de red que permiten la conexión eficiente de los sistemas.
          </Typography>
        </Box>
      </Box>
    </Container>
  </PageContainer>
);

export default Home;