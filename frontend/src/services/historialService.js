import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/historial`; // Prefijo global de la API

const historialApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todos los registros del historial
export const getHistoriales = async () => {
  try {
    const response = await historialApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo historiales:", error);
    throw error.response?.data || error;
  }
};

// Obtener un historial por ID
export const getHistorialById = async (id) => {
  try {
    const response = await historialApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo historial con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo historial con imágenes
export const createHistorial = async (historialData, imagenPrestamo, imagenDevolucion) => {
  try {
    const formData = new FormData();
    
    // Agregar datos del historial al FormData
    Object.keys(historialData).forEach((key) => {
      formData.append(key, historialData[key]);
    });

    // Agregar imágenes si están disponibles
    if (imagenPrestamo) {
      formData.append("imagen_prestamo", imagenPrestamo);
    }
    if (imagenDevolucion) {
      formData.append("imagen_devolucion", imagenDevolucion);
    }

    const response = await historialApi.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creando historial:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un historial por ID con imágenes opcionales
export const updateHistorial = async (id, historialData, imagenPrestamo, imagenDevolucion) => {
  try {
    const formData = new FormData();

    // Agregar datos del historial al FormData
    Object.keys(historialData).forEach((key) => {
      formData.append(key, historialData[key]);
    });

    // Agregar imágenes si están disponibles
    if (imagenPrestamo) {
      formData.append("imagen_prestamo", imagenPrestamo);
    }
    if (imagenDevolucion) {
      formData.append("imagen_devolucion", imagenDevolucion);
    }

    const response = await historialApi.patch(`/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error actualizando historial con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Eliminar un historial por ID
export const deleteHistorial = async (id) => {
  try {
    const response = await historialApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando historial con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportar el servicio para uso en otros módulos
export default historialApi;