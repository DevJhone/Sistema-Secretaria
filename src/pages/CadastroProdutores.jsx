import React, { useState } from "react";
import Navbar from "../components/Navbar"; // Importando a Navbar
import axios from "axios";
import "../styles/CadastroProdutores.css";

const CadastroProdutores = () => {
  const [form, setForm] = useState({
    nome: "",
    cpf_cnpj: "",
    endereco: "",
    tipo_producao: "",
    latitude: "",
    longitude: "",
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.cpf_cnpj || !form.endereco || !form.tipo_producao || !form.latitude || !form.longitude) {
      setMensagem("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/produtores/cadastro", form);
      setMensagem(response.data.message);
      setForm({
        nome: "",
        cpf_cnpj: "",
        endereco: "",
        tipo_producao: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      setMensagem(error.response?.data?.error || "Erro ao cadastrar o produtor.");
    }
  };

  return (
    <div className="cadastro-produtor">
      <h1>📝 Cadastro de Produtores</h1>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>CPF/CNPJ:</label>
          <input type="text" name="cpf_cnpj" value={form.cpf_cnpj} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Endereço:</label>
          <input type="text" name="endereco" value={form.endereco} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Tipo de Produção:</label>
          <select name="tipo_producao" value={form.tipo_producao} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="pecuaria">Pecuária</option>
            <option value="agricultura">Agricultura</option>
            <option value="horticultura">Horticultura</option>
            <option value="MEI-Microempreendedor Individual">MEI-Microempreendedor Individual</option>
          </select>
        </div>

        <div className="form-group">
          <label>Latitude:</label>
          <input type="text" name="latitude" value={form.latitude} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Longitude:</label>
          <input type="text" name="longitude" value={form.longitude} onChange={handleChange} required />
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroProdutores;
