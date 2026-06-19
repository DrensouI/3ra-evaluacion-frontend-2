import React from "react";
import LogoEmpresa from "../assets/logo-empresa.png"


const SideBar = () => {
    return (
        <div className="mi-barra-lateral">
            <div className="sidebar-logo-container"> {/* Contenedor del Logo del Menu */} 
                <img src={LogoEmpresa} alt='Logo de la Empresa Hexacall' className="sidebar-logo-png"/>
            </div>
            <h3 className="titulo-menu"> MENU INTERACTIVO</h3>
            <button className="boton-menu"> PROYECTO</button>
            <button className="boton-menu"> EMPLEADO</button>
            <button className="boton-menu"> INFORME</button>  
        </div>
    )
}

export default SideBar