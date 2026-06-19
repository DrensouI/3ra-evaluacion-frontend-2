import React from "react";
import { useNavigate } from "react-router-dom";
import LogoEmpresa from "../assets/logo-empresa.png"


const SideBar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="mi-barra-lateral">
            <div className="sidebar-logo-container"> {/* Contenedor del Logo del Menu */} 
                <img src={LogoEmpresa} alt='Logo de la Empresa Hexacall' className="sidebar-logo-png"/>
            </div>
            <h3 className="titulo-menu"> MENU INTERACTIVO</h3>
            <button className="boton-menu" onClick={() => handleNavigation('/dashboard')}>
                📊 DASHBOARD
            </button>
            <button className="boton-menu" onClick={() => handleNavigation('/obras')}>
                🏗 OBRAS Y PROYECTOS
            </button>
            <button className="boton-menu" onClick={() => handleNavigation('/empleados')}>
                👥 EMPLEADOS
            </button>
            <button className="boton-menu" onClick={() => handleNavigation('/reportes')}>
                📋 REPORTES
            </button>  
        </div>
    )
}

export default SideBar