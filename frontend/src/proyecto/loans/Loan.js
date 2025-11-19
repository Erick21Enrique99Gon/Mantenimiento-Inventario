import React, { useState, useEffect, useMemo  } from "react";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid
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
  const [filters, setFilters] = useState({
    codigo: "",
    descripcion: "",
    estado: "",
    ubicacion: "",
    categoria: "",
    tipo: ""
  });


  const [filtered, setFiltered] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");

    const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      setUsuarios(data || []);
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

      // Filtrar solo recursos con estado "Disponible"
      const disponibles = data.filter((recurso) => {
        const estadoDescripcion = recurso.estado?.descripcion?.toLowerCase() || "";
        return estadoDescripcion === "disponible";
      });

      console.log(disponibles);
      setRecursos(disponibles);
    } catch (error) {
      console.error("❌ Error obteniendo recursos:", error);
      setRecursos([]);
    }
  };

  const fetchPrestamos = async () => {
    try {
      const [prestamosData, detallesPrestamoData, historialesData, recursosData] = await Promise.all([
        getPrestamos(),
        getDetallesPrestamo(),
        getHistoriales(),
        getRecursos()
      ]);

      if (!Array.isArray(prestamosData) || !Array.isArray(detallesPrestamoData) || 
          !Array.isArray(historialesData) || !Array.isArray(recursosData)) {
        console.error("❌ Error: Alguna de las respuestas no es un array.");
        return;
      }

      const prestamosActivos = prestamosData.filter(p => p.estado?.descripcion === "Activo");

      const prestamosFinales = prestamosActivos.map(prestamo => {
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
                       recursoCompleto.equipo?.ubicacion?.descripcion || 
                       "Ubicación no disponible",
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

const filteredRecursos = useMemo(() => {
  let filtrado = recursos.filter((r) => {
    if (filtroTipo === "libros") return !!r.libro;
    if (filtroTipo === "equipos") return !!r.equipo;
    if (filtroTipo === "mobiliario") return !!r.mobiliario;
    return true;
  });

  if (filtroTipo === "equipos") {
    filtrado = filtrado.filter((e) =>
      (e.equipo?.codigoInventario?.codigo ?? "")
        .toLowerCase()
        .includes((filters.codigo ?? "").toLowerCase()) &&
      (e.equipo?.descripcion ?? "")
        .toLowerCase()
        .includes((filters.descripcion ?? "").toLowerCase()) &&
      (e.estado?.descripcion ?? "")  // ✅ Keep this - it's correct
        .toLowerCase()
        .includes((filters.estado ?? "").toLowerCase()) &&
      (e.equipo?.ubicacion?.descripcion ?? "")
        .toLowerCase()
        .includes((filters.ubicacion ?? "").toLowerCase()) &&
      (e.equipo?.categoria_equipo?.descripcion ?? "")  // ✅ Already has optional chaining
        .toLowerCase()
        .includes((filters.categoria ?? "").toLowerCase()) &&
      (e.equipo?.tipoEquipo?.descripcion ?? "")
        .toLowerCase()
        .includes((filters.tipo ?? "").toLowerCase())
    );
  }
  
  if (filtroTipo === "mobiliario") {
    filtrado = filtrado.filter((e) =>
      (e.mobiliario?.codigoInventario?.codigo ?? "")
        .toLowerCase()
        .includes((filters.codigo ?? "").toLowerCase()) &&
      (e.mobiliario?.descripcion ?? "")
        .toLowerCase()
        .includes((filters.descripcion ?? "").toLowerCase()) &&
      (e.estado?.descripcion ?? "")  // ✅ Add optional chaining here too
        .toLowerCase()
        .includes((filters.estado ?? "").toLowerCase()) &&
      (e.mobiliario?.ubicacion?.descripcion ?? "")
        .toLowerCase()
        .includes((filters.ubicacion ?? "").toLowerCase()) &&
      (e.mobiliario?.tipoMobiliario?.descripcion ?? "")
        .toLowerCase()
        .includes((filters.tipo ?? "").toLowerCase())
    );
  }

  return filtrado;
}, [recursos, filtroTipo, filters]);


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
                  .filter((user) =>
                    (user.nombres || "").toLowerCase().includes(searchUsuario.toLowerCase())
                  )
                  .slice(
                    pageUsuarios * rowsPerPageUsuarios,
                    pageUsuarios * rowsPerPageUsuarios + rowsPerPageUsuarios
                  )
                  .map((user) => (
                    <TableRow
                      key={user.usuarioId}
                      onClick={() => setSelectedUsuario(user)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: selectedUsuario?.usuarioId === user.usuarioId ? "#f0f0f0" : "",
                      }}
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

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipo de recurso</InputLabel>
            <Select value={filtroTipo} 
              onChange={(e) => {
              setFiltroTipo(e.target.value);
              setFilters({
                codigo: "",
                descripcion: "",
                estado: "",
                ubicacion: "",
                categoria: "",
                tipo: ""
              });
            }}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="libros">Libros</MenuItem>
              <MenuItem value="equipos">Equipos</MenuItem>
              <MenuItem value="mobiliario">Mobiliario</MenuItem>
            </Select>
          </FormControl>
          {(filtroTipo === "equipos" || filtroTipo === "mobiliario") && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Filtrar por Código"
                  variant="outlined"
                  fullWidth
                  name="codigo"
                  value={filters.codigo}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Filtrar por Descripción"
                  variant="outlined"
                  fullWidth
                  name="descripcion"
                  value={filters.descripcion}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Filtrar por Estado"
                  variant="outlined"
                  fullWidth
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Filtrar por Ubicación"
                  variant="outlined"
                  fullWidth
                  name="ubicacion"
                  value={filters.ubicacion}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Filtrar por Categoría"
                  variant="outlined"
                  fullWidth
                  name="categoria"
                  value={filters.categoria}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Filtrar por Tipo"
                  variant="outlined"
                  fullWidth
                  name="tipo"
                  value={filters.tipo}
                  onChange={handleFilterChange}
                />
              </Grid>
            </Grid>
          )}
          {
            filtroTipo === "libros" && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2,
                        justifyContent: "center"
                      }}
                    >
                      {/* <TextField
                        label="Buscar título"
                        variant="outlined"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        size="small"
                      /> */}
                      {/* <TextField
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
                      </FormControl> */}
                    </Box>
            )
          }
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {filtroTipo === "libros" && (
                    <React.Fragment key="libros">
                      <TableCell>Codigo de Inventario</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Autor</TableCell>
                      <TableCell>ISBN</TableCell>
                      <TableCell>Editorial</TableCell>
                      <TableCell>RFID</TableCell>
                    </React.Fragment>
                  )}
                  {filtroTipo === "equipos" && (
                    <>
                      <TableCell>Codigo de Inventario</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Categoria Equipo</TableCell>
                      <TableCell>Tipo equipo</TableCell>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>RFID</TableCell>
                    </>
                  )}
                  {filtroTipo === "mobiliario" && (
                    <>
                      <TableCell>Codigo de Inventario</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>RFID</TableCell>
                    </>
                  )}
                  {filtroTipo === "todos" && (
                    <>
                      <TableCell>Codigo de Inventario</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>RFID</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* LIBROS filtering - only when filtroTipo is "libros" */}
                {filtroTipo === "libros" &&
                  filteredRecursos
                    .slice(
                      pageRecursos * rowsPerPageRecursos,
                      pageRecursos * rowsPerPageRecursos + rowsPerPageRecursos
                    )
                    .map((recurso) => (
                      <TableRow
                        key={recurso.recursoId}
                        onClick={() => setSelectedRecurso(recurso)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: selectedRecurso?.recursoId === recurso.recursoId ? "#f0f0f0" : "",
                        }}
                      >
                        <TableCell>
                          {`(${recurso.libro?.numero || ""} ${recurso.libro?.codigoLibro?.descripcion || ""})` || "Sin codigo"}
                        </TableCell>
                        <TableCell>{recurso.libro?.titulo || "Sin título"}</TableCell>
                        <TableCell>{recurso.libro?.autor || "Desconocido"}</TableCell>
                        <TableCell>{recurso.libro?.isbn || "N/A"}</TableCell>
                        <TableCell>{recurso.libro?.editorial?.descripcion || "N/A"}</TableCell>
                        <TableCell>{recurso.libro?.rfid?.rfid || "N/A"}</TableCell>
                      </TableRow>
                    ))
                }

                {/* EQUIPOS filtering - only when filtroTipo is "equipos" */}
                {filtroTipo === "equipos" &&
                  filteredRecursos
                    .slice(
                      pageRecursos * rowsPerPageRecursos,
                      pageRecursos * rowsPerPageRecursos + rowsPerPageRecursos
                    )
                    .map((recurso) => (
                      <TableRow
                        key={recurso.recursoId}
                        onClick={() => setSelectedRecurso(recurso)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: selectedRecurso?.recursoId === recurso.recursoId ? "#f0f0f0" : "",
                        }}
                      >
                        <TableCell>{recurso.equipo?.codigoInventario?.codigo || "Sin codigo"}</TableCell>
                        <TableCell>{recurso.equipo?.descripcion || "Sin descripción"}</TableCell>
                        <TableCell>{recurso.equipo?.categoria_equipo?.descripcion || "N/A"}</TableCell>
                        <TableCell>{recurso.equipo?.tipoEquipo?.descripcion || "N/A"}</TableCell>
                        <TableCell>{recurso.equipo?.ubicacion?.descripcion || "N/A"}</TableCell>
                        <TableCell>{recurso.equipo?.rfid?.rfid || "N/A"}</TableCell>
                      </TableRow>
                    ))
                }

                {/* MOBILIARIO filtering - only when filtroTipo is "mobiliario" */}
                {filtroTipo === "mobiliario" &&
                  filteredRecursos
                    .slice(
                      pageRecursos * rowsPerPageRecursos,
                      pageRecursos * rowsPerPageRecursos + rowsPerPageRecursos
                    )
                    .map((recurso) => (
                      <TableRow
                        key={recurso.recursoId}
                        onClick={() => setSelectedRecurso(recurso)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: selectedRecurso?.recursoId === recurso.recursoId ? "#f0f0f0" : "",
                        }}
                      >
                        <TableCell>{recurso.mobiliario?.codigoInventario?.codigo || "Sin código"}</TableCell>
                        <TableCell>{recurso.mobiliario?.descripcion || "Sin descripción"}</TableCell>
                        <TableCell>{recurso.mobiliario?.tipoMobiliario?.descripcion || "N/A"}</TableCell>
                        <TableCell>{recurso.mobiliario?.ubicacion?.descripcion || "N/A"}</TableCell>
                        <TableCell>{recurso.mobiliario?.rfid?.rfid || "N/A"}</TableCell>
                      </TableRow>
                    ))
                }

                {/* TODOS filtering - when filtroTipo is "todos" */}
                {filtroTipo === "todos" &&
                  filteredRecursos
                    .filter((recurso) => {
                      const texto = searchRecurso.toLowerCase();
                      const concatenado = `${recurso.libro?.titulo || ""} ${recurso.equipo?.descripcion || ""} ${recurso.mobiliario?.descripcion || ""} ${recurso.equipo?.categoria_equipo?.descripcion || ""} ${recurso.equipo?.tipoEquipo?.descripcion || ""} ${recurso.mobiliario?.tipoMobiliario?.descripcion || ""} ${recurso.equipo?.ubicacion?.descripcion || ""} ${recurso.mobiliario?.ubicacion?.descripcion || ""} ${recurso.libro?.numero || ""} ${recurso.libro?.codigoLibro?.descripcion || ""} ${recurso.equipo?.codigoInventario?.codigo || ""} ${recurso.mobiliario?.codigoInventario?.codigo || ""} ${recurso.libro?.rfid?.rfid || ""} ${recurso.equipo?.rfid?.rfid || ""} ${recurso.mobiliario?.rfid?.rfid || ""}`.toLowerCase();
                      return concatenado.includes(texto);
                    })
                    .slice(
                      pageRecursos * rowsPerPageRecursos,
                      pageRecursos * rowsPerPageRecursos + rowsPerPageRecursos
                    )
                    .map((recurso) => (
                      <TableRow
                        key={recurso.recursoId}
                        onClick={() => setSelectedRecurso(recurso)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: selectedRecurso?.recursoId === recurso.recursoId ? "#f0f0f0" : "",
                        }}
                      >
                        <TableCell>
                          {(recurso.libro?.numero || recurso.libro?.codigoLibro?.descripcion
                            ? `${recurso.libro?.numero || ""} ${recurso.libro?.codigoLibro?.descripcion || ""}`
                            : null) ||
                            recurso.equipo?.codigoInventario?.codigo ||
                            recurso.mobiliario?.codigoInventario?.codigo ||
                            "N/A"}
                        </TableCell>
                        <TableCell>
                          {recurso.libro?.titulo ||
                            recurso.equipo?.descripcion ||
                            recurso.mobiliario?.descripcion ||
                            "Sin descripción"}
                        </TableCell>
                        <TableCell>
                          {recurso.libro?.rfid?.rfid ||
                            recurso.equipo?.rfid?.rfid ||
                            recurso.mobiliario?.rfid?.rfid ||
                            "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>

            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={filteredRecursos.length}
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
          <strong>Usuario logueado (Prestamista):</strong> {usuarioLogueado.nombres}{" "}
          {usuarioLogueado.apellidos}
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
        <TextField
          label="Buscar préstamo"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setSearchPrestamo(e.target.value)}
        />
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
                .filter((p) =>
                  (p.prestario?.nombres || "").toLowerCase().includes(searchPrestamo.toLowerCase())
                )
                .slice(
                  pagePrestamos * rowsPerPagePrestamos,
                  pagePrestamos * rowsPerPagePrestamos + rowsPerPagePrestamos
                )
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