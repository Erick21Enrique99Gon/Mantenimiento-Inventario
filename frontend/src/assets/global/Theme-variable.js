import _ from 'lodash';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import typography from './Typography';
import components from './Override';
import shadows from './Shadows';

// ##############################
// Importación de constantes de temas
import {
  BLUE_THEME,
  GREEN_THEME,
  RED_THEME,
  BLACK_THEME,
  PURPLE_THEME,
  INDIGO_THEME,
  ORANGE_THEME,
} from '../../redux/constants';

// ##############################
// Variables Globales
const SidebarWidth = 265;
const TopbarHeight = 70;

const baseTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#1a97f5',
      light: '#e6f4ff',
      dark: '#1682d4',
    },
    secondary: {
      main: '#1e4db7',
      light: '#ddebff',
      dark: '#173f98',
    },
    success: {
      main: '#00c292',
      light: '#ebfaf2',
      dark: '#00964b',
      contrastText: '#ffffff',
    },
    danger: {
      main: '#e46a76',
      light: '#fdf3f5',
    },
    info: {
      main: '#0bb2fb',
      light: '#a7e3f4',
    },
    error: {
      main: '#e46a76',
      light: '#fdf3f5',
      dark: '#e45a68',
    },
    warning: {
      main: '#fec90f',
      light: '#fff4e5',
      dark: '#dcb014',
      contrastText: '#ffffff',
    },
    text: {
      secondary: '#777e89',
      danger: '#fc4b6c',
    },
    grey: {
      A100: '#ecf0f2',
      A200: '#99abb4',
      A400: '#767e89',
      A700: '#e6f4ff',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: 'rgba(0, 0, 0, 0.03)',
    },
  },

  shape: {
    borderRadius: 5,
  },
  mixins: {
    toolbar: {
      color: '#949db2',
      '@media(min-width:1280px)': {
        minHeight: TopbarHeight,
        padding: '0 30px',
      },
      '@media(max-width:1280px)': {
        minHeight: '64px',
      },
    },
  },
  status: {
    danger: '#e53e3e',
  },
  components,
  typography,
  shadows,
};

// Opciones de colores de temas
const themesOptions = [
  {
    name: BLUE_THEME,
    palette: {
      primary: { main: '#1a97f5', light: '#e6f4ff', dark: '#1682d4' },
      secondary: { main: '#1e4db7', light: '#ddebff', dark: '#173f98' },
    },
  },
  {
    name: GREEN_THEME,
    palette: {
      primary: { main: '#00cec3', light: '#d7f8f6', dark: '#02b3a9', contrastText: '#ffffff' },
      secondary: { main: '#066a73' },
    },
  },
  {
    name: PURPLE_THEME,
    palette: {
      primary: { main: '#7352ff', light: '#e5e0fa', dark: '#5739d6' },
      secondary: { main: '#402e8d' },
    },
  },
  {
    name: INDIGO_THEME,
    palette: {
      primary: { main: '#1e4db7', light: '#e6f4ff', dark: '#0c399e' },
      secondary: { main: '#11397b' },
    },
  },
  {
    name: ORANGE_THEME,
    palette: {
      primary: { main: '#FF9800', light: '#FFE0B2', dark: '#F57C00', contrastText: '#ffffff' },
      secondary: { main: '#FB8C00', light: '#FFD180', dark: '#EF6C00', contrastText: '#ffffff' },
    },
  },
  {
    name: RED_THEME,
    palette: {
      primary: { main: '#ff5c8e', light: '#fce6ed', dark: '#d43653', contrastText: '#ffffff' },
      secondary: { main: '#5e244d' },
    },
  },
  {
    name: BLACK_THEME,
    palette: {
      primary: { main: '#1c2025' },
    },
  },
];

// Función para construir el tema
export const BuildTheme = (config = {}) => {
  const customizer = useSelector((state) => state.CustomizerReducer);

  console.log("🔹 Estado global CustomizerReducer:", customizer);
  console.log("🎨 Tema seleccionado:", config.theme);

  // Buscar el tema seleccionado
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);

  // Si el tema no se encuentra, usar el predeterminado
  if (!themeOptions) {
    console.warn(new Error(`🚨 El tema ${config.theme} no es válido. Se usará el predeterminado.`));
    [themeOptions] = themesOptions;
  }

  console.log("✅ Opciones de tema aplicadas:", themeOptions);

  // Definir configuración base del modo claro/oscuro
  const baseMode = {
    palette: {
      mode: customizer.activeMode,
      background: {
        default: customizer.activeMode === 'dark' ? '#20232a' : '#fafbfb',
        dark: customizer.activeMode === 'dark' ? '#1c2025' : '#ffffff',
        paper: customizer.activeMode === 'dark' ? '#282C34' : '#ffffff',
      },
      text: {
        primary: customizer.activeMode === 'dark' ? '#e6e5e8' : 'rgba(0, 0, 0, 0.87)',
        secondary: customizer.activeMode === 'dark' ? '#adb0bb' : '#777e89',
      },
    },
  };

  // Crear y retornar el tema
  return createTheme(
    _.merge({}, baseTheme, baseMode, themeOptions, {
      direction: config.direction,
    }),
  );
};

// Exportar variables
export { TopbarHeight, SidebarWidth, baseTheme };