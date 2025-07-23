import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../../layouts/full-layout/loadable/Loadable";


/* ***Layouts**** */
const BlankLayout = Loadable(lazy(() => import("../../layouts/blank-layout/BlankLayout")));
const FullLayout = Loadable(lazy(() => import("../../layouts/full-layout/FullLayout")));

/* ***Views**** */
const Error = Loadable(lazy(() => import("../../views/authentication/Error")));
const Register = Loadable(lazy(() => import("../register/Register")));
const Login = Loadable(lazy(() => import("../login/Login")));
const Home = Loadable(lazy(() => import("../home/Home")));

/* ***Catálogos*** */
const CatCodigoLibro = Loadable(lazy(() => import("../catalogs/catCodigoLibro")));
const CatEditorial = Loadable(lazy(() => import("../catalogs/catEditorial")));
const CatTipoEquipo = Loadable(lazy(() => import("../catalogs/catTipoEquipo")));
const CatTipoMobiliario = Loadable(lazy(() => import("../catalogs/catTipoMobiliario")));
const CatUbicacion = Loadable(lazy(() => import("../catalogs/catUbicacion")));
const CatCategoriaEquipo = Loadable(lazy(() => import("../catalogs/catCategoriaEquipo")));
const CatCodigoInventario = Loadable(lazy(() => import("../catalogs/catCodigoInventario")));
const CatRfidRegistro = Loadable(lazy(() => import("../catalogs/catRfidRegistro")));

/* ***Usuarios (Users)*** */
const PasswordReset = Loadable(lazy(() => import("../login/passwordReset")));

/* ***Perfil*** */
const Profile = Loadable(lazy(() => import("../profile/Profile")));

/* ***Recursos (Resources)*** */
const AdminResourceView = Loadable(lazy(() => import("../resources/admin-view/adminResourceView"))); 
const RfidAssign = Loadable(lazy(() => import("../loans/rfidAssign"))); 
const Loan = Loadable(lazy(() => import("../loans/Loan"))); 
const Return = Loadable(lazy(() => import("../returns/Return")));
const Books = Loadable(lazy(() => import("../resources/user-view/Books")));
const Devices = Loadable(lazy(() => import("../resources/user-view/Devices")));
const Furniture = Loadable(lazy(() => import("../resources/user-view/Furniture")));
const ResourceDetails = Loadable(lazy(() => import("../resources/user-view/resourceDetails"))); // 📌 Nueva importación


/* ***Reportes (Reports)*** */
const LoansReports = Loadable(lazy(() => import("../reports/LoansReports")));
const FurnitureReport = Loadable(lazy(() => import("../reports/FurnitureReport")));
const DevicesReport = Loadable(lazy(() => import("../reports/DevicesReport")));


/* ***Routes Configuration*** */
const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Home /> },
    ],
  },
  {
    path: "/catalogs",
    element: <FullLayout />,
    children: [
      { path: "codigo-libro", element: <CatCodigoLibro /> },
      { path: "editorial", element: <CatEditorial /> },
      { path: "tipo-equipo", element: <CatTipoEquipo /> },
      { path: "tipo-mobiliario", element: <CatTipoMobiliario /> },
      { path: "ubicacion", element: <CatUbicacion /> },
      { path: "categoria-equipo", element: <CatCategoriaEquipo /> },
      { path: "codigo-inventario", element: <CatCodigoInventario /> },
      { path: "rfid-registro", element: <CatRfidRegistro /> },
    ],
  },
  {
    path: "/users",
    element: <FullLayout />,
    children: [
      { path: "register", element: <Register /> },
      { path: "password-reset", element: <PasswordReset /> },
    ],
  },
  {
    path: "/profile",
    element: <FullLayout />,
    children: [
      { path: "", element: <Profile /> },
    ],
  },
  {
    path: "/reports",
    element: <FullLayout />,
    children: [
      { path: "", element: <LoansReports /> },
      { path: "furniture", element: <FurnitureReport />},
      { path: "devices", element: <DevicesReport /> },
    ],
  },
  {
    path: "/resource",
    element: <FullLayout />,
    children: [
      { path: "create", element: <AdminResourceView /> }, 
      { path: "assign-rfid", element: <RfidAssign /> },  
      { path: "books", element: <Books /> },  
      { path: "devices", element: <Devices /> },  
      { path: "furniture", element: <Furniture /> },  
      { path: "details/:id", element: <ResourceDetails /> }, 
      { path: "loan", element: <Loan /> },  
      { path: "return", element: <Return /> }, 
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "404", element: <Error /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;