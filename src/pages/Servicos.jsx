import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Importando a Navbar
import axios from "axios";
import "../styles/Servicos.css";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [novoServico, setNovoServico] = useState({ nome: "", descricao: "" });
  const [editandoServico, setEditandoServico] = useState(null);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/servicos");
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const handleChange = (e) => {
    setNovoServico({ ...novoServico, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoServico) {
        await axios.put(`http://localhost:5001/api/servicos/${editandoServico.id}`, novoServico);
      } else {
        await axios.post("http://localhost:5001/api/servicos", novoServico);
      }
      setNovoServico({ nome: "", descricao: "" });
      setEditandoServico(null);
      fetchServicos();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    }
  };

  const handleEdit = (servico) => {
    setNovoServico(servico);
    setEditandoServico(servico);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await axios.delete(`http://localhost:5001/api/servicos/${id}`);
        fetchServicos();
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
      }
    }
  };

  return (
    <div className="servicos-container">
      <h1>📋 Gestão de Serviços</h1>

      <form onSubmit={handleSubmit} className="servico-form">
        <input
          type="text"
          name="nome"
          placeholder="Nome do serviço"
          value={novoServico.nome}
          onChange={handleChange}
          required
        />
        <textarea
          name="descricao"
          placeholder="Descrição do serviço"
          value={novoServico.descricao}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">{editandoServico ? "Atualizar" : "Cadastrar"}</button>
      </form>

      <div className="servicos-list">
        {servicos.length > 0 ? (
          servicos.map((servico) => (
            <div key={servico.id} className="servico-item">
              <h3>{servico.nome}</h3>
              <p>{servico.descricao}</p>
              <div className="servico-actions">
                <button className="edit-btn" onClick={() => handleEdit(servico)}>✏️ Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(servico.id)}>🗑 Excluir</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum serviço cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default Servicos;
