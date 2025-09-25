// Definição do tipo para um Evento
export interface Evento {
    id?: number;
    nome: string;
    sigla?: string | null;
    descricao?: string | null;
    site_oficial?: string | null;
}

// CORREÇÃO 1: Remova a barra final da URL base
const API_BASE_URL = 'http://127.0.0.1:8000/api/eventos';

// Função auxiliar para extrair a mensagem de erro da resposta da API.
const getApiError = async (response: Response, defaultMessage: string): Promise<string> => {
    try {
        const errorData = await response.json();
        return errorData.detail || defaultMessage;
    } catch {
        return defaultMessage;
    }
};

// Função para listar todos os eventos
export const listarEventos = async (): Promise<Evento[]> => {
    // A chamada para listar continua funcionando, pois não adiciona /id
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
        const errorMessage = await getApiError(response, 'Erro ao buscar eventos');
        throw new Error(errorMessage);
    }
    return response.json();
};

// Função para criar um novo evento
export const criarEvento = async (data: Omit<Evento, 'id'>): Promise<Evento> => {
    const response = await fetch(`${API_BASE_URL}/`, { // Adicionamos a barra aqui para o POST
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorMessage = await getApiError(response, 'Erro ao criar evento');
        throw new Error(errorMessage);
    }
    return response.json();
};

// Função para atualizar um evento existente
export const atualizarEvento = async (id: number, data: Evento): Promise<Evento> => {
    // CORREÇÃO 2: A URL agora será formada corretamente: .../eventos/1
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorMessage = await getApiError(response, 'Erro ao atualizar evento');
        throw new Error(errorMessage);
    }
    return response.json();
};

// Função para deletar um evento
export const deletarEvento = async (id: number): Promise<void> => {
    // CORREÇÃO 3: A URL agora será formada corretamente: .../eventos/1
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorMessage = await getApiError(response, 'Erro ao deletar evento');
        throw new Error(errorMessage);
    }
};