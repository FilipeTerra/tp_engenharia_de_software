// Definição do tipo para um Evento
export interface Evento {
    id?: number;
    nome: string;
    sigla?: string | null;
    descricao?: string | null;
    site_oficial?: string | null;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/eventos';

// Função para listar todos os eventos
export const listarEventos = async (): Promise<Evento[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
    }
    return response.json();
};

// Função para criar um novo evento
export const criarEvento = async (data: Omit<Evento, 'id'>): Promise<Evento> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Erro ao criar evento');
    }
    return response.json();
};

// Função para atualizar um evento existente
export const atualizarEvento = async (id: number, data: Evento): Promise<Evento> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Erro ao atualizar evento');
    }
    return response.json();
};

// Função para deletar um evento
export const deletarEvento = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Erro ao deletar evento');
    }
};
