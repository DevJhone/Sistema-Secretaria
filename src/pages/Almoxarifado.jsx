import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Almoxarifado.css";

const Almoxarifado = () => {
  const [itens, setItens] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [novoItem, setNovoItem] = useState({ nome: "", descricao: "", quantidade: 1 });
  const [novoEmprestimo, setNovoEmprestimo] = useState({ item_id: "", nome_usuario: "" });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetchItens();
    fetchEmprestimos();
  }, []);

  // 📌 Buscar Itens do Almoxarifado
  const fetchItens = async () => {
    try {
      const response = await axios.get("/almoxarifado/itens");
      setItens(response.data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      setMensagem("❌ Erro ao carregar itens.");
    }
  };

  // 📌 Buscar Empréstimos
  const fetchEmprestimos = async () => {
    try {
      const response = await axios.get("/almoxarifado/emprestimos");
      setEmprestimos(response.data);
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error);
      setMensagem("❌ Erro ao carregar empréstimos.");
    }
  };

  // 📌 Adicionar Novo Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/almoxarifado/itens", novoItem);
      setMensagem("✅ Item adicionado com sucesso!");
      setNovoItem({ nome: "", descricao: "", quantidade: 1 });
      fetchItens();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      setMensagem("❌ Erro ao adicionar item.");
    }
  };

  // 📌 Registrar um Empréstimo (Usando Apenas Nome do Usuário)
  const handleEmprestimo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/almoxarifado/emprestimos", novoEmprestimo);
      setMensagem("✅ Empréstimo registrado com sucesso!");
      setNovoEmprestimo({ item_id: "", nome_usuario: "" });
      fetchEmprestimos();
      fetchItens();
    } catch (error) {
      console.error("Erro ao registrar empréstimo:", error);
      setMensagem("❌ Erro ao registrar empréstimo.");
    }
  };

  // 📌 Devolver um Item Emprestado
  const handleDevolucao = async (id) => {
    try {
      await axios.put(`/almoxarifado/emprestimos/${id}/devolver`);
      setMensagem("✅ Item devolvido com sucesso!");
      fetchEmprestimos();
      fetchItens();
    } catch (error) {
      console.error("Erro ao devolver item:", error);
      setMensagem("❌ Erro ao devolver item.");
    }
  };

  // 📌 Excluir um Item do Almoxarifado
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/almoxarifado/itens/${id}`);
      setMensagem("✅ Item excluído com sucesso!");
      fetchItens();
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      setMensagem("❌ Erro ao excluir item.");
    }
  };

  return (
    <div className="almoxarifado-container">
      <h2>📦 Almoxarifado</h2>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      {/* 📌 Formulário para adicionar item */}
      <div className="form-container">
        <h3>➕ Adicionar Novo Item</h3>
        <form onSubmit={handleAddItem}>
          <input type="text" placeholder="Nome do Item" value={novoItem.nome} onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })} required />
          <input type="text" placeholder="Descrição" value={novoItem.descricao} onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })} />
          <input type="number" min="1" placeholder="Quantidade" value={novoItem.quantidade} onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })} required />
          <button type="submit">Salvar</button>
        </form>
      </div>

      {/* 📌 Lista de Itens */}
      <h3>📋 Itens no Almoxarifado</h3>
      <ul className="lista-itens">
        {itens.length > 0 ? (
          itens.map((item) => (
            <li key={item.id}>
              <strong>{item.nome}</strong> - {item.descricao} ({item.quantidade} disponíveis)
              <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>🗑 Excluir</button>
            </li>
          ))
        ) : (
          <p>Nenhum item cadastrado.</p>
        )}
      </ul>

      {/* 📌 Formulário para registrar empréstimos */}
      <div className="form-container">
        <h3>🛠 Registrar Empréstimo</h3>
        <form onSubmit={handleEmprestimo}>
          <label>Item:</label>
          <select value={novoEmprestimo.item_id} onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, item_id: e.target.value })} required>
            <option value="">Selecione um item</option>
            {itens.map((item) => (
              <option key={item.id} value={item.id}>{item.nome}</option>
            ))}
          </select>

          <label>Nome de quem pegou:</label>
          <input type="text" placeholder="Nome Completo" value={novoEmprestimo.nome_usuario} onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, nome_usuario: e.target.value })} required />

          <button type="submit">Registrar Empréstimo</button>
        </form>
      </div>

      {/* 📌 Lista de Empréstimos */}
      <h3>📋 Empréstimos</h3>
      <ul className="lista-emprestimos">
        {emprestimos.length > 0 ? (
          emprestimos.map((emp) => (
            <li key={emp.id}>
              <strong>{emp.item}</strong> emprestado para <strong>{emp.nome_usuario}</strong> em {new Date(emp.data_emprestimo).toLocaleDateString()} - 
              <strong> {emp.status}</strong>
              {emp.status === "pendente" && (
                <button className="devolucao-btn" onClick={() => handleDevolucao(emp.id)}>🔄 Devolver</button>
              )}
            </li>
          ))
        ) : (
          <p>Nenhum empréstimo registrado.</p>
        )}
      </ul>
    </div>
  );
};

export default Almoxarifado;
