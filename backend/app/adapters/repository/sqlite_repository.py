# File: backend/app/adapters/repositories/sqlite_artigo_repository.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String

# Importações da Arquitetura Limpa
from app.domain.entities.artigo import Artigo as ArtigoEntity
from app.domain.repositories.i_artigo_repository import IArtigoRepository
from app.domain.entities.evento import Evento as EventoEntity
from app.domain.repositories.i_evento_repository import IEventoRepository
from app.domain.entities.edicao_evento import EdicaoEvento as EdicaoEventoEntity
from app.domain.repositories.i_edicao_evento_repository import IEdicaoEventoRepository
from app.infra.database import Base

# 1. MODELO DA TABELA (SQLAlchemy)
# Esta classe define a estrutura da tabela 'artigos' no banco de dados,
# espelhando todos os campos da sua entidade 'Artigo'.
class ArtigoModel(Base):
    __tablename__ = 'artigos'

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    ano = Column(Integer, nullable=True)
    doi = Column(String, unique=True, index=True, nullable=True)
    caminho_pdf = Column(String, nullable=True)
    id_edicao = Column(Integer, nullable=False)
    
    # Metadados de publicação
    journal = Column(String, nullable=True)
    volume = Column(String, nullable=True)
    numero = Column(String, nullable=True)
    paginas = Column(String, nullable=True)
    publicador = Column(String, nullable=True)


# 2. IMPLEMENTAÇÃO DO REPOSITÓRIO
# Esta classe implementa a lógica para interagir com a tabela 'artigos'.
class SQLiteArtigoRepository(IArtigoRepository):
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def _to_entity(self, model: ArtigoModel) -> ArtigoEntity:
        """Converte um modelo SQLAlchemy para uma entidade de domínio Pydantic."""
        return ArtigoEntity.from_orm(model)

    def save(self, artigo: ArtigoEntity) -> ArtigoEntity:
        """
        Salva um novo artigo. O mapeamento aqui inclui todos os campos
        da entidade para o modelo do banco de dados.
        """
        artigo_model = ArtigoModel(
            titulo=artigo.titulo,
            ano=artigo.ano,
            doi=artigo.doi,
            caminho_pdf=artigo.caminho_pdf,
            id_edicao=artigo.id_edicao,
            journal=artigo.journal,
            volume=artigo.volume,
            numero=artigo.numero,
            paginas=artigo.paginas,
            publicador=artigo.publicador
        )
        self.db_session.add(artigo_model)
        self.db_session.commit()
        self.db_session.refresh(artigo_model)
        return self._to_entity(artigo_model)

    def find_by_id(self, artigo_id: int) -> Optional[ArtigoEntity]:
        model = self.db_session.query(ArtigoModel).filter(ArtigoModel.id == artigo_id).first()
        return self._to_entity(model) if model else None

    def find_by_titulo(self, titulo: str) -> List[ArtigoEntity]:
        query_result = self.db_session.query(ArtigoModel).filter(ArtigoModel.titulo.contains(titulo)).all()
        return [self._to_entity(artigo) for artigo in query_result]

    def find_by_autor_id(self, autor_id: int) -> List[ArtigoEntity]:
        # A lógica real aqui exigiria um relacionamento/join com a tabela de autores.
        print(f"Placeholder: Lógica para buscar artigos do autor {autor_id} a ser implementada.")
        return []

    def find_by_edicao_id(self, edicao_id: int) -> List[ArtigoEntity]:
        query_result = self.db_session.query(ArtigoModel).filter(ArtigoModel.id_edicao == edicao_id).all()
        return [self._to_entity(artigo) for artigo in query_result]

    def find_all(self) -> List[ArtigoEntity]:
        query_result = self.db_session.query(ArtigoModel).all()
        return [self._to_entity(artigo) for artigo in query_result]

    def delete(self, artigo_id: int) -> None:
        model = self.db_session.query(ArtigoModel).filter(ArtigoModel.id == artigo_id).first()
        if model:
            self.db_session.delete(model)
            self.db_session.commit()


# 3. MODELO DA TABELA (SQLAlchemy) - Evento
class EventoModel(Base):
    __tablename__ = 'eventos'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    sigla = Column(String, unique=True, index=True, nullable=True)
    descricao = Column(String, nullable=True)
    site_oficial = Column(String, nullable=True)
    entidade_promotora = Column(String, nullable=True)


# 4. IMPLEMENTAÇÃO DO REPOSITÓRIO - Evento
class SQLiteEventoRepository(IEventoRepository):
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def _to_entity(self, model: EventoModel) -> EventoEntity:
        """Converte um modelo SQLAlchemy para uma entidade de domínio Pydantic."""
        return EventoEntity.from_orm(model)

    def save(self, evento: EventoEntity) -> EventoEntity:
        """
        Salva um novo evento. O mapeamento aqui inclui todos os campos
        da entidade para o modelo do banco de dados.
        """
        evento_model = EventoModel(
            id=evento.id,
            nome=evento.nome,
            sigla=evento.sigla,
            descricao=evento.descricao,
            site_oficial=str(evento.site_oficial) if evento.site_oficial else None,
            entidade_promotora=evento.entidade_promotora
        )
        if evento.id:
            self.db_session.merge(evento_model)
        else:
            self.db_session.add(evento_model)

        self.db_session.commit()
        self.db_session.refresh(evento_model)
        return self._to_entity(evento_model)

    def find_by_id(self, evento_id: int) -> Optional[EventoEntity]:
        model = self.db_session.query(EventoModel).filter(EventoModel.id == evento_id).first()
        return self._to_entity(model) if model else None

    def find_by_sigla(self, sigla: str) -> Optional[EventoEntity]:
        model = self.db_session.query(EventoModel).filter(EventoModel.sigla == sigla).first()
        return self._to_entity(model) if model else None

    def find_by_nome(self, nome: str) -> List[EventoEntity]:
        query_result = self.db_session.query(EventoModel).filter(EventoModel.nome.contains(nome)).all()
        return [self._to_entity(evento) for evento in query_result]

    def find_all(self) -> List[EventoEntity]:
        query_result = self.db_session.query(EventoModel).all()
        return [self._to_entity(evento) for evento in query_result]

    def delete(self, evento_id: int) -> None:
        model = self.db_session.query(EventoModel).filter(EventoModel.id == evento_id).first()
        if model:
            self.db_session.delete(model)
            self.db_session.commit()

    def update(self, evento: EventoEntity) -> EventoEntity:
        evento_model = self.db_session.query(EventoModel).filter(EventoModel.id == evento.id).first()
        if evento_model:
            evento_model.nome = evento.nome
            evento_model.sigla = evento.sigla
            evento_model.descricao = evento.descricao
            evento_model.site_oficial = evento.site_oficial
            evento_model.entidade_promotora = evento.entidade_promotora
            self.db_session.commit()
            self.db_session.refresh(evento_model)
            return self._to_entity(evento_model)
        return None # Ou lançar uma exceção


# 5. MODELO DA TABELA (SQLAlchemy) - EdicaoEvento
class EdicaoEventoModel(Base):
    __tablename__ = 'edicoes_evento'

    id = Column(Integer, primary_key=True, index=True)
    ano = Column(Integer, nullable=False)
    local = Column(String, nullable=True)
    id_evento = Column(Integer, nullable=False)


# 6. IMPLEMENTAÇÃO DO REPOSITÓRIO - EdicaoEvento
class SQLiteEdicaoEventoRepository(IEdicaoEventoRepository):
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def _to_entity(self, model: EdicaoEventoModel) -> EdicaoEventoEntity:
        """Converte um modelo SQLAlchemy para uma entidade de domínio Pydantic."""
        return EdicaoEventoEntity.from_orm(model)

    def save(self, edicao_evento: EdicaoEventoEntity) -> EdicaoEventoEntity:
        """Salva uma nova edição de evento."""
        edicao_model = EdicaoEventoModel(
            ano=edicao_evento.ano,
            local=edicao_evento.local,
            id_evento=edicao_evento.id_evento
        )
        self.db_session.add(edicao_model)
        self.db_session.commit()
        self.db_session.refresh(edicao_model)
        return self._to_entity(edicao_model)

    def find_by_id(self, edicao_id: int) -> Optional[EdicaoEventoEntity]:
        model = self.db_session.query(EdicaoEventoModel).filter(EdicaoEventoModel.id == edicao_id).first()
        return self._to_entity(model) if model else None

    def find_by_evento_id(self, evento_id: int) -> List[EdicaoEventoEntity]:
        query_result = self.db_session.query(EdicaoEventoModel).filter(EdicaoEventoModel.id_evento == evento_id).all()
        return [self._to_entity(edicao) for edicao in query_result]

    def delete(self, edicao_id: int) -> None:
        model = self.db_session.query(EdicaoEventoModel).filter(EdicaoEventoModel.id == edicao_id).first()
        if model:
            self.db_session.delete(model)
            self.db_session.commit()

    def update(self, edicao_evento: EdicaoEventoEntity) -> EdicaoEventoEntity:
        edicao_model = self.db_session.query(EdicaoEventoModel).filter(EdicaoEventoModel.id == edicao_evento.id).first()
        if edicao_model:
            edicao_model.ano = edicao_evento.ano
            edicao_model.local = edicao_evento.local
            self.db_session.commit()
            self.db_session.refresh(edicao_model)
            return self._to_entity(edicao_model)
        return None