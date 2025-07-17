import React, { useState, useEffect } from "react";
import { Box, IconButton, Toolbar, AppBar, Typography, Avatar, Button, Menu } from "@mui/material";
import FeatherIcon from "feather-icons-react";
import PropTypes from "prop-types";
import ProfileDropdown from "./ProfileDropdown";
import { getCurrentUser } from "../../../services/authService";

const Header = ({ sx, customClass, toggleSidebar, toggleMobileSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser();
        console.log("Usuario cargado en Header:", loggedUser);
        setUser(loggedUser);
      } catch (error) {
        console.error("Error obteniendo el usuario:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar sx={sx} elevation={0} className={customClass}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          size="large"
          sx={{ display: { lg: "flex", xs: "none" } }}
        >
          <FeatherIcon icon="menu" />
        </IconButton>

        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{ display: { lg: "none", xs: "flex" } }}
        >
          <FeatherIcon icon="menu" width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />

        {/* Perfil del Usuario */}
        <Button
          aria-label="menu"
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              src={"src/assets/images/users/7.jpg"}
              alt="Usuario"
              sx={{ width: "30px", height: "30px" }}
            />
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", ml: 1 }}>
              <Typography color="textSecondary" variant="h5" fontWeight="400">
                Hola,
              </Typography>
              <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                {user?.nombres ? user.nombres : "Usuario"}
              </Typography>
              <FeatherIcon icon="chevron-down" width="20" height="20" />
            </Box>
          </Box>
        </Button>

        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            "& .MuiMenu-paper": {
              width: "250px",
              right: 0,
              top: "70px !important",
            },
            "& .MuiList-padding": {
              p: "20px",
            },
          }}
        >
          <ProfileDropdown onClose={handleClose} />
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
