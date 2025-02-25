import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5001/api/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` }, // 🔹 Corrigindo o envio do token
        })
        .then((response) => {
          setNomeUsuario(response.data.nome || "Usuário"); // 🔹 Garante que sempre exiba algo
        })
        .catch((error) => {
          console.error("Erro ao buscar nome do usuário:", error);
        });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // 🔹 Remove o token ao sair
    navigate("/login");
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <nav className="navbar">
      <h1>Sistema de Gestão</h1>

      <div className="navbar-user">
        <span>{getSaudacao()}, {nomeUsuario}!</span> {/* 🔹 Nome dinâmico do usuário */}
        <button onClick={() => navigate("/configuracoes")}>⚙ Configurações</button>
        <button onClick={handleLogout}>🚪 Sair</button>
      </div>
    </nav>
  );
};

export default Navbar;
