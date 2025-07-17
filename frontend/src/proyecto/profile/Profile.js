import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { getCurrentUser } from "../../services/authService";
import { updateUsuario } from "../../services/usuarioService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    carnet: "",
    dpi: "",
  });

  // Estados para manejo de mensajes
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser();
        console.log("Usuario autenticado:", loggedUser);
        
        if (loggedUser && loggedUser.usuario) {
          const usuarioData = loggedUser.usuario;

          // 🔥 Verificar si el rol es un objeto o un string
          const rolDescripcion =
            typeof usuarioData.rol === "object" ? usuarioData.rol.descripcion : usuarioData.rol || "No definido";

          setUser({
            ...usuarioData,
            rolDescripcion, // ✅ Asignar siempre la descripción del rol
          });

          setFormData({
            nombres: usuarioData.nombres || "",
            apellidos: usuarioData.apellidos || "",
            carnet: usuarioData.carnet || "",
            dpi: usuarioData.dpi || "",
          });
        }
      } catch (error) {
        console.error("Error obteniendo el usuario:", error);
        setErrorMessage("No se pudo obtener la información del usuario.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // 🔥 Excluir `rolDescripcion` para que no se envíe en la actualización
      const updatedUser = await updateUsuario(user.usuarioId, formData);
      console.log("Usuario actualizado:", updatedUser);

      setUser({
        ...updatedUser,
        rolDescripcion: typeof updatedUser.rol === "object" ? updatedUser.rol.descripcion : updatedUser.rol || "No definido",
      });

      setSuccessMessage("¡Perfil actualizado correctamente!");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      setErrorMessage("Ocurrió un error al actualizar el perfil.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Perfil del Usuario
      </Typography>

      {user ? (
        <>
          <TextField
            fullWidth
            label="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Carnet"
            name="carnet"
            value={formData.carnet}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="DPI"
            name="dpi"
            value={formData.dpi}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Rol"
            name="rol"
            value={user.rolDescripcion} // ✅ Siempre muestra correctamente el rol
            disabled
            margin="normal"
          />

          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
            Guardar Cambios
          </Button>
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No se encontró información del usuario.
        </Typography>
      )}

      {/* ✅ Mensaje de éxito */}
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage("")}>
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* ❌ Mensaje de error */}
      <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage("")}>
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
