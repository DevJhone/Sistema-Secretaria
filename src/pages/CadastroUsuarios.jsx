import React, { useState } from "react";
import axios from "axios";
//import "../styles/CadastroUsuarios.css";

const CadastroUsuarios = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "tecnico", // Padrão como técnico, mas pode ser alterado
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Pegando o token do usuário logado
      await axios.post("http://localhost:5001/api/usuarios/cadastro", formData, {
        headers: {
          Authorization: token,
        },
      });
      setMensagem("Usuário cadastrado com sucesso!");
      setFormData({ nome: "", email: "", senha: "", tipo: "tecnico" }); // Resetando o formulário
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setMensagem("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Usuário</h1>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      <form onSubmit={handleSubmit} className="form-cadastro">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        <select name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="tecnico">Técnico</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Cadastrar Usuário</button>
      </form>
    </div>
  );
};

export default CadastroUsuarios;
