import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/procedimientos`; // Prefijo global de la API

const importarApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cargar Equipo
export const cargarEquipo = async (libroData) => {
  try {
    const response = await importarApi.post("/", libroData);
    return response.data;
  } catch (error) {
    console.error("Error importando equipos:", error);
    throw error.response?.data || error;
  }
};