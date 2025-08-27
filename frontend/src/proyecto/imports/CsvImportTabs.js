import React, { useState, useRef } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Input,
  Paper,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import {
  cargar
} from "../../services/importService.js";
const CsvImportTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null); // Guardar respuesta del backend
  const fileInputRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setFile(null);
    setResultados(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const uploadCsv = async (endpoint, file) => {
    setLoading(true);
    try {
      let response;
      response = await cargar(endpoint, file)
      // const formData = new FormData();
      // formData.append("file", file);

      // const response = await fetch(endpoint, {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error("Error al subir archivo");
      // }
      console.log(response.resultado)
      setResultados(response.resultado); // Guardamos exitosos y errores

      // Limpieza input
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

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

    const endpoints = [
      "/cargar-csv-libros",
      "/cargar-csv-mobiliario",
      "/cargar-csv-equipo",
    ];

    uploadCsv(endpoints[tabIndex], file);
  };

  const titles = [
    "Importar Libros desde CSV",
    "Importar Mobiliario desde CSV",
    "Importar Equipos desde CSV",
  ];

  const requiredTitles = {
  0: "TITULO; AUTOR; ISBN; EDITORIAL; Anio; EDICION; Numero; Codigo; UBICACION; RFID",
  1: "codigo de inventario; Tipo; Descripcion; TResp; Valor; Ubicacion; RFID",
  2: "codigo de inventario; Tipo; Descripcion; TResp; Valor; Ubicacion; RFID; Categoria de Equipo",
};

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 4 }}>
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
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
        <strong>Títulos necesarios CSV:</strong> {requiredTitles[tabIndex]}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          {titles[tabIndex]}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          mt={2}
        >
          <Input
            type="file"
            inputProps={{ accept: ".csv" }}
            onChange={handleFileChange}
            disabled={loading}
            inputRef={fileInputRef}
          />
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={!file || loading}
            sx={{ minWidth: 140 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Importando...
              </>
            ) : (
              "Importar"
            )}
          </Button>
        </Stack>

        {/* Resultados */}
        {resultados && (
          <Box mt={4}>
            {/* Éxitos */}
            {resultados.exitosos.length > 0 && (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Registros importados correctamente: {resultados.exitosos.length}
                </Alert>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {Object.keys(resultados.exitosos[0]).map((col, idx) => (
                        <TableCell key={idx}>{col}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultados.exitosos.map((row, idx) => (
                      <TableRow key={idx}>
                        {Object.values(row).map((val, i) => (
                          <TableCell key={i}>{val}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            {/* Errores */}
            {resultados.errores.length > 0 && (
              <>
                <Alert severity="error" sx={{ mt: 4, mb: 2 }}>
                  Registros con errores: {resultados.errores.length}
                </Alert>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fila</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell>Error</TableCell>
                      {/* Cabeceras dinámicas */}
                      {(() => {
                        const campos = ["datos", "data", "elemento"];
                        const primerErrorConDatos = resultados.errores.find(err =>
                          campos.some(campo => err[campo] && Object.keys(err[campo]).length > 0)
                        );
                        if (!primerErrorConDatos) return null;

                        const campoUsado = campos.find(campo => primerErrorConDatos[campo]);
                        return Object.keys(primerErrorConDatos[campoUsado]).map((col, idx) => (
                          <TableCell key={idx}>{col}</TableCell>
                        ));
                      })()}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultados.errores.map((err, idx) => {
                      const campos = ["datos", "data", "elemento"];
                      const campoUsado = campos.find(campo => err[campo] !== undefined);
                      const datosFila = err[campoUsado] || {};
                      const columnas = Object.values(datosFila);

                      return (
                        <TableRow key={idx}>
                          <TableCell>{err.fila}</TableCell>
                          <TableCell>{err.codigo}</TableCell>
                          <TableCell>{err.error}</TableCell>
                          {columnas.length > 0
                            ? columnas.map((val, i) => <TableCell key={i}>{val || "—"}</TableCell>)
                            : null}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CsvImportTabs;