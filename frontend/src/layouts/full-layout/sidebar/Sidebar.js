import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { getCurrentUser } from "../../../services/authService";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  Typography,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FeatherIcon from "feather-icons-react";
import { SidebarWidth } from "../../../assets/global/Theme-variable";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./Menuitems";
import Scrollbar from "../../../components/custom-scroll/Scrollbar";

const Sidebar = ({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen }) => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData?.usuario || null);
      } catch (error) {
        console.warn("⚠️ No se pudo obtener el usuario:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const canShow = (item) => {
    if (item.authRequired && !user) return false;
    if (item.hideWhenAuth && user) return false;
    if (item.adminOnly && user?.rol !== "Administrador") return false;
    if (item.allowedRoles && !item.allowedRoles.includes(user?.rol)) return false;
    return true;
  };

  const filteredMenuItems = Menuitems.filter(canShow).map((item) => ({
    ...item,
    children: item.children ? item.children.filter(canShow) : undefined,
  }));

  const handleClick = (index) => {
    setOpen(open === index ? !open : index);
  };

  const SidebarContent = (
    <Scrollbar style={{ height: "calc(100vh - 5px)" }}>
      <Box sx={{ p: 2 }}>
        <LogoIcon />
        <Box>
          <List>
            {filteredMenuItems.map((item, index) => {
              if (item.navlabel) {
                return (
                  <Typography
                    key={item.subheader}
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      my: 2,
                      mt: 3,
                      ml: 2,
                      color: "text.secondary",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.subheader}
                  </Typography>
                );
              }

              if (item.children && item.children.length > 0) {
                return (
                  <React.Fragment key={item.title}>
                    <ListItem
                      button
                      component="li"
                      onClick={() => handleClick(index)}
                      selected={pathWithoutLastPart === item.href}
                      sx={{
                        mb: 1,
                        ...(pathWithoutLastPart === item.href && {
                          color: "white",
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main}!important`,
                        }),
                      }}
                    >
                      <ListItemIcon>
                        <FeatherIcon icon={item.icon} width="20" height="20" />
                      </ListItemIcon>
                      <ListItemText>{item.title}</ListItemText>
                      {index === open || pathWithoutLastPart === item.href ? (
                        <FeatherIcon icon="chevron-down" size="16" />
                      ) : (
                        <FeatherIcon icon="chevron-right" size="16" />
                      )}
                    </ListItem>
                    <Collapse in={index === open} timeout="auto" unmountOnExit>
                      <List component="li" disablePadding>
                        {item.children.map((child) => {
                          if (child.navlabel) {
                            return (
                              <Typography
                                key={child.subheader}
                                variant="body2"
                                fontWeight="bold"
                                sx={{
                                  my: 1,
                                  ml: 4,
                                  color: "text.secondary",
                                  textTransform: "uppercase",
                                }}
                              >
                                {child.subheader}
                              </Typography>
                            );
                          }
                          return (
                            <ListItem
                              key={child.title}
                              button
                              component={NavLink}
                              to={child.href}
                              onClick={onSidebarClose}
                              selected={pathDirect === child.href}
                              sx={{
                                mb: 1,
                                ...(pathDirect === child.href && {
                                  color: "primary.main",
                                  backgroundColor: "transparent!important",
                                }),
                              }}
                            >
                              <ListItemIcon>
                                <FeatherIcon
                                  icon={child.icon}
                                  width="20"
                                  height="20"
                                />
                              </ListItemIcon>
                              <ListItemText>{child.title}</ListItemText>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }

              return (
                <List component="li" disablePadding key={item.title}>
                  <ListItem
                    onClick={() => handleClick(index)}
                    button
                    component={NavLink}
                    to={item.href}
                    selected={pathDirect === item.href}
                    sx={{
                      mb: 1,
                      ...(pathDirect === item.href && {
                        color: "white",
                        backgroundColor: (theme) =>
                          `${theme.palette.primary.main}!important`,
                      }),
                    }}
                  >
                    <ListItemIcon>
                      <FeatherIcon icon={item.icon} width="20" height="20" />
                    </ListItemIcon>
                    <ListItemText>{item.title}</ListItemText>
                  </ListItem>
                </List>
              );
            })}
          </List>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: SidebarWidth,
            border: "0 !important",
            boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      PaperProps={{
        sx: {
          width: SidebarWidth,
          border: "0 !important",
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

Sidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default Sidebar;
