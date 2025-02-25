import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/Agendamentos.css";

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Estado para criar um novo agendamento
  const [novoAgendamento, setNovoAgendamento] = useState({
    produtor_id: "",
    servico: "",
    data_agendamento: "",
    status: "pendente",
  });

  const [produtores, setProdutores] = useState([]);

  useEffect(() => {
    fetchAgendamentos();
    fetchProdutores();
  }, []);

  // 📌 Buscar Agendamentos da API
  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/agendamentos");
      const eventos = response.data.map(agendamento => ({
        id: agendamento.id,
        title: `${agendamento.servico} - ${agendamento.nome_produtor} (${agendamento.status})`,
        start: agendamento.data_agendamento,
        color: getStatusColor(agendamento.status),
        extendedProps: { status: agendamento.status }
      }));
      setAgendamentos(eventos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setMensagem("Erro ao carregar agendamentos.");
    }
  };

  // 📌 Buscar lista de produtores
  const fetchProdutores = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/produtores");
      setProdutores(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtores:", error);
    }
  };

  // 📌 Criar novo agendamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/agendamentos", novoAgendamento);
      setMensagem("✅ Agendamento criado com sucesso!");
      setNovoAgendamento({ produtor_id: "", servico: "", data_agendamento: "", status: "pendente" });
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      setMensagem("❌ Erro ao criar agendamento.");
    }
  };

  // 📌 Atualizar status do agendamento
  const handleStatusUpdate = async (novoStatus) => {
    if (!selectedAgendamento) return;

    try {
      await axios.put(
        `http://localhost:5001/api/agendamentos/${selectedAgendamento.id}/status`,
        { status: novoStatus }
      );
      setMensagem("✅ Status atualizado com sucesso!");
      setShowModal(false);
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error);
      setMensagem("❌ Erro ao atualizar status.");
    }
  };

  // 📌 Definir cores por status
  const getStatusColor = (status) => {
    switch (status) {
      case "pendente": return "#f39c12";  // Amarelo
      case "concluido": return "#2ecc71";  // Verde
      case "cancelado": return "#e74c3c";  // Vermelho
      default: return "#95a5a6";  // Cinza para outros
    }
  };

  // 📌 Quando um evento no calendário é clicado, exibe o modal
  const handleEventClick = (info) => {
    setSelectedAgendamento({ id: info.event.id, status: info.event.extendedProps.status });
    setShowModal(true);
  };

  return (
    <div className="agendamentos-container">
      <h2>📅 Agendamentos</h2>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      {/* 📌 Formulário de Agendamento */}
      <div className="form-agendamento">
        <h3>📋 Criar Novo Agendamento</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Produtor:</label>
            <select
              value={novoAgendamento.produtor_id}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, produtor_id: e.target.value })}
              required
            >
              <option value="">Selecione um produtor</option>
              {produtores.map(produtor => (
                <option key={produtor.id} value={produtor.id}>{produtor.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Serviço:</label>
            <input
              type="text"
              placeholder="Digite o serviço"
              value={novoAgendamento.servico}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, servico: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Data do Agendamento:</label>
            <input
              type="date"
              value={novoAgendamento.data_agendamento}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, data_agendamento: e.target.value })}
              required
            />
          </div>

          <button type="submit">➕ Criar Agendamento</button>
        </form>
      </div>

      {/* 📌 Calendário de Agendamentos */}
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={agendamentos}
          editable={true}
          eventClick={handleEventClick}
          height="700px"
        />
      </div>

      {/* 📌 Modal de alteração de status */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Alterar Status</h3>
            <p>Selecione o novo status:</p>
            <button onClick={() => handleStatusUpdate("pendente")} className="status-btn pendente">🟡 Pendente</button>
            <button onClick={() => handleStatusUpdate("concluido")} className="status-btn concluido">✅ Concluído</button>
            <button onClick={() => handleStatusUpdate("cancelado")} className="status-btn cancelado">❌ Cancelado</button>
            <button onClick={() => setShowModal(false)} className="close-btn">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamentos;
