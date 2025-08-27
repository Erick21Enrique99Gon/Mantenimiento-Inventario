import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/procedimientos`; // Prefijo global de la API

const importarApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const createFormData = ( file) => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  console.log("📌 Datos enviados en FormData:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  return formData;
};

// Cargar Equipo
export const cargar = async (tipo, Data) => {
  try {
    const formData = createFormData(Data)
    const response = await importarApi.post(tipo, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error importando equipos:", error);
    throw error.response?.data || error;
  }
};