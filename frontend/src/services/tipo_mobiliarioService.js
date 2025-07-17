import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/tipo-mobiliario`; // Prefijo global de la API

const tipoMobiliarioApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los tipos de mobiliario
export const getTiposMobiliario = async () => {
  try {
    const response = await tipoMobiliarioApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo tipos de mobiliario:", error);
    throw error.response?.data || error;
  }
};

// Obtener un tipo de mobiliario por ID
export const getTipoMobiliarioById = async (id) => {
  try {
    const response = await tipoMobiliarioApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo tipo de mobiliario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo tipo de mobiliario
export const createTipoMobiliario = async (tipoMobiliarioData) => {
  try {
    const response = await tipoMobiliarioApi.post("/", tipoMobiliarioData);
    return response.data;
  } catch (error) {
    console.error("Error creando tipo de mobiliario:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un tipo de mobiliario por ID
export const updateTipoMobiliario = async (id, tipoMobiliarioData) => {
  try {
    const response = await tipoMobiliarioApi.patch(`/${id}`, tipoMobiliarioData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando tipo de mobiliario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un tipo de mobiliario por ID
export const deleteTipoMobiliario = async (id) => {
  try {
    const response = await tipoMobiliarioApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando tipo de mobiliario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default tipoMobiliarioApi;