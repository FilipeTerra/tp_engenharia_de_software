from typing import Optional
from pydantic import BaseModel, Field

class EdicaoEvento(BaseModel):
    """
    Representa uma edição específica de um evento científico em um determinado ano.
    """
    id: Optional[int] = None
    ano: int = Field(..., gt=1950, description="Ano de realização da edição")
    local: Optional[str] = Field(None, description="Local onde a edição ocorreu")
    id_evento: int = Field(..., description="ID do evento pai ao qual esta edição pertence")
    
    class Config:
        from_attributes = True


class EdicaoEventoCreate(BaseModel):
    ano: int = Field(..., gt=1950, description="Ano de realização da edição")
    local: Optional[str] = Field(None, description="Local onde a edição ocorreu")


class EdicaoEventoUpdate(BaseModel):
    ano: Optional[int] = Field(None, gt=1950, description="Ano de realização da edição")
    local: Optional[str] = Field(None, description="Local onde a edição ocorreu")