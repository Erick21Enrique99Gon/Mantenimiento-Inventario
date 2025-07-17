import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/editorial`; // Prefijo global de la API

const editorialApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todas las editoriales
export const getEditoriales = async () => {
  try {
    const response = await editorialApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo editoriales:", error);
    throw error.response?.data || error;
  }
};

// Obtener una editorial por ID
export const getEditorialById = async (id) => {
  try {
    const response = await editorialApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo editorial con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear una nueva editorial
export const createEditorial = async (editorialData) => {
  try {
    const response = await editorialApi.post("/", editorialData);
    return response.data;
  } catch (error) {
    console.error("Error creando editorial:", error);
    throw error.response?.data || error;
  }
};

// Actualizar una editorial por ID
export const updateEditorial = async (id, editorialData) => {
  try {
    const response = await editorialApi.patch(`/${id}`, editorialData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando editorial con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar una editorial por ID
export const deleteEditorial = async (id) => {
  try {
    const response = await editorialApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando editorial con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default editorialApi;