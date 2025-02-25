import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/Relatorios.css";

const Relatorios = () => {
  const [tipo, setTipo] = useState("atendimentos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState("");
  const [nome, setNome] = useState("");
  const [dados, setDados] = useState([]);
  
  const fetchRelatorio = async () => {
    try {
      const response = await axios.get("/api/relatorios", { params: { tipo, dataInicio, dataFim, status, nome } });
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    }
  };

  return (
    <div className="relatorios-container">
      <h2>📊 Relatórios</h2>
      
      <div className="filtros">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="atendimentos">Atendimentos</option>
          <option value="cursos">Cursos</option>
          <option value="almoxarifado">Almoxarifado</option>
        </select>
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        <input type="text" placeholder="Pesquisar nome..." value={nome} onChange={(e) => setNome(e.target.value)} />
        <button onClick={fetchRelatorio}>🔍 Buscar</button>
      </div>

      <table>
        <thead>
          <tr>{dados.length > 0 && Object.keys(dados[0]).map((key) => <th key={key}>{key.toUpperCase()}</th>)}</tr>
        </thead>
        <tbody>
          {dados.map((row, index) => (
            <tr key={index}>{Object.values(row).map((value, i) => <td key={i}>{value}</td>)}</tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => window.open("/api/relatorios/pdf", "_blank")}>📄 PDF</button>
      <button onClick={() => window.open("/api/relatorios/excel", "_blank")}>📊 Excel</button>
    </div>
  );
};

export default Relatorios;
