import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Atendimentos.css";


const Atendimentos = () => {
  // ✅ Estados
  const [produtores, setProdutores] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [anexo, setAnexo] = useState(null);
  
  // ✅ Formulário
  const [form, setForm] = useState({
    produtor_id: "",
    tipo_servico: "",
    servidor_responsavel: "",
    data_atendimento: "",
    observacoes: "",
    descricao: ""
  });

  // 🟡 Busca a lista de produtores ao carregar
  useEffect(() => {
    fetchProdutores();
    fetchAtendimentos();
  }, []);

  const fetchProdutores = async () => {
    try {
      const response = await axios.get("/atendimentos/produtores");
      setProdutores(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtores:", error);
    }
  };

  const fetchAtendimentos = async () => {
    try {
      const response = await axios.get("/atendimentos");
      setAtendimentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
    }
  };

  // ✅ Captura mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ Captura o arquivo anexo
  const handleFileChange = (e) => {
    setAnexo(e.target.files[0]);
  };

  // 🟢 Cadastra um novo atendimento
  const handleCadastro = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("produtor_id", form.produtor_id);
    formData.append("tipo_servico", form.tipo_servico);
    formData.append("servidor_responsavel", form.servidor_responsavel);
    formData.append("data_atendimento", form.data_atendimento);
    formData.append("observacoes", form.observacoes);
    formData.append("descricao", form.descricao);
    if (anexo) formData.append("anexo", anexo);

    try {
      const response = await axios.post("/atendimentos/cadastro", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensagem(response.data.message);
      fetchAtendimentos();
    } catch (error) {
      console.error("Erro ao cadastrar atendimento:", error);
      setMensagem("Erro ao cadastrar atendimento.");
    }
  };

  // 🟡 Concluir Atendimento
  const handleConcluir = async (id) => {
    try {
      await axios.put(`/atendimentos/${id}`, { status: "concluido" });
      fetchAtendimentos();
    } catch (error) {
      console.error("Erro ao concluir atendimento:", error);
    }
  };

  // 🛑 Excluir Atendimento
  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este atendimento?")) {
      try {
        await axios.delete(`/atendimentos/${id}`);
        fetchAtendimentos();
      } catch (error) {
        console.error("Erro ao excluir atendimento:", error);
      }
    }
  };

  // ✅ Baixar Anexo
  const handleDownload = async (filename) => {
    window.open(`/atendimentos/anexos/download/${filename}`, "_blank");
  };

  return (
    <div className="atendimentos-container">
      <h2>📂 Cadastro de Atendimento</h2>

      {/* ✅ Formulário */}
      <form className="form-cadastro" onSubmit={handleCadastro}>
        <label>👨‍🌾 Produtor</label>
        <select name="produtor_id" value={form.produtor_id} onChange={handleChange} required>
          <option value="">Selecione um produtor</option>
          {produtores.map((produtor) => (
            <option key={produtor.id} value={produtor.id}>
              {produtor.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="tipo_servico"
          placeholder="Tipo de Serviço"
          value={form.tipo_servico}
          onChange={handleChange}
        />

        <input
          type="text"
          name="servidor_responsavel"
          placeholder="Servidor Responsável"
          value={form.servidor_responsavel}
          onChange={handleChange}
        />

        <input
          type="date"
          name="data_atendimento"
          value={form.data_atendimento}
          onChange={handleChange}
        />

        <textarea
          name="observacoes"
          placeholder="Observações"
          value={form.observacoes}
          onChange={handleChange}
        />

        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
        />

        <label>📎 Anexo (opcional)</label>
        <input type="file" onChange={handleFileChange} />

        <button type="submit">✅ Cadastrar</button>
      </form>

      {/* 🟡 Mensagem */}
      {mensagem && <p className="mensagem-status">{mensagem}</p>}

      {/* 🟢 Lista de Atendimentos */}
      <h3>📜 Lista de Atendimentos</h3>
      <ul className="lista-atendimentos">
        {atendimentos.length > 0 ? (
          atendimentos.map((atendimento) => (
            <li key={atendimento.id}>
              <div>
                <strong>Produtor:</strong> {atendimento.produtor} <br />
                <strong>Tipo:</strong> {atendimento.tipo_servico} <br />
                <strong>Servidor:</strong> {atendimento.servidor_responsavel} <br />
                <strong>Data:</strong> {new Date(atendimento.data_atendimento).toLocaleDateString()} <br />
                <strong>Status:</strong> {atendimento.status} <br />
                {atendimento.nome_arquivo && (
                  <>
                    <strong>Anexo:</strong> {atendimento.nome_arquivo}{" "}
                    <button onClick={() => handleDownload(atendimento.caminho_arquivo)}>⬇️ Baixar</button>
                  </>
                )}
              </div>
              <div>
                {atendimento.status !== "concluido" && (
                  <button onClick={() => handleConcluir(atendimento.id)}>✅ Concluir</button>
                )}
                <button onClick={() => handleExcluir(atendimento.id)}>🗑️ Excluir</button>
              </div>
            </li>
          ))
        ) : (
          <p>Nenhum atendimento cadastrado.</p>
        )}
      </ul>
    </div>
  );
};

export default Atendimentos;
