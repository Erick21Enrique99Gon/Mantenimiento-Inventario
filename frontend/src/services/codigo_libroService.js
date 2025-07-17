import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/codigo-libro`; // Prefijo global de la API

const codigoLibroApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los códigos de libro
export const getCodigosLibro = async () => {
  try {
    const response = await codigoLibroApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo códigos de libro:", error);
    throw error.response?.data || error;
  }
};

// Obtener un código de libro por ID
export const getCodigoLibroById = async (id) => {
  try {
    const response = await codigoLibroApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo código de libro con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo código de libro
export const createCodigoLibro = async (codigoLibroData) => {
  try {
    const response = await codigoLibroApi.post("/", codigoLibroData);
    return response.data;
  } catch (error) {
    console.error("Error creando código de libro:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un código de libro por ID
export const updateCodigoLibro = async (id, codigoLibroData) => {
  try {
    const response = await codigoLibroApi.patch(`/${id}`, codigoLibroData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando código de libro con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un código de libro por ID
export const deleteCodigoLibro = async (id) => {
  try {
    const response = await codigoLibroApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando código de libro con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default codigoLibroApi;