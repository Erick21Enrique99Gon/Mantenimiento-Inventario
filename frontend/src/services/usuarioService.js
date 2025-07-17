import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/usuario`; // Prefijo global de la API

const usuarioApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await usuarioApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    throw error.response?.data || error;
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (id) => {
  try {
    const response = await usuarioApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo usuario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo usuario
export const createUsuario = async (usuarioData) => {
  try {
    const response = await usuarioApi.post("/", usuarioData);
    return response.data;
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un usuario por ID
export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await usuarioApi.patch(`/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando usuario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un usuario por ID
export const deleteUsuario = async (id) => {
  try {
    const response = await usuarioApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando usuario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default usuarioApi;