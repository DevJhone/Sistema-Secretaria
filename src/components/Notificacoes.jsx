import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Notificacoes.css";

const Notificacoes = () => {
    const [notificacoes, setNotificacoes] = useState([]);

    useEffect(() => {
        fetchNotificacoes();
    }, []);

    const fetchNotificacoes = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/notificacoes");
            setNotificacoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    const marcarComoLida = async (id) => {
        try {
            await axios.put(`http://localhost:5001/api/notificacoes/${id}/lida`);
            setNotificacoes(notificacoes.filter(notif => notif.id !== id));
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
        }
    };

    return (
        <div className="notificacoes-container">
            <h2>🔔 Notificações</h2>
            {notificacoes.length === 0 ? (
                <p>✅ Nenhuma notificação pendente.</p>
            ) : (
                <ul>
                    {notificacoes.map((notif) => (
                        <li key={notif.id}>
                            {notif.mensagem}
                            <button className="btn-lida" onClick={() => marcarComoLida(notif.id)}>✔</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notificacoes;
