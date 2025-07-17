import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import CustomTextField from "../../components/forms/custom-elements/CustomTextField";
import CustomFormLabel from "../../components/forms/custom-elements/CustomFormLabel";
import PageContainer from "../../components/container/PageContainer";
import { createUsuario as registerUsuario } from "../../services/usuarioService";
import { getRoles } from "../../services/rolService";

const Register = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    carnet: "",
    dpi: "",
    password: "",
    rolId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar los roles desde la API
  useEffect(() => {
    async function fetchRoles() {
      try {
        const rolesData = await getRoles();
        console.log("Roles obtenidos desde la API:", rolesData);

        if (!Array.isArray(rolesData)) {
          throw new Error("La API no está retornando un array de roles");
        }

        setRoles(rolesData);
      } catch (error) {
        console.error("Error obteniendo roles:", error);
        setErrorMessage("No se pudieron cargar los roles.");
      }
    }
    fetchRoles();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.rolId) {
      setErrorMessage("Debe seleccionar un rol");
      return;
    }

    try {
      const response = await registerUsuario(formData);
      console.log("Usuario registrado con éxito:", response);
      navigate("/auth/login"); // Redirigir tras éxito
    } catch (error) {
      console.error("Error en el registro:", error);
      setErrorMessage(error.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <PageContainer title="Registro" description="Formulario de Registro">
      <Grid container spacing={0} sx={{ height: "100vh", justifyContent: "center" }}>
        <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
          <Grid container spacing={0} display="flex" justifyContent="center">
            <Grid item xs={12} lg={9} xl={6}>
              <Box sx={{ p: 4 }}>
                <Typography fontWeight="700" variant="h2">
                  Crear Cuenta
                </Typography>
                <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
                  <CustomFormLabel htmlFor="nombres">Nombres</CustomFormLabel>
                  <CustomTextField id="nombres" name="nombres" variant="outlined" fullWidth onChange={handleChange} required />

                  <CustomFormLabel htmlFor="apellidos">Apellidos</CustomFormLabel>
                  <CustomTextField id="apellidos" name="apellidos" variant="outlined" fullWidth onChange={handleChange} required />

                  <CustomFormLabel htmlFor="carnet">Carnet</CustomFormLabel>
                  <CustomTextField id="carnet" name="carnet" variant="outlined" fullWidth onChange={handleChange} required />

                  <CustomFormLabel htmlFor="dpi">DPI</CustomFormLabel>
                  <CustomTextField id="dpi" name="dpi" variant="outlined" fullWidth onChange={handleChange} required />

                  <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
                  <CustomTextField id="password" name="password" type="password" variant="outlined" fullWidth onChange={handleChange} required />

                  {/* Selector de Rol */}
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="rol-label">Rol</InputLabel>
                    <Select
                      labelId="rol-label"
                      id="rolId"
                      name="rolId"
                      value={formData.rolId}
                      onChange={handleChange}
                      required
                    >
                      {roles.length > 0 ? (
                        roles.map((rol) => (
                          <MenuItem key={rol.rolId} value={rol.rolId}>
                            {rol.descripcion}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Cargando roles...</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}

                  <Button color="secondary" variant="contained" size="large" fullWidth type="submit" sx={{ mt: 3, pt: "10px", pb: "10px" }}>
                    Registrarse
                  </Button>

                  <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                    ¿Ya tienes una cuenta?{" "}
                    <Button
                      variant="text"
                      sx={{ color: "#1976d2", textDecoration: "none" }}
                      onClick={() => navigate("/auth/login")} // 🔹 Redirige al login
                    >
                      Inicia sesión
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Register;