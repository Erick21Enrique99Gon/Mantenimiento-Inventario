import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/tipo-equipo`; // Prefijo global de la API

const tipoEquipoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los tipos de equipo
export const getTiposEquipo = async () => {
  try {
    const response = await tipoEquipoApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo tipos de equipo:", error);
    throw error.response?.data || error;
  }
};

// Obtener un tipo de equipo por ID
export const getTipoEquipoById = async (id) => {
  try {
    const response = await tipoEquipoApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo tipo de equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo tipo de equipo
export const createTipoEquipo = async (tipoEquipoData) => {
  try {
    const response = await tipoEquipoApi.post("/", tipoEquipoData);
    return response.data;
  } catch (error) {
    console.error("Error creando tipo de equipo:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un tipo de equipo por ID
export const updateTipoEquipo = async (id, tipoEquipoData) => {
  try {
    const response = await tipoEquipoApi.patch(`/${id}`, tipoEquipoData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando tipo de equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un tipo de equipo por ID
export const deleteTipoEquipo = async (id) => {
  try {
    const response = await tipoEquipoApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando tipo de equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default tipoEquipoApi;