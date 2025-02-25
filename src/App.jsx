import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ListaProdutores from "./pages/ListaProdutores";
import CadastroProdutores from "./pages/CadastroProdutores";
import Agendamentos from "./pages/Agendamentos";
import Atendimentos from "./pages/Atendimentos";
import Notificacoes from "./pages/Notificacoes";
import Relatorios from "./pages/Relatorios";
import Servicos from "./pages/Servicos";
import MapaAtendimentos from "./pages/MapaAtendimentos";
import CadastroUsuarios from "./pages/CadastroUsuarios";
import Configuracoes from "./pages/Configuracoes";
import Almoxarifado from "./pages/Almoxarifado";
import Cursos from "./pages/Cursos";
import Login from "./pages/Login";
import "./styles/global.css";
import axios from "axios";

// ✅ Configuração global do Axios
axios.defaults.baseURL = "http://localhost:5001/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

// ✅ Middleware de autenticação automática no Axios
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor de resposta: faz logout automático em caso de erro 401 (token inválido ou expirado)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/login"; // Redireciona automaticamente para o login
    }
    return Promise.reject(error);
  }
);

function App() {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const location = useLocation();

  // ✅ Busca o token ao carregar
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      fetchUsuario();
    }
  }, [location]);

  // ✅ Busca dados do usuário autenticado
  const fetchUsuario = async () => {
    try {
      const response = await axios.get("/usuarios/me");
      setUsuario(response.data);
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      sessionStorage.removeItem("token");
      setToken(null);
    }
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-container">
      {!isLoginPage && token && <Sidebar usuario={usuario} />}
      {!isLoginPage && token && <Navbar usuario={usuario} />}

      <div className="content">
        <Routes>
          {/* 📊 Dashboard */}
          <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />

          {/* 👨‍🌾 Produtores */}
          <Route path="/produtores" element={token ? <ListaProdutores /> : <Navigate to="/login" />} />
          <Route path="/cadastro-produtor" element={token ? <CadastroProdutores /> : <Navigate to="/login" />} />

          {/* 📅 Agendamentos */}
          <Route path="/agendamentos" element={token ? <Agendamentos /> : <Navigate to="/login" />} />

          {/* 📝 Atendimentos */}
          <Route path="/atendimentos" element={token ? <Atendimentos usuario={usuario} /> : <Navigate to="/login" />} />

          {/* 🔔 Notificações */}
          <Route path="/notificacoes" element={token ? <Notificacoes /> : <Navigate to="/login" />} />

          {/* 📈 Relatórios */}
          <Route path="/relatorios" element={token ? <Relatorios /> : <Navigate to="/login" />} />

          {/* 🛎️ Serviços */}
          <Route path="/servicos" element={token ? <Servicos /> : <Navigate to="/login" />} />

          {/* 🗺️ Mapa de Atendimentos */}
          <Route path="/mapa" element={token ? <MapaAtendimentos /> : <Navigate to="/login" />} />

          {/* 👤 Cadastro de Usuários */}
          <Route path="/cadastro-usuarios" element={token ? <CadastroUsuarios /> : <Navigate to="/login" />} />

          {/* ⚙️ Configurações */}
          <Route path="/configuracoes" element={token ? <Configuracoes /> : <Navigate to="/login" />} />

          {/* 🟡 Novas Funcionalidades */}
          <Route path="/almoxarifado" element={token ? <Almoxarifado /> : <Navigate to="/login" />} />
          <Route path="/cursos" element={token ? <Cursos /> : <Navigate to="/login" />} />

          {/* 🔑 Login */}
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />

          {/* 🌐 Rota Padrão */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
