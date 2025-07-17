import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { getRfidRegistros } from "../../services/rfid_registroService";
import { getLibros } from "../../services/libroService";
import { getMobiliarios } from "../../services/mobiliarioService";
import { getEquipos } from "../../services/equipoService";
import {
  asignarRFIDLibro,
  asignarRFIDMobiliario,
  asignarRFIDEquipo,
  desasignarRFIDLibro,
  desasignarRFIDMobiliario,
  desasignarRFIDEquipo,
} from "../../services/procedimientoService";

const RfidAssign = () => {
  const [rfidList, setRfidList] = useState([]);
  const [rfidSearch, setRfidSearch] = useState("");
  const [selectedRfid, setSelectedRfid] = useState(null);
  const [recursosDisponibles, setRecursosDisponibles] = useState([]);
  const [recursosAsignados, setRecursosAsignados] = useState([]);
  const [searchDisponibles, setSearchDisponibles] = useState("");
  const [searchAsignados, setSearchAsignados] = useState("");
  // Paginación
  const [pageDisponibles, setPageDisponibles] = useState(0);
  const [rowsPerPageDisponibles, setRowsPerPageDisponibles] = useState(5);
  const [pageAsignados, setPageAsignados] = useState(0);
  const [rowsPerPageAsignados, setRowsPerPageAsignados] = useState(5);
  const rfidInputRef = useRef(null);

  useEffect(() => {
    fetchData();
    rfidInputRef.current.focus(); // Autoenfocar el campo RFID al cargar
  }, []);

  const fetchData = async () => {
    try {
      console.log("🔄 Cargando datos...");

      const rfidData = await getRfidRegistros();
      console.log("📡 Datos obtenidos de getRfidRegistros:", rfidData);

      if (!Array.isArray(rfidData)) {
        throw new Error("❌ El servicio getRfidRegistros no retornó un array.");
      }

      const rfidInactivos = rfidData.filter((rfid) => rfid.estado?.estadoId === 5);
      setRfidList(rfidInactivos);

      const [libros, mobiliarios, equipos] = await Promise.all([
        getLibros(),
        getMobiliarios(),
        getEquipos(),
      ]);

      setRecursosDisponibles([
        ...libros.filter((l) => l.estado.estadoId === 1 && !l.rfid).map((r) => ({ ...r, tipo: "libro" })),
        ...mobiliarios.filter((m) => m.estado.estadoId === 1 && !m.rfid).map((r) => ({ ...r, tipo: "mobiliario" })),
        ...equipos.filter((e) => e.estado.estadoId === 1 && !e.rfid).map((r) => ({ ...r, tipo: "equipo" })),
      ]);

      setRecursosAsignados([
        ...libros.filter((l) => l.rfid).map((r) => ({ ...r, tipo: "libro" })),
        ...mobiliarios.filter((m) => m.rfid).map((r) => ({ ...r, tipo: "mobiliario" })),
        ...equipos.filter((e) => e.rfid).map((r) => ({ ...r, tipo: "equipo" })),
      ]);

      console.log("✅ Datos cargados correctamente.");
    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    }
  };
  

  // 📌 Manejar escaneo o ingreso manual de RFID
  const handleRFIDInput = (e) => {
    if (e.key !== "Enter") return; // Solo ejecuta cuando se presiona ENTER
  
    const rfidCode = e.target.value.trim();
    setRfidSearch(rfidCode);
  
    console.log("RFID ingresado:", rfidCode);
    console.log("Lista de RFID inactivos (Estado 5):", rfidList);
  
    // Buscar coincidencia exacta (asegurando que no haya espacios en los valores)
    const rfidMatch = rfidList.find((rfid) => rfid.rfid.trim() === rfidCode);
  
    if (rfidMatch) {
      console.log("RFID encontrado:", rfidMatch);
      setSelectedRfid(rfidMatch);
    } else {
      console.warn("RFID no encontrado o ya asignado.");
      alert("⚠️ RFID no válido o ya asignado.");
      setSelectedRfid(null);
    }
  };
  

  const handleAssignRFID = async (recurso) => {
    if (!selectedRfid) {
      alert("⚠️ Debes ingresar un RFID válido antes de asignarlo.");
      return;
    }

    try {
      if (recurso.tipo === "libro") {
        await asignarRFIDLibro(recurso.libroId, selectedRfid.rfidId);
      } else if (recurso.tipo === "mobiliario") {
        await asignarRFIDMobiliario(recurso.mobiliarioId, selectedRfid.rfidId);
      } else if (recurso.tipo === "equipo") {
        await asignarRFIDEquipo(recurso.equipoId, selectedRfid.rfidId);
      }

      alert(`✅ RFID ${selectedRfid.rfid} asignado correctamente.`);
      setRfidSearch("");
      setSelectedRfid(null);
      setTimeout(fetchData, 500);
      rfidInputRef.current.focus();
    } catch (error) {
      console.error("Error asignando RFID:", error);
      alert("❌ Error al asignar el RFID.");
    }
  };

  // 📌 Desasignar RFID de un recurso
  const handleUnassignRFID = async (recurso) => {
    try {
      if (recurso.tipo === "libro") {
        await desasignarRFIDLibro(recurso.libroId);
      } else if (recurso.tipo === "mobiliario") {
        await desasignarRFIDMobiliario(recurso.mobiliarioId);
      } else if (recurso.tipo === "equipo") {
        await desasignarRFIDEquipo(recurso.equipoId);
      }

      alert(`✅ RFID desasignado correctamente.`);
      fetchData();
      rfidInputRef.current.focus();
    } catch (error) {
      console.error("Error desasignando RFID:", error);
      alert("❌ Error al desasignar el RFID.");
    }
  };

  const handleSearchDisponibles = (e) => {
    setSearchDisponibles(e.target.value.toLowerCase());
  };

  const handleSearchAsignados = (e) => {
    setSearchAsignados(e.target.value.toLowerCase());
  };

  const filteredRecursosDisponibles = recursosDisponibles.filter((recurso) =>
    (recurso.descripcion || recurso.titulo || "").toLowerCase().includes(searchDisponibles)
  );

  const filteredRecursosAsignados = recursosAsignados.filter((recurso) =>
    (recurso.descripcion || recurso.titulo || "").toLowerCase().includes(searchAsignados)
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Asignación de tarjeta RFID</Typography>

        <TextField
          label="Escanear o Ingresar RFID"
          fullWidth
          margin="normal"
          value={rfidSearch}
          onChange={(e) => setRfidSearch(e.target.value)}
          onKeyDown={handleRFIDInput}
          inputRef={rfidInputRef}
        />

        {/* Tabla de Recursos Disponibles */}
        <Typography variant="h5">Recursos Disponibles sin RFID Asignado</Typography>
        <TextField
          label="Buscar"
          fullWidth
          margin="normal"
          onChange={handleSearchDisponibles}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredRecursosDisponibles
                .slice(pageDisponibles * rowsPerPageDisponibles, pageDisponibles * rowsPerPageDisponibles + rowsPerPageDisponibles)
                .map((recurso) => (
                <TableRow key={recurso.id}>
                  <TableCell>{recurso.id}</TableCell>
                  <TableCell>{recurso.tipo}</TableCell>
                  <TableCell>{recurso.descripcion || recurso.titulo}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleAssignRFID(recurso)}>Asignar RFID</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRecursosDisponibles.length}
          rowsPerPage={rowsPerPageDisponibles}
          page={pageDisponibles}
          onPageChange={(e, newPage) => setPageDisponibles(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPageDisponibles(parseInt(e.target.value, 10))}
        />

        {/* Tabla de Recursos con RFID Asignado */}
        <Typography variant="h5" sx={{ marginTop: 4 }}>Recursos con RFID Asignado</Typography>
        <TextField
          label="Buscar"
          fullWidth
          margin="normal"
          onChange={handleSearchAsignados}
        />
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>RFID Asignado</TableCell>
                <TableCell>Acción</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {filteredRecursosAsignados
                .slice(pageAsignados * rowsPerPageAsignados, pageAsignados * rowsPerPageAsignados + rowsPerPageAsignados)
                .map((recurso) => (
                <TableRow key={recurso.id}>
                <TableCell>{recurso.id}</TableCell>
                <TableCell>{recurso.tipo.toUpperCase()}</TableCell>
                <TableCell>{recurso.descripcion || recurso.titulo}</TableCell>
                <TableCell>{recurso.rfid?.rfid || "N/A"}</TableCell>
                <TableCell>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleUnassignRFID(recurso)}
                    >
                    Desasignar RFID
                    </Button>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRecursosAsignados.length}
          rowsPerPage={rowsPerPageAsignados}
          page={pageAsignados}
          onPageChange={(e, newPage) => setPageAsignados(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPageAsignados(parseInt(e.target.value, 10))}
        />
      </CardContent>
    </Card>
  );
};

export default RfidAssign;