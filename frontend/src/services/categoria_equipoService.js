import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/categoria-equipo`; // Prefijo global de la API

const categoriaEquipoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todas las categorías de equipo
export const getCategoriasEquipo = async () => {
  try {
    const response = await categoriaEquipoApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo categorías de equipo:", error);
    throw error.response?.data || error;
  }
};

// Obtener una categoría de equipo por ID
export const getCategoriaEquipoById = async (id) => {
  try {
    const response = await categoriaEquipoApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo categoría de equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear una nueva categoría de equipo
export const createCategoriaEquipo = async (categoriaEquipoData) => {
  try {
    const response = await categoriaEquipoApi.post("/", categoriaEquipoData);
    return response.data;
  } catch (error) {
    console.error("Error creando categoría de equipo:", error);
    throw error.response?.data || error;
  }
};

// Actualizar una categoría de equipo por ID
export const updateCategoriaEquipo = async (id, categoriaEquipoData) => {
  try {
    const response = await categoriaEquipoApi.patch(`/${id}`, categoriaEquipoData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando categoría de equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar una categoría de equipo por ID
export const deleteCategoriaEquipo = async (id) => {
  try {
    const response = await categoriaEquipoApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando categoría de equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default categoriaEquipoApi;