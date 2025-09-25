from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.adapters.api import artigo_router, evento_router, edicao_evento_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION
)

# 2. Defina as origens permitidas (neste caso, seu servidor de dev do frontend)
origins = [
    "http://localhost:5173",
]

# 3. Adicione o middleware ao seu aplicativo
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"], # Permite todos os cabeçalhos
)

app.include_router(artigo_router.router, prefix="/api")
app.include_router(evento_router.router, prefix="/api")
app.include_router(edicao_evento_router.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": f"Bem-vindo à {settings.PROJECT_NAME}!"}