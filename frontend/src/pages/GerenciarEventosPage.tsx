import React, { useState, useEffect, FC, FormEvent } from 'react';
import {
    listarEventos,
    criarEvento,
    atualizarEvento,
    deletarEvento,
    Evento
} from '../services/eventoApiService';

// Tipo para o estado de notificação
type Notification = {
    message: string;
    type: 'success' | 'error' | '';
};

const GerenciarEventosPage: FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [novoEvento, setNovoEvento] = useState<Omit<Evento, 'id'>>({ nome: '', sigla: '', descricao: '', site_oficial: '' });
    const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
    
    // 1. Estado para controlar as notificações
    const [notification, setNotification] = useState<Notification>({ message: '', type: '' });

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const data = await listarEventos();
                setEventos(data);
            } catch (error) {
                console.error('Erro ao buscar eventos:', error);
                showNotification('Não foi possível carregar os eventos.', 'error');
            }
        };
        fetchEventos();
    }, []);

    // Função para exibir uma notificação e limpá-la após 3 segundos
    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    const handleCriarEvento = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const eventoCriado = await criarEvento(novoEvento);
            setEventos([...eventos, eventoCriado]);
            setNovoEvento({ nome: '', sigla: '', descricao: '', site_oficial: '' }); // Limpa o formulário
            showNotification('Salvo com Sucesso', 'success'); // 2. Mensagem de sucesso
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
            showNotification(`Não foi possível salvar. Erro: ${errorMsg}`, 'error'); // 3. Mensagem de erro
        }
    };

    const handleAtualizarEvento = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingEvento || !editingEvento.id) return;

        try {
            const eventoAtualizado = await atualizarEvento(editingEvento.id, editingEvento);
            setEventos(eventos.map(e => (e.id === eventoAtualizado.id ? eventoAtualizado : e)));
            closeEditModal();
            showNotification('Salvo com Sucesso', 'success'); // 2. Mensagem de sucesso
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
            showNotification(`Não foi possível salvar. Erro: ${errorMsg}`, 'error'); // 3. Mensagem de erro
        }
    };

    const handleDeletarEvento = async (id: number) => {
        if (window.confirm('Tem certeza que deseja deletar este evento?')) {
            try {
                await deletarEvento(id);
                setEventos(eventos.filter(evento => evento.id !== id));
                showNotification('Evento deletado com sucesso.', 'success');
            } catch (error) {
                console.error('Erro ao deletar evento:', error);
                const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
                showNotification(`Não foi possível deletar. Erro: ${errorMsg}`, 'error');
            }
        }
    };

    const openEditModal = (evento: Evento) => setEditingEvento(evento);
    const closeEditModal = () => setEditingEvento(null);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciar Eventos</h1>

            {/* 4. Componente de Notificação */}
            {notification.message && (
                <div role="alert" className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Formulário para Criar Novo Evento */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title">Criar Novo Evento</h2>
                    <form onSubmit={handleCriarEvento}>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Nome do Evento</span></label>
                            <input type="text" placeholder="Nome" className="input input-bordered" value={novoEvento.nome} onChange={(e) => setNovoEvento({...novoEvento, nome: e.target.value})} required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Sigla</span></label>
                            <input type="text" placeholder="Sigla" className="input input-bordered" value={novoEvento.sigla || ''} onChange={(e) => setNovoEvento({...novoEvento, sigla: e.target.value})} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Descrição</span></label>
                            <textarea placeholder="Descrição" className="textarea textarea-bordered" value={novoEvento.descricao || ''} onChange={(e) => setNovoEvento({...novoEvento, descricao: e.target.value})} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Site Oficial</span></label>
                            <input type="url" placeholder="https://example.com" className="input input-bordered" value={novoEvento.site_oficial || ''} onChange={(e) => setNovoEvento({...novoEvento, site_oficial: e.target.value})} />
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
                    {/* ... O conteúdo da tabela continua o mesmo ... */}
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
            <dialog className="modal" open={!!editingEvento}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Editar Evento</h3>
                    {editingEvento && (
                        <form onSubmit={handleAtualizarEvento}>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Nome</span></label>
                                <input type="text" className="input input-bordered" value={editingEvento.nome} onChange={(e) => setEditingEvento({...editingEvento, nome: e.target.value})} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Sigla</span></label>
                                <input type="text" className="input input-bordered" value={editingEvento.sigla || ''} onChange={(e) => setEditingEvento({...editingEvento, sigla: e.target.value})} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Descrição</span></label>
                                <textarea className="textarea textarea-bordered" value={editingEvento.descricao || ''} onChange={(e) => setEditingEvento({...editingEvento, descricao: e.target.value})} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Site Oficial</span></label>
                                <input type="url" className="input input-bordered" value={editingEvento.site_oficial || ''} onChange={(e) => setEditingEvento({...editingEvento, site_oficial: e.target.value})} />
                            </div>
                            <div className="modal-action">
                                <button type="button" onClick={closeEditModal} className="btn">Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default GerenciarEventosPage;