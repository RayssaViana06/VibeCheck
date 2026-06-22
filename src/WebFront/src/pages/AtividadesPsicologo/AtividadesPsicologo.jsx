import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarPsicologo from "../../components/layout/NavbarPsicologo";
import { useAuth } from "../../hooks/useAuth";
import { linkService } from "../../services/linkService";
import { atividadeService } from "../../services/atividadeService";
import "./AtividadesPsicologo.css";
import { extrairPacienteId } from "./extrairPacienteId";



function extrairNomeDireto(link) {
    return (
        link.pacienteNome ??
        link.patientName ??
        link.patient_name ??
        link.nome ??
        link.name ??
        null
    );
}



export default function AtividadesPsicologo() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [atividades, setAtividades] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [erroAtividades, setErroAtividades] = useState("");
    const [form, setForm] = useState({ pacienteId: "", texto: "", dataEntrega: "" });

    useEffect(() => {
        if (user) carregarDados();
    }, [user]);

    async function carregarDados() {
        setLoading(true);
        setErro("");
        setErroAtividades("");

        const psicologoId = user?.id ?? user?.sub ?? user?.userId;

        if (!psicologoId) {
            setErro("Não foi possível identificar o psicólogo. Faça login novamente.");
            setLoading(false);
            return;
        }

       
        try {
            const atvsData = await atividadeService.getAtividades();
            setAtividades(Array.isArray(atvsData) ? atvsData : []);
        } catch (e) {
            console.error("[Atividades] Erro ao buscar atividades:", e.message);
            setErroAtividades("Não foi possível carregar as atividades.");
        }

        
        try {
            const linksData = await linkService.getPacientesByPsicologo(psicologoId);
            const links = Array.isArray(linksData) ? linksData : [];

            if (links.length === 0) {
                console.warn("[Atividades] Nenhum vínculo retornado. psicologoId:", psicologoId);
                setPacientes([]);
                setLoading(false);
                return;
            }

            
            console.log("[Atividades] Shape do link[0]:", JSON.stringify(links[0], null, 2));
            console.log("[Atividades] Total de vínculos:", links.length);

            const pacientesResolvidos = await Promise.all(
                links.map(async (link) => {
                    const pacId = extrairPacienteId(link);

                    if (!pacId) {
                        console.warn("[Atividades] Link sem ID identificável:", JSON.stringify(link));
                        return null;
                    }

                    const nomeDireto = extrairNomeDireto(link);
                    if (nomeDireto) {
                        return { id: pacId, nome: nomeDireto };
                    }

                    
                    try {
                        const usuario = await linkService.getUsuarioInterno(pacId);
                        console.log("[Atividades] Usuário interno para", pacId, ":", usuario);
                        return {
                            id: pacId,
                            nome:
                                usuario?.name ??
                                usuario?.nome ??
                                usuario?.email ??
                                `Paciente (${pacId})`,
                        };
                    } catch (e) {
                        console.error("[Atividades] Erro ao buscar usuário interno:", pacId, e.message);
                        return { id: pacId, nome: `Paciente (${pacId})` };
                    }
                })
            );

            const semNulos = pacientesResolvidos.filter(Boolean);
            const semDuplicatas = semNulos.filter(
                (p, idx, arr) => arr.findIndex((x) => String(x.id) === String(p.id)) === idx
            );

            console.log("[Atividades] Pacientes resolvidos:", semDuplicatas);
            setPacientes(semDuplicatas);
        } catch (e) {
            console.error("[Atividades] Erro ao buscar vínculos:", e.message);
            setErro(`Erro ao carregar pacientes: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleSalvar() {
        if (!form.pacienteId || !form.texto.trim()) {
            setErro("Preencha o paciente e a descrição da atividade.");
            return;
        }
        setSalvando(true);
        setErro("");
        try {
            const psicologoId = user?.id ?? user?.sub ?? user?.userId;
            await atividadeService.criar({
                pacienteId: form.pacienteId,
                texto: form.texto,
                dataEntrega: form.dataEntrega
                    ? new Date(form.dataEntrega).toISOString()
                    : null,
                status: 0,
                estaConcluida: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            setForm({ pacienteId: "", texto: "", dataEntrega: "" });
            setShowForm(false);
            await carregarDados();
        } catch (e) {
            console.error("[Atividades] Erro ao criar:", e.message);
            setErro(`Erro ao criar atividade: ${e.message}`);
        } finally {
            setSalvando(false);
        }
    }

    async function handleToggle(atv) {
        const novoStatus = atv.status === 0 ? 1 : 0;
        setAtividades((prev) =>
            prev.map((a) => (a.id === atv.id ? { ...a, status: novoStatus } : a))
        );
        try {
            await atividadeService.atualizar(atv.id, { ...atv, status: novoStatus });
        } catch {
            setAtividades((prev) => prev.map((a) => (a.id === atv.id ? atv : a)));
        }
    }

    async function handleDeletar(id) {
        setAtividades((prev) => prev.filter((a) => a.id !== id));
        try {
            await atividadeService.deletar(id);
        } catch {
            await carregarDados();
        }
    }

    function getNomePaciente(pacienteId) {
        const p = pacientes.find((p) => String(p.id) === String(pacienteId));
        return p?.nome ?? "Paciente";
    }

    function formatarData(dateStr) {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        const diff = (d - hoje) / 86400000;
        if (diff === 0) return { label: "entrega: hoje", urgente: true };
        if (diff < 0)
            return {
                label: `entregue: ${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`,
                urgente: false,
            };
        return {
            label: `entrega: ${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`,
            urgente: false,
        };
    }

    const pendentes = atividades.filter((a) => a.status === 0);
    const concluidas = atividades.filter((a) => a.status === 1);

    return (
        <div className="atv-psi-page">
            <NavbarPsicologo />

            <main className="atv-psi-main">
                <div className="atv-psi-header">
                    <div>
                        <h1 className="atv-psi-titulo">Atividades</h1>
                        <p className="atv-psi-subtitulo">Gerencie as atividades dos seus pacientes</p>
                    </div>
                    <button
                        className="atv-psi-btn-nova"
                        onClick={() => { setShowForm(true); setErro(""); }}
                    >
                        + Nova Atividade
                    </button>
                </div>

                {showForm && (
                    <div className="atv-psi-form-card">
                        <h2 className="atv-psi-form-titulo">Nova Atividade</h2>

                        <label className="atv-psi-label">Paciente</label>
                        <select
                            className="atv-psi-select"
                            value={form.pacienteId}
                            onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
                        >
                            <option value="">Selecione um paciente</option>
                            {pacientes.length === 0 && (
                                <option disabled>Nenhum paciente vinculado</option>
                            )}
                            {pacientes.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome}
                                </option>
                            ))}
                        </select>

                        <label className="atv-psi-label">Descrição da Atividade</label>
                        <textarea
                            className="atv-psi-textarea"
                            placeholder="Descreva a atividade..."
                            value={form.texto}
                            onChange={(e) => setForm({ ...form, texto: e.target.value })}
                        />

                        <label className="atv-psi-label">Data da Entrega</label>
                        <input
                            type="date"
                            className="atv-psi-input"
                            value={form.dataEntrega}
                            onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })}
                        />

                        {erro && <p className="atv-psi-erro">{erro}</p>}

                        <div className="atv-psi-form-acoes">
                            <button
                                className="atv-psi-btn-cancelar"
                                onClick={() => { setShowForm(false); setErro(""); }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="atv-psi-btn-salvar"
                                onClick={handleSalvar}
                                disabled={salvando}
                            >
                                {salvando ? "Salvando..." : "Salvar Atividade"}
                            </button>
                        </div>
                    </div>
                )}

                {erro && !showForm && <p className="atv-psi-erro">{erro}</p>}

                {erroAtividades && (
                    <p className="atv-psi-erro" style={{ opacity: 0.75, fontSize: "0.85rem" }}>
                        ⚠️ {erroAtividades}
                    </p>
                )}

                {loading ? (
                    <p className="atv-psi-vazio">Carregando...</p>
                ) : (
                    <>
                        {pendentes.map((atv) => (
                            <CardAtividade
                                key={atv.id}
                                atv={atv}
                                nomePaciente={getNomePaciente(atv.pacienteId)}
                                dateInfo={formatarData(atv.dataEntrega)}
                                onToggle={() => handleToggle(atv)}
                                onDeletar={() => handleDeletar(atv.id)}
                            />
                        ))}

                        {concluidas.length > 0 && (
                            <>
                                <h3 className="atv-psi-secao">Concluídas</h3>
                                {concluidas.map((atv) => (
                                    <CardAtividade
                                        key={atv.id}
                                        atv={atv}
                                        nomePaciente={getNomePaciente(atv.pacienteId)}
                                        dateInfo={formatarData(atv.dataEntrega)}
                                        onToggle={() => handleToggle(atv)}
                                        onDeletar={() => handleDeletar(atv.id)}
                                        concluida
                                    />
                                ))}
                            </>
                        )}

                        {atividades.length === 0 && !erroAtividades && (
                            <p className="atv-psi-vazio">Nenhuma atividade cadastrada ainda.</p>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

function CardAtividade({ atv, nomePaciente, dateInfo, onToggle, onDeletar, concluida }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className={`atv-psi-card ${concluida ? "concluida" : ""} ${hovered ? "hovered" : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button
                className={`atv-psi-checkbox ${concluida ? "checked" : ""}`}
                onClick={onToggle}
                title={concluida ? "Marcar como pendente" : "Marcar como concluída"}
            >
                {concluida && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3.5 3.5 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            <div className="atv-psi-card-body">
                <p className={`atv-psi-card-texto ${concluida ? "riscado" : ""}`}>
                    {atv.texto}
                </p>
                <div className="atv-psi-card-meta">
                    <span className="atv-psi-paciente-nome">{nomePaciente}</span>
                    {dateInfo && (
                        <span className={`atv-psi-data ${dateInfo.urgente ? "urgente" : ""}`}>
                            {dateInfo.urgente && (
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M6.5 1L12 11.5H1L6.5 1Z" fill="#E8593C" />
                                    <path d="M6.5 5v3M6.5 9.5v.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            )}
                            {dateInfo.label}
                        </span>
                    )}
                </div>
            </div>

            {hovered && (
                <button className="atv-psi-btn-deletar" onClick={onDeletar} title="Remover">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}
        </div>
    );
}