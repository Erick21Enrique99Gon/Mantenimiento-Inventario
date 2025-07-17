import axios from "axios";
import environment from "../config/environment";

const API_BASE_URL = `${environment.API_URL}/api/auth`;

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Permite enviar cookies
});

// Iniciar sesión y almacenar la sesión en cookies
export const login = async (identifier, password) => {
  try {
    const response = await authApi.post("/login", { identifier, password }, { withCredentials: true });
    return response.data.usuario;
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    throw error.response?.data || "Error en la autenticación";
  }
};

// Cerrar sesión eliminando la cookie
export const logout = async () => {
  try {
    await authApi.post("/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
};

// Obtener usuario autenticado verificando la cookie
export const getCurrentUser = async () => {
  try {
    const response = await authApi.get("/me", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("No se pudo obtener el usuario:", error);
    return null;
  }
};

export default authApi;