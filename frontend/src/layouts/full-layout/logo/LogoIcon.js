import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logoECYS from '../../../assets/images/logos/logo-ECYS.png'; // ✅ Nuevo logo importado

const LogoIcon = () => {
  return (
    <Link to="/">
      <img src={logoECYS} alt="Logo ECYS" style={{ width: '150px', height: 'auto' }} />
    </Link>
  );
};

export default LogoIcon;