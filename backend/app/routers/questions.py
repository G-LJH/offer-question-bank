from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/questions", tags=["questions"])


def parse_tag_ids(tag_ids: str | None = Query(default=None)) -> list[int]:
    if not tag_ids:
        return []
    try:
        return [int(item) for item in tag_ids.split(",") if item.strip()]
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="tag_ids 必须是逗号分隔的数字") from exc


@router.get("", response_model=list[schemas.QuestionRead])
def read_questions(tag_ids: list[int] = Depends(parse_tag_ids), db: Session = Depends(get_db)):
    return crud.list_questions(db, tag_ids)


@router.get("/{question_id}", response_model=schemas.QuestionRead)
def read_question(question_id: int, db: Session = Depends(get_db)):
    question = crud.get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="题目不存在")
    return question


@router.post("", response_model=schemas.QuestionRead, status_code=status.HTTP_201_CREATED)
def create_question(payload: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, payload)


@router.put("/{question_id}", response_model=schemas.QuestionRead)
def update_question(question_id: int, payload: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    question = crud.get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="题目不存在")
    return crud.update_question(db, question, payload)


@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = crud.get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="题目不存在")
    crud.delete_question(db, question)
