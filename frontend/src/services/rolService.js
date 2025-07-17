import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/rol`; // Prefijo global de la API

const rolApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Habilitar cookies
});

// Obtener todos los roles
export const getRoles = async () => {
  try {
    const response = await rolApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo roles:", error);
    throw error.response?.data || error;
  }
};

// Obtener un rol por ID
export const getRolById = async (id) => {
  try {
    const response = await rolApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo rol con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo rol
export const createRol = async (rolData) => {
  try {
    const response = await rolApi.post("/", rolData);
    return response.data;
  } catch (error) {
    console.error("Error creando rol:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un rol por ID
export const updateRol = async (id, rolData) => {
  try {
    const response = await rolApi.patch(`/${id}`, rolData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando rol con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un rol por ID
export const deleteRol = async (id) => {
  try {
    const response = await rolApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando rol con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default rolApi;