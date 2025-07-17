import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/mobiliario`; // Prefijo global de la API

const mobiliarioApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los mobiliarios
export const getMobiliarios = async () => {
  try {
    const response = await mobiliarioApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo mobiliarios:", error);
    throw error.response?.data || error;
  }
};

// Obtener un mobiliario por ID
export const getMobiliarioById = async (id) => {
  try {
    const response = await mobiliarioApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo mobiliario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo mobiliario
export const createMobiliario = async (mobiliarioData) => {
  try {
    const response = await mobiliarioApi.post("/", mobiliarioData);
    return response.data;
  } catch (error) {
    console.error("Error creando mobiliario:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un mobiliario por ID
export const updateMobiliario = async (id, mobiliarioData) => {
  try {
    const response = await mobiliarioApi.patch(`/${id}`, mobiliarioData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando mobiliario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un mobiliario por ID
export const deleteMobiliario = async (id) => {
  try {
    const response = await mobiliarioApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando mobiliario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default mobiliarioApi;