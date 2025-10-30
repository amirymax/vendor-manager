from sqlalchemy.orm import Session
from . import models, schemas


def create_vendor(db: Session, data: schemas.VendorCreate) -> models.Vendor:
    vendor = models.Vendor(
        name=data.name,
        contact_email=data.contact_email,
        category=data.category,
        rating=data.rating,
    )
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor


def list_vendors(db: Session) -> list[models.Vendor]:
    return db.query(models.Vendor).order_by(models.Vendor.id.desc()).all()


def update_vendor(db: Session, vendor_id: int, data: schemas.VendorUpdate) -> models.Vendor | None:
    vendor = db.query(models.Vendor).filter(models.Vendor.id == vendor_id).first()
    if not vendor:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vendor, field, value)

    db.commit()
    db.refresh(vendor)
    return vendor
