import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface EdicaoEvento {
    id: number;
    ano: number;
    local: string | null;
    id_evento: number;
}

export type EdicaoEventoCreate = Omit<EdicaoEvento, 'id' | 'id_evento'>;
export type EdicaoEventoUpdate = Partial<EdicaoEventoCreate>;

export const listarEdicoesPorEvento = async (eventoId: number): Promise<EdicaoEvento[]> => {
    const response = await axios.get(`${API_URL}/eventos/${eventoId}/edicoes/`);
    return response.data;
};

export const criarEdicao = async (eventoId: number, data: EdicaoEventoCreate): Promise<EdicaoEvento> => {
    const response = await axios.post(`${API_URL}/eventos/${eventoId}/edicoes/`, data);
    return response.data;
};

export const atualizarEdicao = async (edicaoId: number, data: EdicaoEventoUpdate): Promise<EdicaoEvento> => {
    const response = await axios.put(`${API_URL}/edicoes/${edicaoId}`, data);
    return response.data;
};

export const deletarEdicao = async (edicaoId: number): Promise<void> => {
    await axios.delete(`${API_URL}/edicoes/${edicaoId}`);
};