import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/prestamo`; // Prefijo global de la API

const prestamoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los préstamos
export const getPrestamos = async () => {
  try {
    const response = await prestamoApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo préstamos:", error);
    throw error.response?.data || error;
  }
};

// Obtener un préstamo por ID
export const getPrestamoById = async (id) => {
  try {
    const response = await prestamoApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo préstamo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo préstamo
export const createPrestamo = async (prestamoData) => {
  try {
    const response = await prestamoApi.post("/", prestamoData);
    return response.data;
  } catch (error) {
    console.error("Error creando préstamo:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un préstamo por ID
export const updatePrestamo = async (id, prestamoData) => {
  try {
    const response = await prestamoApi.patch(`/${id}`, prestamoData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando préstamo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un préstamo por ID
export const deletePrestamo = async (id) => {
  try {
    const response = await prestamoApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando préstamo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default prestamoApi;