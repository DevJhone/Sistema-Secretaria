import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem(""); // Reseta mensagens anteriores

    try {
      const response = await axios.post("http://localhost:5001/api/usuarios/login", { email, senha });

      // ✅ Salva o token no sessionStorage e atualiza o estado
      sessionStorage.setItem("token", response.data.token);
      setToken(response.data.token);

      // ✅ Redireciona para o Dashboard com animação de carregamento
      setMensagem("✅ Login realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/");
      }, 1000); // Redireciona após 1 segundo

    } catch (error) {
      console.error("Erro no login:", error);
      setMensagem("❌ Email ou senha inválidos.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>🔐 Acesso Restrito</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Digite seu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Digite sua Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit">Entrar</button>
          {mensagem && <p className="mensagem-erro">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
