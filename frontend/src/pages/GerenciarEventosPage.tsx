import React, { useState, useEffect, FC, FormEvent } from 'react';
import {
    listarEventos,
    criarEvento,
    atualizarEvento,
    deletarEvento,
    Evento
} from '../services/eventoApiService';

const GerenciarEventosPage: FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [nome, setNome] = useState('');
    const [sigla, setSigla] = useState('');
    const [descricao, setDescricao] = useState('');
    const [siteOficial, setSiteOficial] = useState('');

    const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const data = await listarEventos();
                setEventos(data);
            } catch (error) {
                console.error('Erro ao buscar eventos:', error);
            }
        };
        fetchEventos();
    }, []);

    const handleCriarEvento = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const novoEvento = await criarEvento({ nome, sigla, descricao, site_oficial: siteOficial });
            setEventos([...eventos, novoEvento]);
            setNome('');
            setSigla('');
            setDescricao('');
            setSiteOficial('');
        } catch (error) {
            console.error('Erro ao criar evento:', error);
        }
    };

    const handleDeletarEvento = async (id: number) => {
        if (window.confirm('Tem certeza que deseja deletar este evento?')) {
            try {
                await deletarEvento(id);
                setEventos(eventos.filter(evento => evento.id !== id));
            } catch (error) {
                console.error('Erro ao deletar evento:', error);
            }
        }
    };

    const openEditModal = (evento: Evento) => {
        setEditingEvento(evento);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingEvento(null);
        setIsModalOpen(false);
    };

    const handleAtualizarEvento = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingEvento) return;

        try {
            const eventoAtualizado = await atualizarEvento(editingEvento.id!, editingEvento);
            setEventos(eventos.map(e => e.id === eventoAtualizado.id ? eventoAtualizado : e));
            closeEditModal();
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
        }
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciar Eventos</h1>

            {/* Formulário para Criar Novo Evento */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title">Criar Novo Evento</h2>
                    <form onSubmit={handleCriarEvento}>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Nome do Evento</span></label>
                            <input type="text" placeholder="Nome" className="input input-bordered" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Sigla</span></label>
                            <input type="text" placeholder="Sigla" className="input input-bordered" value={sigla} onChange={(e) => setSigla(e.target.value)} />
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tabela de Eventos */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Sigla</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventos.map((evento) => (
                            <tr key={evento.id}>
                                <th>{evento.id}</th>
                                <td>{evento.nome}</td>
                                <td>{evento.sigla}</td>
                                <td>
                                    <button onClick={() => openEditModal(evento)} className="btn btn-sm btn-info mr-2">Editar</button>
                                    <button onClick={() => handleDeletarEvento(evento.id!)} className="btn btn-sm btn-error">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edição */}
            {isModalOpen && editingEvento && (
                 <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Editar Evento</h3>
                        <form onSubmit={handleAtualizarEvento}>
                             <div className="form-control">
                                <label className="label"><span className="label-text">Nome</span></label>
                                <input type="text" className="input input-bordered" value={editingEvento.nome} onChange={(e) => setEditingEvento({...editingEvento, nome: e.target.value})} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Sigla</span></label>
                                <input type="text" className="input input-bordered" value={editingEvento.sigla || ''} onChange={(e) => setEditingEvento({...editingEvento, sigla: e.target.value})} />
                            </div>
                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary">Salvar</button>
                                <button type="button" onClick={closeEditModal} className="btn">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarEventosPage;
