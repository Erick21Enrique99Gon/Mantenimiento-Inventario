import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/detalle-prestamo`; // Prefijo global de la API

const detallePrestamoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los detalles de préstamo
export const getDetallesPrestamo = async () => {
  try {
    const response = await detallePrestamoApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo detalles de préstamo:", error);
    throw error.response?.data || error;
  }
};

// Obtener un detalle de préstamo por ID
export const getDetallePrestamoById = async (id) => {
  try {
    const response = await detallePrestamoApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo detalle de préstamo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo detalle de préstamo
export const createDetallePrestamo = async (detallePrestamoData) => {
  try {
    const response = await detallePrestamoApi.post("/", detallePrestamoData);
    return response.data;
  } catch (error) {
    console.error("Error creando detalle de préstamo:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un detalle de préstamo por ID
export const updateDetallePrestamo = async (id, detallePrestamoData) => {
  try {
    const response = await detallePrestamoApi.patch(`/${id}`, detallePrestamoData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando detalle de préstamo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un detalle de préstamo por ID
export const deleteDetallePrestamo = async (id) => {
  try {
    const response = await detallePrestamoApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando detalle de préstamo con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default detallePrestamoApi;