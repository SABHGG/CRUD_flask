from sqlalchemy import String, Integer, Column, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

class Base(DeclarativeBase):
    pass

class Baul(Base):
    __tablename__ = 'baul'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    plataforma: Mapped[str] = mapped_column(String(50), nullable=False)
    usuario: Mapped[str] = mapped_column(String(50), nullable=False)
    clave: Mapped[str] = mapped_column(String(50), nullable=False)
    __table_args__ = (UniqueConstraint('plataforma', 'usuario'),)
    
    def __repr__(self):
        return f'Baul({self.id!r}, {self.plataforma!r}, {self.usuario!r}, {self.clave!r})'
    