import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/ubicacion`; // Prefijo global de la API

const ubicacionApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todas las ubicaciones
export const getUbicaciones = async () => {
  try {
    const response = await ubicacionApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo ubicaciones:", error);
    throw error.response?.data || error;
  }
};

// Obtener una ubicación por ID
export const getUbicacionById = async (id) => {
  try {
    const response = await ubicacionApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo ubicación con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear una nueva ubicación
export const createUbicacion = async (ubicacionData) => {
  try {
    const response = await ubicacionApi.post("/", ubicacionData);
    return response.data;
  } catch (error) {
    console.error("Error creando ubicación:", error);
    throw error.response?.data || error;
  }
};

// Actualizar una ubicación por ID
export const updateUbicacion = async (id, ubicacionData) => {
  try {
    const response = await ubicacionApi.patch(`/${id}`, ubicacionData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando ubicación con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar una ubicación por ID
export const deleteUbicacion = async (id) => {
  try {
    const response = await ubicacionApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando ubicación con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default ubicacionApi;