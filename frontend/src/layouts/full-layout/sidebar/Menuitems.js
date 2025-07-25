const Menuitems = [
  {
    navlabel: true,
    subheader: "INICIO",
    icon: "more-horizontal",
    href: "Dashboard",
  },
  {
    title: "Inicio",
    icon: "home",
    href: "/",
  },
  {
    navlabel: true,
    subheader: "CONFIGURACIÓN",
    icon: "more-horizontal",
    href: "Catalogos",
    allowedRoles: ["Administrador"],
  },
  {
    title: "Catálogos",
    icon: "book",
    collapse: true,
    allowedRoles: ["Administrador"],
    children: [
      { navlabel: true, subheader: "LIBROS" },
      {
        title: "Código de Libro",
        icon: "hash",
        href: "/catalogs/codigo-libro",
      },
      {
        title: "Editoriales",
        icon: "layers",
        href: "/catalogs/editorial",
      },
      { navlabel: true, subheader: "MOBILIARIO" },
      {
        title: "Tipo de Mobiliario",
        icon: "grid",
        href: "/catalogs/tipo-mobiliario",
      },
      { navlabel: true, subheader: "EQUIPOS" },
      {
        title: "Categoría de Equipo",
        icon: "monitor",
        href: "/catalogs/categoria-equipo",
      },
      {
        title: "Tipo de Equipo",
        icon: "cpu",
        href: "/catalogs/tipo-equipo",
      },
      { navlabel: true, subheader: "LABORATORIOS / SALONES" },
      {
        title: "Ubicaciones",
        icon: "map-pin",
        href: "/catalogs/ubicacion",
      },
      { navlabel: true, subheader: "RECURSOS" },
      {
        title: "Código de Inventario",
        icon: "tag",
        href: "/catalogs/codigo-inventario",
      },
      {
        title: "Registro RFID",
        icon: "wifi",
        href: "/catalogs/rfid-registro",
      },
    ],
  },
  {
    navlabel: true,
    subheader: "INVENTARIO",
    icon: "more-horizontal",
    href: "Inventario",
  },
  {
    title: "Libros",
    icon: "book-open",
    href: "/resource/books",
  },
  {
    title: "Equipos",
    icon: "cpu",
    href: "/resource/devices",
  },
  {
    title: "Mobiliario",
    icon: "archive",
    href: "/resource/furniture",
  },
  {
    title: "Gestión de Recursos",
    icon: "layers",
    collapse: true,
    allowedRoles: ["Administrador", "Auxiliar"],
    children: [
      {
        title: "Crear Recurso",
        icon: "plus-circle",
        href: "/resource/create",
        allowedRoles: ["Administrador"],
      },
      {
        title: "Asignar RFID",
        icon: "tag",
        href: "/resource/assign-rfid",
        allowedRoles: ["Administrador", "Auxiliar"],
      },
      { navlabel: true, subheader: "PRESTAMOS" },
      {
        title: "Realizar Préstamo",
        icon: "plus-circle",
        href: "/resource/loan",
        allowedRoles: ["Administrador", "Auxiliar"],
      },
      { navlabel: true, subheader: "DEVOLUCIONES" },
      {
        title: "Realizar Devolución",
        icon: "rotate-ccw",
        href: "/resource/return",
        allowedRoles: ["Administrador", "Auxiliar"],
      },
      { navlabel: true, subheader: "REPORTES" },
      {
        title: "Reporte de Préstamos",
        icon: "file-text",
        href: "/reports",
        allowedRoles: ["Administrador", "Auxiliar"],
      },
      {
        title: "Reporte de Mobiliario",
        icon: "file-text",
        href: "/reports/furniture",
        allowedRoles: ["Administrador", "Auxiliar"],
      },
      {
        title: "Reporte de Equipos",
        icon: "file-text",
        href: "/reports/devices",
        allowedRoles: ["Administrador", "Auxiliar"],
      },

    ],
  },
  {
    navlabel: true,
    subheader: "USUARIO",
    icon: "more-horizontal",
    href: "User",
    authRequired: true,
  },
  {
    title: "Perfil",
    icon: "user",
    href: "/profile",
    authRequired: true,
  },
  {
    title: "Registrar Usuario",
    icon: "user-plus",
    href: "/users/register",
    allowedRoles: ["Administrador"],
  },
  {
    title: "Reset Password",
    icon: "lock",
    href: "/users/password-reset",
    allowedRoles: ["Administrador"],
  },
  {
    navlabel: true,
    subheader: "AUTENTICACIÓN",
    icon: "more-horizontal",
    href: "Authentication",
    hideWhenAuth: true,
  },
  {
    title: "Iniciar Sesión",
    icon: "log-in",
    href: "/auth/login",
    hideWhenAuth: true,
  },
];

export default Menuitems;
