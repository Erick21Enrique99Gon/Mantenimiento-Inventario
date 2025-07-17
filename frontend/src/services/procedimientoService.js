import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/procedimientos`;

const procedimientosApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 📌 Función auxiliar para manejar la subida de imágenes.
 * @param {Object} data - Datos del procedimiento.
 * @param {File} file - Archivo opcional (imagen).
 * @returns {FormData} - Objeto FormData con la información del procedimiento e imagen.
 */
const createFormData = (data, file) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  if (file) {
    formData.append("file", file);
  }

  console.log("📌 Datos enviados en FormData:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  return formData;
};


// 📌 Crear un libro
export const createLibro = async (libroData, file) => {
  try {
    const formData = createFormData(libroData, file);
    const response = await procedimientosApi.post("/crear-libro", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creando libro:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Crear mobiliario
export const createMobiliario = async (mobiliarioData, file) => {
  try {
    const formData = createFormData(mobiliarioData, file);
    const response = await procedimientosApi.post("/crear-mobiliario", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creando mobiliario:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Crear equipo
export const createEquipo = async (equipoData, file) => {
  try {
    const formData = createFormData(equipoData, file);
    const response = await procedimientosApi.post("/crear-equipo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creando equipo:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Actualizar un libro (recursoId en lugar de libroId)
export const updateLibro = async (recursoId, libroData, file) => {
  try {
    const formData = createFormData(libroData, file);
    const response = await procedimientosApi.patch(`/actualizar-libro/${recursoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error actualizando libro con recursoId ${recursoId}:`, error.message);
    throw error.response?.data || error;
  }
};

// 📌 Actualizar mobiliario (recursoId en lugar de mobiliarioId)
export const updateMobiliario = async (recursoId, mobiliarioData, file) => {
  try {
    const formData = createFormData(mobiliarioData, file);
    const response = await procedimientosApi.patch(`/actualizar-mobiliario/${recursoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error actualizando mobiliario con recursoId ${recursoId}:`, error.message);
    throw error.response?.data || error;
  }
};

// 📌 Actualizar equipo (recursoId en lugar de equipoId)
export const updateEquipo = async (recursoId, equipoData, file) => {
  try {
    const formData = createFormData(equipoData, file);
    const response = await procedimientosApi.patch(`/actualizar-equipo/${recursoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error actualizando equipo con recursoId ${recursoId}:`, error.message);
    throw error.response?.data || error;
  }
};

// 📌 Asignar RFID a un libro
export const asignarRFIDLibro = async (libroId, rfidId) => {
  try {
    const response = await procedimientosApi.post("/asignar-rfid-libro", { libroId, rfidId });
    return response.data;
  } catch (error) {
    console.error("❌ Error asignando RFID al libro:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Desasignar RFID de un libro
export const desasignarRFIDLibro = async (libroId) => {
  try {
    const response = await procedimientosApi.patch(`/desasignar-rfid-libro/${libroId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error desasignando RFID del libro:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Asignar RFID a un mobiliario
export const asignarRFIDMobiliario = async (mobiliarioId, rfidId) => {
  try {
    const response = await procedimientosApi.post("/asignar-rfid-mobiliario", { mobiliarioId, rfidId });
    return response.data;
  } catch (error) {
    console.error("❌ Error asignando RFID al mobiliario:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Desasignar RFID de un mobiliario
export const desasignarRFIDMobiliario = async (mobiliarioId) => {
  try {
    const response = await procedimientosApi.patch(`/desasignar-rfid-mobiliario/${mobiliarioId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error desasignando RFID del mobiliario:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Asignar RFID a un equipo
export const asignarRFIDEquipo = async (equipoId, rfidId) => {
  try {
    const response = await procedimientosApi.post("/asignar-rfid-equipo", { equipoId, rfidId });
    return response.data;
  } catch (error) {
    console.error("❌ Error asignando RFID al equipo:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Desasignar RFID de un equipo
export const desasignarRFIDEquipo = async (equipoId) => {
  try {
    const response = await procedimientosApi.patch(`/desasignar-rfid-equipo/${equipoId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error desasignando RFID del equipo:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Realizar un préstamo con imagen opcional
export const realizarPrestamo = async (prestamoData, file) => {
  try {
    const formData = new FormData();

    formData.append("recursoId", String(prestamoData.recursoId || ""));
    formData.append("usuarioPrestarioId", String(prestamoData.usuarioPrestarioId || ""));
    formData.append("usuarioPrestamistaId", String(prestamoData.usuarioPrestamistaId || ""));
    formData.append("observacion", prestamoData.observacion || "");

    if (file) {
      formData.append("imagen_prestamo", file); // Nombre esperado en backend
    }

    console.log("📤 FormData enviado:", Object.fromEntries(formData.entries()));

    const response = await procedimientosApi.post("/realizar-prestamo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error realizando préstamo:", error.message);
    throw error.response?.data || error;
  }
};

/**
 * 📌 Realizar una devolución con imagen opcional.
 * @param {number} prestamoId - ID del préstamo a devolver.
 * @param {File} file - Imagen opcional de la devolución.
 * @returns {Promise<Object>} - Respuesta de la API.
 */
export const realizarDevolucion = async (prestamoId, file) => {
  try {
    const formData = new FormData();
    formData.append("prestamoId", String(prestamoId)); // ✅ Convertimos a string para evitar errores

    if (file) {
      formData.append("file", file); // ✅ Asegurar que el nombre coincide con el backend
    }

    console.log("📤 FormData enviado:", Object.fromEntries(formData.entries()));

    const response = await procedimientosApi.post("/realizar-devolucion", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error realizando devolución:", error.message);
    throw error.response?.data || error;
  }
};

// 📌 Exportar el servicio para uso en otros módulos
export default procedimientosApi;