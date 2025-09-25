from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.domain.entities.evento import Evento
from app.domain.repositories.i_evento_repository import IEventoRepository
from app.infra.dependencies import get_evento_repository

router = APIRouter(
    prefix="/eventos",
    tags=["Eventos"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Evento, status_code=status.HTTP_201_CREATED)
def create_evento(
    evento: Evento,
    repo: IEventoRepository = Depends(get_evento_repository)
):
    """
    Cria um novo evento.
    """
    created_evento = repo.save(evento)
    return created_evento

@router.get("/", response_model=List[Evento])
def read_eventos(
    repo: IEventoRepository = Depends(get_evento_repository)
):
    """
    Retorna uma lista de todos os eventos.
    """
    return repo.find_all()

@router.put("/{evento_id}", response_model=Evento)
def update_evento(
    evento_id: int,
    evento: Evento,
    repo: IEventoRepository = Depends(get_evento_repository)
):
    """
    Atualiza um evento existente.
    """
    db_evento = repo.find_by_id(evento_id)
    if db_evento is None:
        raise HTTPException(status_code=404, detail="Evento not found")

    # Assegura que o ID no corpo da requisição, se fornecido, corresponde ao da URL
    if evento.id is not None and evento.id != evento_id:
        raise HTTPException(status_code=400, detail="ID do evento no corpo não corresponde ao ID na URL")

    evento.id = evento_id # Garante que o ID correto seja usado na atualização
    updated_evento = repo.save(evento)
    return updated_evento

@router.delete("/{evento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_evento(
    evento_id: int,
    repo: IEventoRepository = Depends(get_evento_repository)
):
    """
    Deleta um evento.
    """
    db_evento = repo.find_by_id(evento_id)
    if db_evento is None:
        raise HTTPException(status_code=404, detail="Evento not found")
    repo.delete(evento_id)
    return
