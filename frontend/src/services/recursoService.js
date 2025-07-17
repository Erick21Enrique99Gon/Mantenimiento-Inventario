import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/recurso`; // Prefijo global de la API

const recursoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los recursos
export const getRecursos = async () => {
  try {
    const response = await recursoApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo recursos:", error);
    throw error.response?.data || error;
  }
};

// Obtener un recurso por ID
export const getRecursoById = async (id) => {
  try {
    const response = await recursoApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo recurso con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo recurso con imagen
export const createRecurso = async (recursoData, file) => {
  try {
    const formData = new FormData();
    Object.keys(recursoData).forEach((key) => {
      formData.append(key, recursoData[key]);
    });

    if (file) {
      formData.append("file", file);
    }

    const response = await recursoApi.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creando recurso:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un recurso por ID con imagen opcional
export const updateRecurso = async (id, recursoData, file) => {
  try {
    const formData = new FormData();
    Object.keys(recursoData).forEach((key) => {
      formData.append(key, recursoData[key]);
    });

    if (file) {
      formData.append("file", file);
    }

    const response = await recursoApi.patch(`/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error actualizando recurso con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un recurso por ID
export const deleteRecurso = async (id) => {
  try {
    const response = await recursoApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando recurso con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default recursoApi;