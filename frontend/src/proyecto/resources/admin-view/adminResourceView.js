import React, { useState, useEffect , useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { CloudUpload, Edit, Add } from "@mui/icons-material";

import {
  createLibro,
  createMobiliario,
  createEquipo,
  updateLibro,
  updateMobiliario,
  updateEquipo,
} from "../../../services/procedimientoService";
import { getRecursos } from "../../../services/recursoService";
import { getRecursoById } from "../../../services/recursoService";
import { getCodigosInventario } from "../../../services/codigo_inventarioService";
import { getRfidRegistros } from "../../../services/rfid_registroService";
import { getUbicaciones } from "../../../services/ubicacionService";
import { getEstados } from "../../../services/estadoService";
import { getCategoriasEquipo } from "../../../services/categoria_equipoService";
import { getTiposEquipo } from "../../../services/tipo_equipoService";
import { getTiposMobiliario } from "../../../services/tipo_mobiliarioService";
import { getCodigosLibro } from "../../../services/codigo_libroService";
import { getEditoriales } from "../../../services/editorialService";
import environment from "../../../config/environment";

const AdminResourceView = () => {
  const [tipoRecurso, setTipoRecurso] = useState("");
  const [formData, setFormData] = useState({});
  const [rfidList, setRfidList] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [categoriasEquipo, setCategoriasEquipo] = useState([]);
  const [tiposEquipo, setTiposEquipo] = useState([]);
  const [tiposMobiliario, setTiposMobiliario] = useState([]);
  const [codigosInventario, setCodigosInventario] = useState([]);
  const [codigosLibro, setCodigosLibro] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rfidError, setRfidError] = useState("");
  const [recursos, setRecursos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const rfidInputRef = useRef(null); 
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Estado para la búsqueda

// 📌 Manejar cambios en el campo de búsqueda
const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Convertir a minúsculas para búsqueda insensible a mayúsculas
};

  useEffect(() => {
    loadData();
    fetchRecursos();
  }, []); // El array vacío asegura que solo se ejecuta una vez
  

  const loadData = async () => {
    try {
      const rfidData = await getRfidRegistros();
      console.log("Datos RFID cargados:", rfidData);
      setRfidList(rfidData || []); // Asegurar que siempre es un array
  
      setUbicaciones(await getUbicaciones());
      setEstados(await getEstados());
      setCategoriasEquipo(await getCategoriasEquipo());
      setTiposEquipo(await getTiposEquipo());
      setTiposMobiliario(await getTiposMobiliario());
      setCodigosInventario(await getCodigosInventario());
      setCodigosLibro(await getCodigosLibro());
      setEditoriales(await getEditoriales());
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };
  
  

  const fetchRecursos = async () => {
    try {
        const data = await getRecursos();
        if (Array.isArray(data)) { // ✅ Verifica que sea un array antes de asignarlo
            console.log("✅ Datos obtenidos de la API:", data);
            setRecursos(data);
        } else {
            console.warn("⚠️ La API no devolvió un array válido:", data);
            setRecursos([]);
        }
    } catch (error) {
        console.error("❌ Error obteniendo recursos:", error);
        setRecursos([]); // ✅ Evitar que sea `undefined`
    }
  };
  
  const filteredRecursos = recursos.filter((recurso) => {
    const tipo = recurso.libro
        ? "Libro"
        : recurso.mobiliario
        ? "Mobiliario"
        : recurso.equipo
        ? "Equipo"
        : "Desconocido";

    const descripcion = recurso.libro
        ? recurso.libro.titulo
        : recurso.mobiliario
        ? recurso.mobiliario.descripcion
        : recurso.equipo
        ? recurso.equipo.descripcion
        : "";

    const ubicacion = recurso.libro?.ubicacion?.descripcion
        || recurso.mobiliario?.ubicacion?.descripcion
        || recurso.equipo?.ubicacion?.descripcion
        || "No asignada";

    return (
        tipo.toLowerCase().includes(searchTerm) ||
        descripcion.toLowerCase().includes(searchTerm) ||
        ubicacion.toLowerCase().includes(searchTerm)
    );
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => {
      const newValue = value === "" ? null : value; // ✅ Convertir valores vacíos en `null`
      const newData = { ...prevData, [name]: newValue };
      console.log("📌 Nuevo formData:", newData);
      return newData;
  });
};
  

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleRFIDInput = (e) => {
    if (e.key !== "Enter") return; // ✅ Solo ejecuta cuando se presiona ENTER (lector RFID)

    const rfidCode = e.target.value.trim();
    console.log("RFID ingresado:", rfidCode);
    // 🔥 Refrescar lista antes de validar
    loadData();

    const rfidMatch = rfidList.find((rfid) => rfid.rfid.trim() === rfidCode);

    if (!rfidMatch) {
      setRfidError("⚠️ El código RFID no existe en la base de datos");
      setFormData((prevData) => ({
          ...prevData,
          rfidCodigo: rfidCode,
          rfidId: null,
      }));
      return;
  }
    // ✅ Permitir solo RFID con estado "Inactivo" (estadoId = 5)
    if (rfidMatch.estado?.estadoId === 5) {
      setRfidError(""); // ✅ Borra el error si es válido
      setFormData((prevData) => ({
          ...prevData,
          rfidId: rfidMatch.rfidId,
          rfidCodigo: rfidCode,
      }));
  } else {
      setRfidError("⚠️ Este código RFID ya está asignado a otro recurso.");
      setFormData((prevData) => ({
          ...prevData,
          rfidCodigo: rfidCode,
          rfidId: null, 
      }));
  }
};

const handleRFIDChange = (e) => {
  if (isEditing) return; // ✅ Bloquear cambios si estamos en edición

  setFormData((prevData) => ({
    ...prevData,
    rfidCodigo: e.target.value,
  }));
};
  
const handleEdit = async (recurso) => {
  try {
      setShowForm(true);
      setEditingId(recurso.recursoId);
      setIsEditing(true);

      const data = await getRecursoById(recurso.recursoId);
      console.log("Datos completos del recurso:", data);

      const tipo = data.libro
          ? "libro"
          : data.mobiliario
          ? "mobiliario"
          : data.equipo
          ? "equipo"
          : "";

      setTipoRecurso(tipo);

      let formDataTemp = {
          ubicacionId: data.libro?.ubicacion?.ubicacionId || 
                       data.mobiliario?.ubicacion?.ubicacionId || 
                       data.equipo?.ubicacion?.ubicacionId || 
                       null,
          estadoId: data.libro?.estado?.estadoId || 
                    data.mobiliario?.estado?.estadoId || 
                    data.equipo?.estado?.estadoId || 
                    null,
          imagen_recurso: data.imagen_recurso || null,
      };

      if (tipo === "libro") {
          formDataTemp = {
              ...formDataTemp,
              rfidCodigo: data.libro.rfid?.rfid || "",
              titulo: data.libro.titulo || "",
              autor: data.libro.autor || "",
              isbn: data.libro.isbn || "",
              anio: data.libro.anio || "",
              edicion: data.libro.edicion || "",
              numero: data.libro.numero || "",
              editorialId: data.libro.editorial?.editorialId || null,
              codigoId: data.libro.codigoLibro?.codigoId || null,
          };
      } else if (tipo === "mobiliario") {
          formDataTemp = {
              ...formDataTemp,
              rfidCodigo: data.mobiliario.rfid?.rfid || "",
              descripcion: data.mobiliario.descripcion || "",
              tresp: data.mobiliario.tresp || "",
              valor: data.mobiliario.valor || "",
              tipoMobiliarioId: data.mobiliario.tipoMobiliario?.tipoMobiliarioId || null,
              codigoInventarioId: data.mobiliario.codigoInventario?.codigoInventarioId || null,
          };
      } else if (tipo === "equipo") {
          formDataTemp = {
              ...formDataTemp,
              rfidCodigo: data.equipo.rfid?.rfid || "",
              descripcion: data.equipo.descripcion || "",
              tresp: data.equipo.tresp || "",
              valor: data.equipo.valor || "",
              categoria_equipoId: data.equipo.categoria_equipo?.categoria_equipoId || null,
              tipoEquipoId: data.equipo.tipoEquipo?.tipoEquipoId || null,
              codigoInventarioId: data.equipo.codigoInventario?.codigoInventarioId || null,
          };
      }

      console.log("Datos cargados en formData:", formDataTemp);
      setFormData(formDataTemp);
      setSelectedFile(null);
  } catch (error) {
      console.error("Error al cargar los datos del recurso:", error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("📌 Datos enviados al backend:", formData);

  try {
      let response;
      const cleanedData = Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [key, value === "" ? null : value])
      );

      console.log("📌 Datos limpios para backend:", cleanedData);

      if (editingId) {
          console.log("✏️ Actualizando recurso ID:", editingId);
          response = tipoRecurso === "libro"
              ? await updateLibro(editingId, cleanedData, selectedFile)
              : tipoRecurso === "mobiliario"
              ? await updateMobiliario(editingId, cleanedData, selectedFile)
              : await updateEquipo(editingId, cleanedData, selectedFile);
          console.log("✅ Recurso actualizado:", response);
      } else {
          console.log("🆕 Creando nuevo recurso");
          response = tipoRecurso === "libro"
              ? await createLibro(cleanedData, selectedFile)
              : tipoRecurso === "mobiliario"
              ? await createMobiliario(cleanedData, selectedFile)
              : await createEquipo(cleanedData, selectedFile);
          console.log("✅ Recurso creado:", response);
      }

      await fetchRecursos();
      await loadData();
      setFormData({});
      setSelectedFile(null);
      setEditingId(null);
      setIsEditing(false);
      setShowForm(false);
  } catch (error) {
      console.error("❌ Error al procesar recurso:", error);
  }
};

  const handleAddNew = () => {
    setShowForm(true);
    setEditingId(null);
    setIsEditing(false);
    setTipoRecurso("");
    setFormData({});
    setTimeout(() => rfidInputRef.current?.focus(), 100);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setIsEditing(false);
    setTipoRecurso("");
    setFormData({});
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Gestión de Recursos</Typography>
        {!showForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNew}
          sx={{ marginBottom: 2 }}
          startIcon={<Add />}
        >
          Agregar Nuevo Recurso
        </Button>
        )}
        {showForm && (
        <>
        <TextField
          label="Escanear RFID"
          name="rfidCodigo"
          fullWidth
          margin="normal"
          error={Boolean(rfidError)}
          helperText={rfidError}
          placeholder="Escanea o ingresa el código RFID"
          value={formData.rfidCodigo || ""}
          onChange={handleRFIDChange}  // ✅ Solo permite cambios cuando NO está en edición
          onKeyDown={!isEditing ? handleRFIDInput : undefined}  // ✅ Detecta ENTER solo al agregar nuevo
          disabled={isEditing}  // ✅ Deshabilita en modo edición
          inputRef={rfidInputRef} // ✅ Autofocus en este campo
        />



        <FormControl fullWidth margin="normal">
          <InputLabel>Ubicación</InputLabel>
          <Select name="ubicacionId" value={formData.ubicacionId || ""} onChange={handleChange}>
            {ubicaciones.map((u) => (
              <MenuItem key={u.ubicacionId} value={u.ubicacionId}>
                {u.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" alignItems="center" gap={2} marginTop={2} marginBottom={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
            color="primary"
          >
            Subir Imagen
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {/* Mostrar la imagen actual si no hay una nueva seleccionada */}
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Nueva imagen seleccionada"
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
            />
          ) : (
            formData.imagen_recurso ? (
              <img
                src={`${environment.API_URL}/${formData.imagen_recurso}`}
                alt="Imagen actual"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : (
              <Typography variant="body2">Sin imagen</Typography>
            )
          )}
        </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel>Seleccionar Tipo de Recurso</InputLabel>
              <Select
                value={tipoRecurso}
                onChange={(e) => setTipoRecurso(e.target.value)}
                disabled={isEditing} // 🔒 Bloquear si estamos en edición
              >
                <MenuItem value="libro">Libro</MenuItem>
                <MenuItem value="mobiliario">Mobiliario</MenuItem>
                <MenuItem value="equipo">Equipo</MenuItem>
              </Select>
            </FormControl>


        {tipoRecurso && (
          <Box component="form" onSubmit={handleSubmit}>
            
            

            {/* 📌 Campos Específicos */}
            {tipoRecurso === "libro" && (
              <>
                <TextField label="Título" name="titulo" fullWidth margin="normal" value={formData.titulo || ""} onChange={handleChange} />
                <TextField label="Autor" name="autor" fullWidth margin="normal" value={formData.autor || ""} onChange={handleChange} />
                <TextField label="ISBN" name="isbn" fullWidth margin="normal" value={formData.isbn || ""} onChange={handleChange} />
                <TextField label="Año" name="anio" fullWidth margin="normal" type="number" value={formData.anio || ""} onChange={handleChange} />
                <TextField label="Edición" name="edicion" fullWidth margin="normal" type="number" value={formData.edicion || ""} onChange={handleChange} />
                <TextField label="Número" name="numero" fullWidth margin="normal" type="number" value={formData.numero || ""} onChange={handleChange} />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Editorial</InputLabel>
                  <Select
                      name="editorialId"
                      value={formData.editorialId || ""}
                      onChange={handleChange}
                  >
                      {editoriales.map((e) => (
                          <MenuItem key={e.editorialId} value={e.editorialId}>
                              {e.descripcion}
                          </MenuItem>
                      ))}
                  </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                  <InputLabel>Código de Libro</InputLabel>
                  <Select
                      name="codigoId"
                      value={formData.codigoId || ""}
                      onChange={handleChange}
                  >
                      {codigosLibro.map((c) => (
                          <MenuItem key={c.codigoId} value={c.codigoId}>
                              {c.descripcion}
                          </MenuItem>
                      ))}
                  </Select>
              </FormControl>
              </>
            )}

            {tipoRecurso === "mobiliario" && (
              <>
                <TextField label="Descripción" name="descripcion" fullWidth margin="normal" value={formData.descripcion || ""} onChange={handleChange} />
                <TextField label="TRES P" name="tresp" fullWidth margin="normal" type="number" value={formData.tresp || ""} onChange={handleChange} />
                <TextField label="Valor" name="valor" fullWidth margin="normal" type="number" value={formData.valor || ""} onChange={handleChange} />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Código de Inventario</InputLabel>
                  <Select name="codigoInventarioId" value={formData.codigoInventarioId || ""} onChange={handleChange}>
                    {codigosInventario.map((c) => (
                      <MenuItem key={c.codigoInventarioId} value={c.codigoInventarioId}>
                        {c.codigo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Tipo de Mobiliario</InputLabel>
                  <Select name="tipoMobiliarioId" value={formData.tipoMobiliarioId || ""} onChange={handleChange}>
                    {tiposMobiliario.map((t) => (
                      <MenuItem key={t.tipoMobiliarioId} value={t.tipoMobiliarioId}>
                        {t.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {tipoRecurso === "equipo" && (
              <>
                <TextField label="Descripción" name="descripcion" fullWidth margin="normal" value={formData.descripcion || ""} onChange={handleChange} />
                <TextField label="TRES P" name="tresp" fullWidth margin="normal" type="number" value={formData.tresp || ""} onChange={handleChange} />
                <TextField label="Valor" name="valor" fullWidth margin="normal" type="number" value={formData.valor || ""} onChange={handleChange} />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Código de Inventario</InputLabel>
                  <Select name="codigoInventarioId" value={formData.codigoInventarioId || ""} onChange={handleChange}>
                    {codigosInventario.map((c) => (
                      <MenuItem key={c.codigoInventarioId} value={c.codigoInventarioId}>
                        {c.codigo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Categoría de Equipo</InputLabel>
                  <Select name="categoria_equipoId" value={formData.categoria_equipoId || ""} onChange={handleChange}>
                    {categoriasEquipo.map((c) => (
                      <MenuItem key={c.categoria_equipoId} value={c.categoria_equipoId}>
                        {c.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Tipo de Equipo</InputLabel>
                  <Select name="tipoEquipoId" value={formData.tipoEquipoId || ""} onChange={handleChange}>
                    {tiposEquipo.map((t) => (
                      <MenuItem key={t.tipoEquipoId} value={t.tipoEquipoId}>
                        {t.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

      <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                      Guardar Recurso
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        <Typography variant="h5" sx={{ marginTop: 4 }}>
          Recursos Agregados
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <TextField
            label="Buscar recurso"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por tipo, descripción o ubicación"
        />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
          {filteredRecursos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((recurso) => {
              const tipo = recurso.libro
                  ? "Libro"
                  : recurso.mobiliario
                  ? "Mobiliario"
                  : recurso.equipo
                  ? "Equipo"
                  : "Desconocido";

              const descripcion = recurso.libro
                  ? recurso.libro.titulo
                  : recurso.mobiliario
                  ? recurso.mobiliario.descripcion
                  : recurso.equipo
                  ? recurso.equipo.descripcion
                  : "Sin descripción";

              const ubicacion = recurso.libro?.ubicacion?.descripcion
                  || recurso.mobiliario?.ubicacion?.descripcion
                  || recurso.equipo?.ubicacion?.descripcion
                  || "No asignada";

              const estado = recurso.libro
                  ? recurso.libro.estado?.descripcion
                  : recurso.mobiliario
                  ? recurso.mobiliario.estado?.descripcion
                  : recurso.equipo
                  ? recurso.equipo.estado?.descripcion
                  : "Desconocido";

              return (
                  <TableRow key={recurso.recursoId}>
                      <TableCell>{recurso.recursoId}</TableCell>
                      <TableCell>{tipo}</TableCell>
                      <TableCell>{descripcion}</TableCell>
                      <TableCell>{ubicacion}</TableCell>
                      <TableCell>{estado}</TableCell>
                      <TableCell>
                          <Button variant="contained" color="secondary" startIcon={<Edit />} onClick={() => handleEdit(recurso)}>
                              Editar
                          </Button>
                      </TableCell>
                  </TableRow>
              );
          })}
      </TableBody>
          </Table>
        </TableContainer>

        {/* 📌 Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={recursos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default AdminResourceView;