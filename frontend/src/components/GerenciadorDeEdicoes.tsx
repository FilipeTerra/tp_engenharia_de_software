import React, { useState, useEffect, FC, FormEvent } from 'react';
import {
    EdicaoEvento,
    EdicaoEventoCreate,
    EdicaoEventoUpdate,
    listarEdicoesPorEvento,
    criarEdicao,
    atualizarEdicao,
    deletarEdicao,
} from '../services/edicaoApiService';

// Props do componente
interface GerenciadorDeEdicoesProps {
    eventoId: number;
}

// Tipo para o estado de notificação
type Notification = {
    message: string;
    type: 'success' | 'error' | '';
};

const GerenciadorDeEdicoes: FC<GerenciadorDeEdicoesProps> = ({ eventoId }) => {
    const [edicoes, setEdicoes] = useState<EdicaoEvento[]>([]);
    const [novaEdicao, setNovaEdicao] = useState<EdicaoEventoCreate>({ ano: new Date().getFullYear(), local: '' });
    const [editingEdicao, setEditingEdicao] = useState<EdicaoEvento | null>(null);
    const [notification, setNotification] = useState<Notification>({ message: '', type: '' });

    // Buscar edições ao montar o componente ou quando o eventoId mudar
    useEffect(() => {
        const fetchEdicoes = async () => {
            try {
                const data = await listarEdicoesPorEvento(eventoId);
                setEdicoes(data);
            } catch (error) {
                console.error('Erro ao buscar edições:', error);
                showNotification('Não foi possível carregar as edições.', 'error');
            }
        };
        fetchEdicoes();
    }, [eventoId]);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const handleCriarEdicao = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const edicaoCriada = await criarEdicao(eventoId, novaEdicao);
            setEdicoes([...edicoes, edicaoCriada]);
            setNovaEdicao({ ano: new Date().getFullYear(), local: '' });
            showNotification('Edição criada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao criar edição:', error);
            showNotification('Erro ao criar edição.', 'error');
        }
    };

    const handleAtualizarEdicao = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingEdicao || !editingEdicao.id) return;

        try {
            const edicaoAtualizada = await atualizarEdicao(editingEdicao.id, {
                ano: editingEdicao.ano,
                local: editingEdicao.local,
            });
            setEdicoes(edicoes.map(ed => (ed.id === edicaoAtualizada.id ? edicaoAtualizada : ed)));
            closeEditModal();
            showNotification('Edição atualizada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar edição:', error);
            showNotification('Erro ao atualizar edição.', 'error');
        }
    };

    const handleDeletarEdicao = async (id: number) => {
        if (window.confirm('Tem certeza que deseja deletar esta edição?')) {
            try {
                await deletarEdicao(id);
                setEdicoes(edicoes.filter(ed => ed.id !== id));
                showNotification('Edição deletada com sucesso.', 'success');
            } catch (error) {
                console.error('Erro ao deletar edição:', error);
                showNotification('Erro ao deletar edição.', 'error');
            }
        }
    };

    const openEditModal = (edicao: EdicaoEvento) => setEditingEdicao(edicao);
    const closeEditModal = () => setEditingEdicao(null);

    return (
        <div className="p-4 bg-base-200 rounded-box">
            <h3 className="text-xl font-bold mb-4">Gerenciar Edições do Evento</h3>

            {/* Notificação */}
            {notification.message && (
                <div role="alert" className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Formulário para Nova Edição */}
            <form onSubmit={handleCriarEdicao} className="mb-6 flex items-end gap-4">
                <div className="form-control">
                    <label className="label"><span className="label-text">Ano</span></label>
                    <input
                        type="number"
                        placeholder="Ano"
                        className="input input-bordered"
                        value={novaEdicao.ano}
                        onChange={(e) => setNovaEdicao({ ...novaEdicao, ano: parseInt(e.target.value) })}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">Local</span></label>
                    <input
                        type="text"
                        placeholder="Local do evento"
                        className="input input-bordered"
                        value={novaEdicao.local || ''}
                        onChange={(e) => setNovaEdicao({ ...novaEdicao, local: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Adicionar Edição</button>
            </form>

            {/* Tabela de Edições */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Ano</th>
                            <th>Local</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {edicoes.map((edicao) => (
                            <tr key={edicao.id}>
                                <td>{edicao.ano}</td>
                                <td>{edicao.local}</td>
                                <td>
                                    <button onClick={() => openEditModal(edicao)} className="btn btn-sm btn-info mr-2">Editar</button>
                                    <button onClick={() => handleDeletarEdicao(edicao.id!)} className="btn btn-sm btn-error">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edição */}
            <dialog className="modal" open={!!editingEdicao}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Editar Edição</h3>
                    {editingEdicao && (
                        <form onSubmit={handleAtualizarEdicao}>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Ano</span></label>
                                <input type="number" className="input input-bordered" value={editingEdicao.ano} onChange={(e) => setEditingEdicao({...editingEdicao, ano: parseInt(e.target.value)})} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Local</span></label>
                                <input type="text" className="input input-bordered" value={editingEdicao.local || ''} onChange={(e) => setEditingEdicao({...editingEdicao, local: e.target.value})} />
                            </div>
                            <div className="modal-action">
                                <button type="button" onClick={closeEditModal} className="btn">Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar</button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default GerenciadorDeEdicoes;