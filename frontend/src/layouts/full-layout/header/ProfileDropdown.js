import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, MenuItem, Typography, Avatar, Button, Divider } from "@mui/material";
import FeatherIcon from "feather-icons-react";
import { getCurrentUser, logout } from "../../../services/authService";

const ProfileDropdown = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser();
        console.log("Usuario autenticado en ProfileDropdown:", loggedUser);

        if (loggedUser && loggedUser.usuario) {
          setUser(loggedUser.usuario);
        } else {
          console.warn("No se recibió un objeto de usuario válido.");
          setUser(null);
        }
      } catch (error) {
        console.error("Error obteniendo el usuario:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("Estado actualizado de user:", user);
  }, [user]);

  // Manejo de Logout
  const handleLogout = async () => {
    await logout();
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <Box>
      {/* Imagen de Perfil y Datos */}
      <Box sx={{ pb: 3, mt: 3, textAlign: "center" }}>
        <Avatar
          src={"src/assets/images/users/7.jpg"}
          alt={"Usuario"}
          sx={{ width: "90px", height: "90px", margin: "auto" }}
        />
        <Box sx={{ mt: 2 }}>
          {user ? (
            <>
              <Typography variant="h5">
                {user.nombres || "Nombres"} {user.apellidos || "Apellidos"}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                Rol: <strong>{user.rol || "No definido"}</strong>
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Carnet: <strong>{user.carnet || "No disponible"}</strong>
              </Typography>
              <Typography color="textSecondary" variant="body2">
                DPI: <strong>{user.dpi || "No disponible"}</strong>
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Debes iniciar sesión
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Redirección al perfil */}
      {user && (
        <MenuItem sx={{ pt: 2, pb: 2 }} component={Link} to="/profile" onClick={onClose}>
          <Box display="flex" alignItems="center">
            <Button
              sx={{
                backgroundColor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.primary.main,
                boxShadow: "none",
                minWidth: "50px",
                width: "45px",
                height: "40px",
                borderRadius: "10px",
              }}
            >
              <FeatherIcon icon="user" width="18" />
            </Button>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6">Mi Perfil</Typography>
            </Box>
          </Box>
        </MenuItem>
      )}

      <Divider />

      {/* Botón de Cerrar Sesión o Iniciar Sesión */}
      <Button
        sx={{ mt: 2, display: "block", width: "100%" }}
        variant="contained"
        color="primary"
        onClick={user ? handleLogout : () => (window.location.href = "/auth/login")}
      >
        {user ? "Cerrar Sesión" : "Iniciar Sesión"}
      </Button>
    </Box>
  );
};

export default ProfileDropdown;
