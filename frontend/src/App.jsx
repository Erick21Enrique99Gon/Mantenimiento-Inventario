import React from 'react';
import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import RTL from './layouts/full-layout/customizer/RTL';
import ThemeSettings from './layouts/full-layout/customizer/ThemeSettings';
import Router from './proyecto/routes/Router';
import 'react-perfect-scrollbar/dist/css/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.CustomizerReducer);
  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        {routing}
      </RTL>
    </ThemeProvider>
  );
}

export default App
