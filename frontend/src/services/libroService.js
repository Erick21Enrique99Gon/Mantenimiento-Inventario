import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/libro`; // Prefijo global de la API

const libroApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los libros
export const getLibros = async () => {
  try {
    const response = await libroApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo libros:", error);
    throw error.response?.data || error;
  }
};

// Obtener un libro por ID
export const getLibroById = async (id) => {
  try {
    const response = await libroApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo libro con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo libro
export const createLibro = async (libroData) => {
  try {
    const response = await libroApi.post("/", libroData);
    return response.data;
  } catch (error) {
    console.error("Error creando libro:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un libro por ID
export const updateLibro = async (id, libroData) => {
  try {
    const response = await libroApi.patch(`/${id}`, libroData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando libro con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un libro por ID
export const deleteLibro = async (id) => {
  try {
    const response = await libroApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando libro con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default libroApi;