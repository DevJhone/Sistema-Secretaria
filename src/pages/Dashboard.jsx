import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Importando a Navbar
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const [estatisticasProdutores, setEstatisticasProdutores] = useState({});
    const [estatisticasAgendamentos, setEstatisticasAgendamentos] = useState({});
    const [estatisticasAtendimentos, setEstatisticasAtendimentos] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            await fetchEstatisticasProdutores();
            await fetchEstatisticasAgendamentos();
            await fetchEstatisticasAtendimentos();
        } catch (error) {
            console.error("❌ Erro ao carregar os dados:", error);
        } finally {
            setLoading(false);
        }
    };

    // 📌 Buscar estatísticas de produtores
    const fetchEstatisticasProdutores = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/estatisticas/produtores");
            if (response.data) {
                setEstatisticasProdutores(response.data);
            }
        } catch (error) {
            console.error("❌ Erro ao buscar estatísticas de produtores:", error);
        }
    };

    // 📌 Buscar estatísticas de agendamentos
    const fetchEstatisticasAgendamentos = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/estatisticas/agendamentos");
            if (response.data) {
                setEstatisticasAgendamentos(response.data);
            }
        } catch (error) {
            console.error("❌ Erro ao buscar estatísticas de agendamentos:", error);
        }
    };

    // 📌 Buscar estatísticas de atendimentos
    const fetchEstatisticasAtendimentos = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/estatisticas/atendimentos");
            if (response.data) {
                setEstatisticasAtendimentos(response.data);
            }
        } catch (error) {
            console.error("❌ Erro ao buscar estatísticas de atendimentos:", error);
        }
    };

    if (loading) {
        return <div className="dashboard">Carregando dados...</div>;
    }

    return (
        <div className="dashboard">
            <h1>📊 Dashboard</h1>

            <div className="dashboard-container">
                {/* 📌 Estatísticas de produtores */}
                <div className="card">
                    <h2>Total de Produtores</h2>
                    <p>{estatisticasProdutores.totalProdutores || 0}</p>
                </div>

                {/* 📌 Estatísticas de Atendimentos */}
                <div className="card">
                    <h2>Total de Atendimentos</h2>
                    <p>{estatisticasAtendimentos.totalAtendimentos || 0}</p>
                </div>
                <div className="card">
                    <h2>Concluídos</h2>
                    <p>{estatisticasAtendimentos.concluidos || 0}</p>
                </div>
                <div className="card">
                    <h2>Pendentes</h2>
                    <p>{estatisticasAtendimentos.pendentes || 0}</p>
                </div>

                {/* 📌 Estatísticas de Agendamentos */}
                <div className="card">
                    <h2>Total de Agendamentos</h2>
                    <p>{estatisticasAgendamentos.totalAgendamentos || 0}</p>
                </div>
            </div>

            {/* 📌 Gráfico de Agendamentos por Status */}
            <div className="chart-container">
                <h2>📅 Agendamentos por Status</h2>
                <Bar
                    data={{
                        labels: ["Pendentes", "Em Andamento", "Concluídos", "Encaminhados"],
                        datasets: [
                            {
                                label: "Quantidade",
                                data: [
                                    estatisticasAgendamentos.pendentes || 0,
                                    estatisticasAgendamentos.emAndamento || 0,
                                    estatisticasAgendamentos.concluidos || 0,
                                    estatisticasAgendamentos.encaminhados || 0
                                ],
                                backgroundColor: ["#f39c12", "#3498db", "#2ecc71", "#e74c3c"],
                            },
                        ],
                    }}
                    options={{ responsive: true }}
                />
            </div>

            {/* 📌 Gráfico de Pizza de Atendimentos */}
            <div className="chart-container">
                <h2>📊 Distribuição de Atendimentos</h2>
                <Doughnut
                    data={{
                        labels: ["Pendentes", "Concluídos"],
                        datasets: [
                            {
                                label: "Quantidade",
                                data: [
                                    estatisticasAtendimentos.pendentes || 0,
                                    estatisticasAtendimentos.concluidos || 0
                                ],
                                backgroundColor: ["#f39c12", "#2ecc71"],
                            },
                        ],
                    }}
                    options={{ responsive: true }}
                />
            </div>
        </div>
    );
};

export default Dashboard;
