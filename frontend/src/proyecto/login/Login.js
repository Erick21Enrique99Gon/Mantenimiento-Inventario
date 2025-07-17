import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, FormGroup, FormControlLabel, Button, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import CustomCheckbox from "../../components/forms/custom-elements/CustomCheckbox";
import CustomTextField from "../../components/forms/custom-elements/CustomTextField";
import CustomFormLabel from "../../components/forms/custom-elements/CustomFormLabel";
import PageContainer from "../../components/container/PageContainer";
import { login } from "../../services/authService";
import img1 from "../../assets/images/backgrounds/rectoria-usac.webp";
import LogoIcon from "../../layouts/full-layout/logo/LogoIcon";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      const { identifier } = JSON.parse(savedUser);
      setIdentifier(identifier);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const usuario = await login(identifier, password);
      console.log("Usuario autenticado:", usuario);

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({ identifier }));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage(error.message || "Error en el inicio de sesión.");
    }
  };

  return (
    <PageContainer title="Login" description="Página de inicio de sesión">
      <Grid container spacing={0} sx={{ height: "100vh", justifyContent: "center" }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          sx={{
            background: (theme) => `${theme.palette.mode === "dark" ? "#1c1f25" : "#ffffff"}`,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                position: { xs: "relative", lg: "absolute" },
                height: { xs: "auto", lg: "100vh" },
                right: { xs: "auto", lg: "-50px" },
                margin: "0 auto",
              }}
            >
              <img
                src={img1}
                alt="bg"
                style={{
                  width: "100%",
                  maxWidth: "812px",
                }}
              />
            </Box>

            <Box sx={{ p: 4, position: "absolute", top: "0" }}>
              <LogoIcon />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
          <Grid container spacing={0} display="flex" justifyContent="center">
            <Grid item xs={12} lg={9} xl={6}>
              <Box sx={{ p: 4 }}>
                <Typography fontWeight="700" variant="h2">
                  Bienvenido de nuevo
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography color="textSecondary" variant="h6" fontWeight="500" sx={{ mr: 1 }}>
                    ¿No tienes una cuenta?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/auth/register"
                    fontWeight="500"
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Crear una cuenta
                  </Typography>
                </Box>
                <Box sx={{ mt: 4 }} component="form" onSubmit={handleLogin}>
                  {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                  <CustomFormLabel htmlFor="identifier">Carnet o DPI</CustomFormLabel>
                  <CustomTextField
                    id="identifier"
                    name="identifier"
                    variant="outlined"
                    fullWidth
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />

                  <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
                  <CustomTextField
                    id="password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <CustomCheckbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                        }
                        label="Recordar este dispositivo"
                      />
                    </FormGroup>
                  </Box>

                  <Button
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    sx={{ pt: "10px", pb: "10px" }}
                  >
                    Iniciar Sesión
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;