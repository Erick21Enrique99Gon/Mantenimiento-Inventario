import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Input,
  Paper,
  Stack,
} from "@mui/material";

const CsvImportTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setFile(null); // Limpia archivo al cambiar pestaña
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Función que simula envío a backend
  const uploadCsv = async (endpoint, file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir archivo");
      }

      alert("Archivo importado con éxito");
      setFile(null);
    } catch (error) {
      alert("Error al importar archivo: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!file) {
      alert("Por favor selecciona un archivo CSV.");
      return;
    }

    switch (tabIndex) {
      case 0:
        uploadCsv("/api/import/books", file);
        break;
      case 1:
        uploadCsv("/api/import/furniture", file);
        break;
      case 2:
        uploadCsv("/api/import/devices", file);
        break;
      default:
        break;
    }
  };

  const titles = ["Importar Libros desde CSV", "Importar Mobiliario desde CSV", "Importar Equipos desde CSV"];

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Tabs para importar CSV"
        centered
      >
        <Tab label="Libros" />
        <Tab label="Mobiliario" />
        <Tab label="Equipos" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          {titles[tabIndex]}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mt={2}>
          <Input
            type="file"
            inputProps={{ accept: ".csv" }}
            onChange={handleFileChange}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={!file || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Importando..." : "Importar"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CsvImportTabs;
