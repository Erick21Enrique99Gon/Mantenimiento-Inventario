import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import { getUsuarios } from "../../services/usuarioService";
import { getRecursos } from "../../services/recursoService";
import { getPrestamos } from "../../services/prestamoService";
import { realizarPrestamo } from "../../services/procedimientoService";
import { getDetallesPrestamo } from "../../services/detalle_prestamoService";
import { getHistoriales } from "../../services/historialService";
import { getCurrentUser } from "../../services/authService";

const Loan = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [searchUsuario, setSearchUsuario] = useState("");
  const [searchRecurso, setSearchRecurso] = useState("");
  const [searchPrestamo, setSearchPrestamo] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedRecurso, setSelectedRecurso] = useState(null);
  const [observacion, setObservacion] = useState("");
  const [imagen, setImagen] = useState(null);
  // Estados para la paginación
  const [pageUsuarios, setPageUsuarios] = useState(0);
  const [rowsPerPageUsuarios, setRowsPerPageUsuarios] = useState(5);

  const [pageRecursos, setPageRecursos] = useState(0);
  const [rowsPerPageRecursos, setRowsPerPageRecursos] = useState(5);

  const [pagePrestamos, setPagePrestamos] = useState(0);
  const [rowsPerPagePrestamos, setRowsPerPagePrestamos] = useState(5);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getCurrentUser();
        const user = response?.usuario;
        if (!user) throw new Error("No se encontró el objeto usuario en la respuesta.");
        console.log("👤 Usuario logueado desde API:", user);
        setUsuarioLogueado(user);
        await fetchUsuarios();
        await fetchRecursos();
        await fetchPrestamos();
      } catch (error) {
        console.error("❌ Error inicializando componente:", error);
      }
    };
    init();
  }, []);
  

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data || []); // ✅ Evitar `undefined`
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      setUsuarios([]);
    }
  };

  const fetchRecursos = async () => {
    try {
      const data = await getRecursos();
      if (!Array.isArray(data)) {
        console.error("❌ La respuesta de recursos no es un array:", data);
        return;
      }

      // Filtrar solo recursos con RFID asignado y estado "Disponible"
      const disponiblesConRFID = data.filter((recurso) => {
        const estadoDescripcion = recurso.estado?.descripcion?.toLowerCase() || "";
        const tieneRFID =
          recurso.libro?.rfid?.rfid ||
          recurso.equipo?.rfid?.rfid ||
          recurso.mobiliario?.rfid?.rfid;

        return estadoDescripcion === "disponible" && tieneRFID;
      });

      setRecursos(disponiblesConRFID);
    } catch (error) {
      console.error("❌ Error obteniendo recursos:", error);
      setRecursos([]);
    }
  };

  const fetchPrestamos = async () => {
    try {
      // Ejecutamos todas las solicitudes simultáneamente
      const [prestamosData, detallesPrestamoData, historialesData, recursosData] = await Promise.all([
        getPrestamos(), // Obtiene los préstamos básicos
        getDetallesPrestamo(), // Obtiene los detalles (recurso asignado)
        getHistoriales(), // Obtiene la relación con usuario
        getRecursos() // Obtiene detalles de los recursos
      ]);
  
      if (!Array.isArray(prestamosData) || !Array.isArray(detallesPrestamoData) || !Array.isArray(historialesData) || !Array.isArray(recursosData)) {
        console.error("❌ Error: Alguna de las respuestas no es un array.");
        return;
      }
  
      // Filtrar préstamos activos
      const prestamosActivos = prestamosData.filter(p => p.estado?.descripcion === "Activo");
  
      // Estructurar datos combinando los cuatro endpoints
      const prestamosFinales = prestamosActivos.map(prestamo => {
        // Buscar detalle de préstamo relacionado
        const detalle = detallesPrestamoData.find(d => d.prestamo?.prestamoId === prestamo.prestamoId) || {};
        
        // Buscar historial con estructura completa
        const historial = historialesData.find(h => h.prestamo?.prestamoId === prestamo.prestamoId);

        const prestario = historial?.usuario_prestario || {};
        const prestamista = historial?.usuario_prestamista || {};
  
        // Buscar el recurso completo
        const recursoCompleto = recursosData.find(r => r.recursoId === detalle.recurso?.recursoId) || {};
  
        // Determinar el tipo de recurso y extraer la información relevante
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
          observacion: prestamo.observacion,
          prestario: {
            nombres: prestario.nombres || "Desconocido",
            apellidos: prestario.apellidos || "",
          },
          prestamista: {
            nombres: prestamista.nombres || "Desconocido",
            apellidos: prestamista.apellidos || "",
          },
          recurso: {
            recursoId: recursoCompleto.recursoId || "N/A",
            descripcion: recursoDescripcion,
            ubicacion: recursoCompleto.libro?.ubicacion?.descripcion ||
                       recursoCompleto.mobiliario?.ubicacion?.descripcion ||
                       recursoCompleto.equipo?.ubicacion?.descripcion || "Ubicación no disponible",
            estado: recursoCompleto.estado?.descripcion || "Desconocido",
          },
        };
      });
  
      setPrestamos(prestamosFinales);
    } catch (error) {
      console.error("❌ Error obteniendo préstamos combinados:", error);
      setPrestamos([]);
    }
  };

  const handleImageChange = (event) => {
    setImagen(event.target.files[0] || null);
  };

  const handlePrestamo = async () => {
    if (!selectedUsuario || !selectedRecurso || !usuarioLogueado) {
      alert("Debe seleccionar un usuario, un recurso y estar logueado");
      return;
    }
  
    if (!observacion.trim()) {
      alert("Debe ingresar una observación");
      return;
    }
  
    const prestamoPayload = {
      recursoId: selectedRecurso.recursoId,
      usuarioPrestarioId: selectedUsuario.usuarioId,
      usuarioPrestamistaId: usuarioLogueado.usuarioId,
      observacion: observacion.trim(),
    };
  
    try {
      await realizarPrestamo(prestamoPayload, imagen);
      alert("✅ Préstamo realizado exitosamente");
      setObservacion("");
      setImagen(null);
      await fetchRecursos();
      await fetchPrestamos();
    } catch (error) {
      console.error("❌ Error al realizar el préstamo:", error);
      alert("❌ Error al realizar el préstamo: " + (error?.message || "Error inesperado"));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Gestión de Préstamos
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
        {/* Tabla de Usuarios */}
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Buscar usuario"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchUsuario(e.target.value)}
          />
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Carnet</TableCell>
                  <TableCell>DPI</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios
                  .filter((user) => (user.nombres || "").toLowerCase().includes(searchUsuario.toLowerCase()))
                  .slice(pageUsuarios * rowsPerPageUsuarios, pageUsuarios * rowsPerPageUsuarios + rowsPerPageUsuarios)
                  .map((user) => (
                    <TableRow
                      key={user.usuarioId}
                      onClick={() => setSelectedUsuario(user)}
                      sx={{ cursor: "pointer", backgroundColor: selectedUsuario?.usuarioId === user.usuarioId ? "#f0f0f0" : "" }}
                    >
                      <TableCell>{user.nombres} {user.apellidos}</TableCell>
                      <TableCell>{user.carnet}</TableCell>
                      <TableCell>{user.dpi}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={usuarios.length}
            rowsPerPage={rowsPerPageUsuarios}
            page={pageUsuarios}
            onPageChange={(event, newPage) => setPageUsuarios(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPageUsuarios(parseInt(event.target.value, 10));
              setPageUsuarios(0);
            }}
          />
        </Box>

        {/* Tabla de Recursos */}
        <Box sx={{ flex: 1 }}>
        <TextField
            label="Buscar recurso o RFID"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchRecurso(e.target.value)}
          />
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descripción</TableCell>
                  <TableCell>RFID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recursos
                  .filter((recurso) => {
                    const texto = searchRecurso.toLowerCase();
                    return (
                      (recurso.libro?.titulo || recurso.equipo?.descripcion || recurso.mobiliario?.descripcion || "").toLowerCase().includes(texto) ||
                      (recurso.libro?.rfid?.rfid || recurso.equipo?.rfid?.rfid || recurso.mobiliario?.rfid?.rfid || "").includes(texto)
                    );
                  })
                  .slice(pageRecursos * rowsPerPageRecursos, pageRecursos * rowsPerPageRecursos + rowsPerPageRecursos)
                  .map((recurso) => (
                    <TableRow
                      key={recurso.recursoId}
                      onClick={() => setSelectedRecurso(recurso)}
                      sx={{ cursor: "pointer", backgroundColor: selectedRecurso?.recursoId === recurso.recursoId ? "#f0f0f0" : "" }}
                    >
                      <TableCell>{recurso.libro?.titulo || recurso.equipo?.descripcion || recurso.mobiliario?.descripcion || "Sin descripción"}</TableCell>
                      <TableCell>{recurso.libro?.rfid?.rfid || recurso.equipo?.rfid?.rfid || recurso.mobiliario?.rfid?.rfid || "N/A"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={recursos.length}
            rowsPerPage={rowsPerPageRecursos}
            page={pageRecursos}
            onPageChange={(event, newPage) => setPageRecursos(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPageRecursos(parseInt(event.target.value, 10));
              setPageRecursos(0);
            }}
          />
        </Box>
      </Box>

      {/* Observación y Carga de Imagen */}
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Observación"
          variant="outlined"
          fullWidth
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Subir Imagen
          <input type="file" hidden onChange={handleImageChange} accept="image/*" />
        </Button>
        {imagen && <Typography sx={{ mt: 1 }}>Imagen seleccionada: {imagen.name}</Typography>}
      </Box>
      {usuarioLogueado ? (
        <Typography sx={{ mt: 2 }}>
          <strong>Usuario logueado (Prestamista):</strong> {usuarioLogueado.nombres} {usuarioLogueado.apellidos}
        </Typography>
      ) : (
        <Typography sx={{ mt: 2, color: "red" }}>
          ⚠️ No se pudo obtener al usuario logueado. Verifique la sesión o autenticación.
        </Typography>
      )}
      <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth onClick={handlePrestamo}>
        Realizar Préstamo
      </Button>

      {/* Tabla de Préstamos Activos */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Préstamos Activos</Typography>
        <TextField label="Buscar préstamo" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(e) => setSearchPrestamo(e.target.value)} />
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Préstamo</TableCell>
              <TableCell>Prestario</TableCell>
              <TableCell>Prestamista</TableCell>
              <TableCell>Recurso</TableCell>
              <TableCell>Ubicacion</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamos
              .filter((p) => (p.prestario?.nombres || "").toLowerCase().includes(searchPrestamo.toLowerCase()))
              .slice(pagePrestamos * rowsPerPagePrestamos, pagePrestamos * rowsPerPagePrestamos + rowsPerPagePrestamos)
              .map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.prestario.nombres} {p.prestario.apellidos}</TableCell>
                  <TableCell>{p.prestamista.nombres} {p.prestamista.apellidos}</TableCell>
                  <TableCell>{p.recurso.descripcion}</TableCell>
                  <TableCell>{p.recurso.ubicacion}</TableCell>
                  <TableCell>{p.recurso.estado}</TableCell>
                  <TableCell>{p.observacion}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={prestamos.length}
          rowsPerPage={rowsPerPagePrestamos}
          page={pagePrestamos}
          onPageChange={(event, newPage) => setPagePrestamos(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPagePrestamos(parseInt(event.target.value, 10));
            setPagePrestamos(0);
          }}
        />
      </Box>
    </Box>
  );
};

export default Loan;