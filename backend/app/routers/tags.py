from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/tags", tags=["tags"])


@router.get("", response_model=list[schemas.TagRead])
def read_tags(db: Session = Depends(get_db)):
    return crud.list_tags(db)


@router.post("", response_model=schemas.TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(payload: schemas.TagCreate, db: Session = Depends(get_db)):
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="标签名不能为空")
    if crud.get_tag_by_name(db, name):
        raise HTTPException(status_code=400, detail="标签名已存在")
    payload.name = name
    return crud.create_tag(db, payload)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    tag = crud.get_tag(db, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="标签不存在")
    crud.delete_tag(db, tag)
