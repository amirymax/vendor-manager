from sqlalchemy import CheckConstraint, Integer, String, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)

    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="ck_vendor_rating_1_5"),
    )

    def __repr__(self) -> str:
        return f"Vendor(id={self.id!r}, name={self.name!r}, category={self.category!r}, rating={self.rating!r})"
