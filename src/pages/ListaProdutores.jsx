import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Importando a Navbar
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "../styles/ListaProdutores.css";

const ListaProdutores = () => {
  const [produtores, setProdutores] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [produtorEditando, setProdutorEditando] = useState(null);
  const [formEdicao, setFormEdicao] = useState({ nome: "", cpf_cnpj: "", endereco: "", tipo_producao: "", latitude: "", longitude: "" });

  useEffect(() => {
    buscarProdutores();
  }, []);

  const buscarProdutores = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/produtores");
      setProdutores(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtores:", error);
    }
  };

  const handleBuscar = (e) => {
    setBusca(e.target.value);
  };

  const handleFiltroTipo = (e) => {
    setFiltroTipo(e.target.value);
  };

  const produtoresFiltrados = produtores.filter(
    (produtor) =>
      produtor.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (filtroTipo === "" || produtor.tipo_producao === filtroTipo)
  );

  const handleEditar = (produtor) => {
    setProdutorEditando(produtor.id);
    setFormEdicao({ ...produtor });
  };

  const handleSalvarEdicao = async () => {
    try {
      await axios.put(`http://localhost:5001/api/produtores/${produtorEditando}`, formEdicao);
      setProdutorEditando(null);
      buscarProdutores();
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produtor?")) {
      try {
        await axios.delete(`http://localhost:5001/api/produtores/${id}`);
        buscarProdutores();
      } catch (error) {
        console.error("Erro ao excluir produtor:", error);
      }
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Produtores", 14, 10);
    const dados = produtoresFiltrados.map((produtor) => [
      produtor.id,
      produtor.nome,
      produtor.cpf_cnpj,
      produtor.endereco,
      produtor.tipo_producao,
      produtor.latitude,
      produtor.longitude,
    ]);
    doc.autoTable({
      head: [["ID", "Nome", "CPF/CNPJ", "Endereço", "Tipo Produção", "Latitude", "Longitude"]],
      body: dados,
    });
    doc.save("produtores.pdf");
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(produtoresFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtores");
    XLSX.writeFile(wb, "produtores.xlsx");
  };

  return (
    <div className="lista-produtores">
      <h1>📋 Lista de Produtores</h1>
      <div className="filtros">
        <input type="text" placeholder="Buscar produtor..." value={busca} onChange={handleBuscar} />
        <select value={filtroTipo} onChange={handleFiltroTipo}>
          <option value="">Todos os tipos</option>
          <option value="pecuaria">Pecuária</option>
          <option value="agricultura">Agricultura</option>
          <option value="horticultura">Horticultura</option>
        </select>
        <button onClick={exportarPDF} className="export" >
          <FaFileExport /> Exportar PDF
        </button>
        <button onClick={exportarExcel}>
          <FaFileExport /> Exportar Excel
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF/CNPJ</th>
            <th>Endereço</th>
            <th>Tipo Produção</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtoresFiltrados.length > 0 ? (
            produtoresFiltrados.map((produtor) => (
              <tr key={produtor.id}>
                {produtorEditando === produtor.id ? (
                  <>
                    <td>{produtor.id}</td>
                    <td>
                      <input type="text" value={formEdicao.nome} onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })} />
                    </td>
                    <td>
                      <input type="text" value={formEdicao.cpf_cnpj} onChange={(e) => setFormEdicao({ ...formEdicao, cpf_cnpj: e.target.value })} />
                    </td>
                    <td>
                      <input type="text" value={formEdicao.endereco} onChange={(e) => setFormEdicao({ ...formEdicao, endereco: e.target.value })} />
                    </td>
                    <td>
                      <select value={formEdicao.tipo_producao} onChange={(e) => setFormEdicao({ ...formEdicao, tipo_producao: e.target.value })}>
                        <option value="pecuaria">Pecuária</option>
                        <option value="agricultura">Agricultura</option>
                        <option value="horticultura">Horticultura</option>
                        <option value="MEI-Microempreendedor Individual">MEI-Microempreendedor Individual</option>
                      </select>
                    </td>
                    <td>
                      <input type="text" value={formEdicao.latitude} onChange={(e) => setFormEdicao({ ...formEdicao, latitude: e.target.value })} />
                    </td>
                    <td>
                      <input type="text" value={formEdicao.longitude} onChange={(e) => setFormEdicao({ ...formEdicao, longitude: e.target.value })} />
                    </td>
                    <td>
                      <button onClick={handleSalvarEdicao}>Salvar</button>
                      <button onClick={() => setProdutorEditando(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{produtor.id}</td>
                    <td>{produtor.nome}</td>
                    <td>{produtor.cpf_cnpj}</td>
                    <td>{produtor.endereco}</td>
                    <td>{produtor.tipo_producao}</td>
                    <td>{produtor.latitude}</td>
                    <td>{produtor.longitude}</td>
                    <td>
                      <button onClick={() => handleEditar(produtor)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleExcluir(produtor.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Nenhum produtor encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProdutores;
