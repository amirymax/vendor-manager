from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .db import get_db
from . import schemas, crud

router = APIRouter(prefix="/api/vendors", tags=["vendors"])


@router.post("", response_model=schemas.VendorRead, status_code=status.HTTP_201_CREATED)
def create_vendor(data: schemas.VendorCreate, db: Session = Depends(get_db)):
    vendor = crud.create_vendor(db, data)
    return vendor


@router.get("", response_model=list[schemas.VendorRead])
def get_vendors(db: Session = Depends(get_db)):
    return crud.list_vendors(db)


@router.put("/{vendor_id}", response_model=schemas.VendorRead)
def update_vendor(vendor_id: int, data: schemas.VendorUpdate, db: Session = Depends(get_db)):
    vendor = crud.update_vendor(db, vendor_id, data)
    if vendor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return vendor
