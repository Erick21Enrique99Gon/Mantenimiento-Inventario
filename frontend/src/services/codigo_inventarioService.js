import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/codigo-inventario`; // Prefijo de la API

const codigoInventarioApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Obtener todos los códigos de inventario
export const getCodigosInventario = async () => {
  try {
    const response = await codigoInventarioApi.get("/");
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo códigos de inventario:", error);
    throw error.response?.data || error;
  }
};

// 🔹 Obtener un código de inventario por ID
export const getCodigoInventarioById = async (id) => {
  try {
    const response = await codigoInventarioApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error obteniendo código de inventario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// 🔹 Crear un nuevo código de inventario
export const createCodigoInventario = async (codigoInventarioData) => {
  try {
    const response = await codigoInventarioApi.post("/", codigoInventarioData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creando código de inventario:", error);
    throw error.response?.data || error;
  }
};

// 🔹 Actualizar un código de inventario por ID
export const updateCodigoInventario = async (id, codigoInventarioData) => {
  try {
    const response = await codigoInventarioApi.patch(`/${id}`, codigoInventarioData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error actualizando código de inventario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// 🔹 Eliminar un código de inventario por ID
export const deleteCodigoInventario = async (id) => {
  try {
    const response = await codigoInventarioApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error eliminando código de inventario con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// ✅ Exportar el servicio para su uso en otros módulos
export default codigoInventarioApi;