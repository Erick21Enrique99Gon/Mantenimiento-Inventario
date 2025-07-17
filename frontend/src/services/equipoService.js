import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/equipo`; // Prefijo global de la API

const equipoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los equipos
export const getEquipos = async () => {
  try {
    const response = await equipoApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo equipos:", error);
    throw error.response?.data || error;
  }
};

// Obtener un equipo por ID
export const getEquipoById = async (id) => {
  try {
    const response = await equipoApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo equipo
export const createEquipo = async (equipoData) => {
  try {
    const response = await equipoApi.post("/", equipoData);
    return response.data;
  } catch (error) {
    console.error("Error creando equipo:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un equipo por ID
export const updateEquipo = async (id, equipoData) => {
  try {
    const response = await equipoApi.patch(`/${id}`, equipoData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un equipo por ID
export const deleteEquipo = async (id) => {
  try {
    const response = await equipoApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando equipo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default equipoApi;