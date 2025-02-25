import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Configuracoes.css";

const Configuracoes = () => {
  const [usuario, setUsuario] = useState({ id: "", nome: "", email: "", senha: "" });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetchUsuario();
  }, []);

  const fetchUsuario = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/api/usuarios/me", {
        headers: { Authorization: `Bearer ${token}` }, // 🔹 Agora usa "Bearer" para enviar o token corretamente.
      });
      setUsuario(response.data);
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
      setMensagem("❌ Erro ao carregar informações do usuário.");
    }
  };

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const payload = { nome: usuario.nome, email: usuario.email };
      if (usuario.senha) {
        payload.senha = usuario.senha; // Se o usuário inserir uma senha, será enviada
      }

      await axios.put(`http://localhost:5001/api/usuarios/${usuario.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }, // 🔹 Enviando token corretamente
      });

      sessionStorage.setItem("usuario", JSON.stringify(usuario));
      setMensagem("✅ Informações atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      setMensagem("❌ Erro ao atualizar informações.");
    }
  };

  return (
    <div className="config-container">
      <h2>⚙ Configurações da Conta</h2>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      <div className="form-group">
        <label>Nome:</label>
        <input type="text" name="nome" value={usuario.nome} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={usuario.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Nova Senha:</label>
        <input type="password" name="senha" placeholder="Deixe em branco para manter" onChange={handleChange} />
      </div>
      <button onClick={handleSalvar}>💾 Salvar Alterações</button>
    </div>
  );
};

export default Configuracoes;
