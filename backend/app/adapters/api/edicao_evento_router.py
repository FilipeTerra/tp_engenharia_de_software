from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.domain.entities.edicao_evento import EdicaoEvento, EdicaoEventoCreate, EdicaoEventoUpdate
from app.domain.repositories.i_edicao_evento_repository import IEdicaoEventoRepository
from app.infra.dependencies import get_edicao_evento_repository

router = APIRouter(
    prefix="/api",
    tags=["Edições de Eventos"],
)

@router.post("/eventos/{evento_id}/edicoes/", response_model=EdicaoEvento, status_code=status.HTTP_201_CREATED)
def create_edicao_evento(
    evento_id: int,
    edicao_data: EdicaoEventoCreate,
    repo: IEdicaoEventoRepository = Depends(get_edicao_evento_repository),
):
    edicao_evento = EdicaoEvento(**edicao_data.model_dump(), id_evento=evento_id)
    return repo.save(edicao_evento)

@router.get("/eventos/{evento_id}/edicoes/", response_model=List[EdicaoEvento])
def get_edicoes_by_evento(
    evento_id: int,
    repo: IEdicaoEventoRepository = Depends(get_edicao_evento_repository),
):
    return repo.find_by_evento_id(evento_id)

@router.put("/edicoes/{edicao_id}", response_model=EdicaoEvento)
def update_edicao_evento(
    edicao_id: int,
    edicao_data: EdicaoEventoUpdate,
    repo: IEdicaoEventoRepository = Depends(get_edicao_evento_repository),
):
    existing_edicao = repo.find_by_id(edicao_id)
    if not existing_edicao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Edição de evento não encontrada",
        )

    update_data = edicao_data.model_dump(exclude_unset=True)
    updated_edicao_entity = existing_edicao.model_copy(update=update_data)

    updated_edicao = repo.update(updated_edicao_entity)

    if not updated_edicao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Edição de evento não encontrada ao tentar atualizar.",
        )
    return updated_edicao

@router.delete("/edicoes/{edicao_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_edicao_evento(
    edicao_id: int,
    repo: IEdicaoEventoRepository = Depends(get_edicao_evento_repository),
):
    repo.delete(edicao_id)