import React from "react";
import { Link } from "react-router-dom";
import { 
    FaChartBar, FaUsers, FaClipboardList, FaMapMarkedAlt, FaClipboardCheck, 
    FaBell, FaFileAlt, FaUserPlus, FaTools, FaBook 
} from "react-icons/fa";
import Logo from "../components/Ativo 3.svg";
import "../styles/Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={Logo} alt="Logo" className="logo" />
            </div>
            <ul>
                <li><Link to="/"><FaChartBar /> Dashboard</Link></li>
                <li><Link to="/produtores"><FaUsers /> Produtores</Link></li>
                <li><Link to="/cadastro-produtor"><FaUsers /> Novo Produtor</Link></li>
                <li><Link to="/agendamentos"><FaClipboardList /> Agendamentos</Link></li>
                <li><Link to="/atendimentos"><FaClipboardCheck /> Atendimentos</Link></li>
                <li><Link to="/almoxarifado"><FaTools /> Almoxarifado</Link></li>
                <li><Link to="/cursos"><FaBook /> Cursos</Link></li>
                <li><Link to="/mapa"><FaMapMarkedAlt /> Mapa</Link></li>
                <li><Link to="/relatorios"><FaFileAlt /> Relatórios</Link></li>
                <li><Link to="/notificacoes"><FaBell /> Notificações</Link></li>
               
            </ul>
        </div>
    );
};

export default Sidebar;
