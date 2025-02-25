import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Importando a Navbar
import axios from "axios";
import "../styles/Notificacoes.css";

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  // 📌 Buscar notificações
  const fetchNotificacoes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/notificacoes");
      setNotificacoes(response.data);
    } catch (error) {
      console.error("❌ Erro ao buscar notificações:", error);
      setMensagem("Erro ao carregar notificações.");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Marcar notificação como lida
  const handleMarcarComoLida = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/notificacoes/${id}`); // Corrigido para a rota correta
      fetchNotificacoes();
    } catch (error) {
      console.error("❌ Erro ao marcar como lida:", error);
    }
  };

  // 📌 Excluir notificação (precisa confirmar se o backend tem essa rota)
  const handleExcluirNotificacao = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notificacoes/${id}`);
      fetchNotificacoes();
    } catch (error) {
      console.error("❌ Erro ao excluir notificação:", error);
    }
  };

  return (
    <div className="notificacoes-container">
      <h1>🔔 Notificações</h1>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      {loading ? (
        <p className="loading">🔄 Carregando notificações...</p>
      ) : notificacoes.length === 0 ? (
        <p className="sem-notificacoes">Nenhuma notificação no momento.</p>
      ) : (
        <ul className="notificacoes-lista">
          {notificacoes.map((notificacao) => (
            <li key={notificacao.id} className={notificacao.lida ? "lida" : "nao-lida"}>
              <p>{notificacao.mensagem}</p>
              <div className="acoes">
                {!notificacao.lida && (
                  <button onClick={() => handleMarcarComoLida(notificacao.id)}>✔ Marcar como lida</button>
                )}
                <button onClick={() => handleExcluirNotificacao(notificacao.id)}>❌ Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notificacoes;
