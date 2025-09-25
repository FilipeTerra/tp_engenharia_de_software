from app.infra.database import Base, engine
from app.adapters.repository.sqlite_repository import ArtigoModel, EventoModel, EdicaoEventoModel

def init_db():
    print("Criando tabelas no banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso.")

if __name__ == "__main__":
    init_db()