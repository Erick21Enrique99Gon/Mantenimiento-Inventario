import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/rfid-registro`; // Prefijo de la API

const rfidRegistroApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Obtener todos los registros RFID
export const getRfidRegistros = async () => {
  try {
    const response = await rfidRegistroApi.get("/");
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo registros RFID:", error);
    throw error.response?.data || error;
  }
};

// 🔹 Obtener un registro RFID por ID
export const getRfidRegistroById = async (id) => {
  try {
    const response = await rfidRegistroApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error obteniendo registro RFID con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// 🔹 Crear un nuevo registro RFID
export const createRfidRegistro = async (rfidRegistroData) => {
  try {
    const response = await rfidRegistroApi.post("/", rfidRegistroData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creando registro RFID:", error);
    throw error.response?.data || error;
  }
};

// 🔹 Actualizar un registro RFID por ID
export const updateRfidRegistro = async (id, rfidRegistroData) => {
  try {
    const response = await rfidRegistroApi.patch(`/${id}`, rfidRegistroData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error actualizando registro RFID con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// 🔹 Eliminar un registro RFID por ID
export const deleteRfidRegistro = async (id) => {
  try {
    const response = await rfidRegistroApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error eliminando registro RFID con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// ✅ Exportar el servicio para su uso en otros módulos
export default rfidRegistroApi;