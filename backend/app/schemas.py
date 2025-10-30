from pydantic import BaseModel, EmailStr, Field, ConfigDict


class VendorBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    contact_email: EmailStr
    category: str = Field(min_length=2, max_length=50)
    rating: int = Field(ge=1, le=5)


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    contact_email: EmailStr | None = None
    category: str | None = Field(default=None, min_length=2, max_length=50)
    rating: int | None = Field(default=None, ge=1, le=5)


class VendorRead(VendorBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
