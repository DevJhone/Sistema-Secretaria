import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Cursos.css";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [novoCurso, setNovoCurso] = useState({ nome: "", descricao: "", data_inicio: "", data_fim: "" });
  const [participantes, setParticipantes] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [novoParticipante, setNovoParticipante] = useState({ curso_id: "", nome_aluno: "" });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetchCursos();
  }, []);

  // 📌 Buscar Cursos
  const fetchCursos = async () => {
    try {
      const response = await axios.get("/cursos");
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      setMensagem("❌ Erro ao carregar cursos.");
    }
  };

  // 📌 Criar Novo Curso
  const handleAddCurso = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/cursos", novoCurso);
      setMensagem("✅ Curso cadastrado com sucesso!");
      setNovoCurso({ nome: "", descricao: "", data_inicio: "", data_fim: "" });
      fetchCursos();
    } catch (error) {
      console.error("Erro ao cadastrar curso:", error);
      setMensagem("❌ Erro ao cadastrar curso.");
    }
  };

  // 📌 Buscar Participantes de um Curso
  const fetchParticipantes = async (cursoId) => {
    try {
      setCursoSelecionado(cursoId);
      const response = await axios.get(`/cursos/${cursoId}/participantes`);
      setParticipantes(response.data);
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
      setMensagem("❌ Erro ao carregar participantes.");
    }
  };

  // 📌 Adicionar Participante a um Curso (Usando Apenas Nome)
  const handleAddParticipante = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/cursos/${novoParticipante.curso_id}/participantes`, novoParticipante);
      setMensagem("✅ Participante adicionado com sucesso!");
      setNovoParticipante({ curso_id: "", nome_aluno: "" });
      fetchParticipantes(novoParticipante.curso_id);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      setMensagem("❌ Erro ao adicionar participante.");
    }
  };

  // 📌 Excluir Curso
  const handleDeleteCurso = async (cursoId) => {
    try {
      await axios.delete(`/cursos/${cursoId}`);
      setMensagem("✅ Curso excluído com sucesso!");
      fetchCursos();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      setMensagem("❌ Erro ao excluir curso.");
    }
  };

  // 📌 Remover Participante de um Curso
  const handleRemoveParticipante = async (participanteId) => {
    try {
      await axios.delete(`/cursos/${cursoSelecionado}/participantes/${participanteId}`);
      setMensagem("✅ Participante removido com sucesso!");
      fetchParticipantes(cursoSelecionado);
    } catch (error) {
      console.error("Erro ao remover participante:", error);
      setMensagem("❌ Erro ao remover participante.");
    }
  };

  return (
    <div className="cursos-container">
      <h2>🎓 Cursos</h2>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      {/* 📌 Formulário para Adicionar Curso */}
      <div className="form-container">
        <h3>📋 Cadastrar Novo Curso</h3>
        <form onSubmit={handleAddCurso}>
          <input
            type="text"
            placeholder="Nome do Curso"
            value={novoCurso.nome}
            onChange={(e) => setNovoCurso({ ...novoCurso, nome: e.target.value })}
            required
          />
          <textarea
            placeholder="Descrição"
            value={novoCurso.descricao}
            onChange={(e) => setNovoCurso({ ...novoCurso, descricao: e.target.value })}
          />
          <label>Data de Início:</label>
          <input
            type="date"
            value={novoCurso.data_inicio}
            onChange={(e) => setNovoCurso({ ...novoCurso, data_inicio: e.target.value })}
            required
          />
          <label>Data de Término:</label>
          <input
            type="date"
            value={novoCurso.data_fim}
            onChange={(e) => setNovoCurso({ ...novoCurso, data_fim: e.target.value })}
            required
          />
          <button type="submit">Salvar</button>
        </form>
      </div>

      {/* 📌 Lista de Cursos */}
      <h3>📅 Cursos Cadastrados</h3>
      <ul className="lista-cursos">
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <li key={curso.id}>
              <strong>{curso.nome}</strong> - {new Date(curso.data_inicio).toLocaleDateString()} a {new Date(curso.data_fim).toLocaleDateString()}
              <p>{curso.descricao}</p>
              <button onClick={() => fetchParticipantes(curso.id)}>👨‍🎓 Ver Participantes</button>
              <button className="delete-btn" onClick={() => handleDeleteCurso(curso.id)}>🗑 Excluir</button>
            </li>
          ))
        ) : (
          <p>Nenhum curso cadastrado.</p>
        )}
      </ul>

      {/* 📌 Lista de Participantes */}
      {cursoSelecionado && (
        <div className="participantes-container">
          <h3>👩‍🎓 Participantes do Curso</h3>
          <ul>
            {participantes.length > 0 ? (
              participantes.map((p) => (
                <li key={p.id}>
                  {p.nome_aluno}
                  <button className="remove-btn" onClick={() => handleRemoveParticipante(p.id)}>❌ Remover</button>
                </li>
              ))
            ) : (
              <p>Nenhum participante encontrado.</p>
            )}
          </ul>
        </div>
      )}

      {/* 📌 Formulário para Adicionar Participante */}
      <div className="form-container">
        <h3>➕ Adicionar Participante</h3>
        <form onSubmit={handleAddParticipante}>
          <label>Curso:</label>
          <select
            value={novoParticipante.curso_id}
            onChange={(e) => setNovoParticipante({ ...novoParticipante, curso_id: e.target.value })}
            required
          >
            <option value="">Selecione um Curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>

          <label>Nome do Aluno:</label>
          <input
            type="text"
            placeholder="Nome do Aluno"
            value={novoParticipante.nome_aluno}
            onChange={(e) => setNovoParticipante({ ...novoParticipante, nome_aluno: e.target.value })}
            required
          />
          <button type="submit">Adicionar</button>
        </form>
      </div>
    </div>
  );
};

export default Cursos;
