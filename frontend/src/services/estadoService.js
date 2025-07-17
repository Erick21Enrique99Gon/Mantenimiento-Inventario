import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/estado`; // Prefijo global de la API

const estadoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los estados
export const getEstados = async () => {
  try {
    const response = await estadoApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estados:", error);
    throw error.response?.data || error;
  }
};

// Obtener un estado por ID
export const getEstadoById = async (id) => {
  try {
    const response = await estadoApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo estado con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo estado
export const createEstado = async (estadoData) => {
  try {
    const response = await estadoApi.post("/", estadoData);
    return response.data;
  } catch (error) {
    console.error("Error creando estado:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un estado por ID
export const updateEstado = async (id, estadoData) => {
  try {
    const response = await estadoApi.patch(`/${id}`, estadoData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando estado con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un estado por ID
export const deleteEstado = async (id) => {
  try {
    const response = await estadoApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando estado con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default estadoApi;