from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from . import models, schemas


def list_tags(db: Session) -> list[models.Tag]:
    return list(db.scalars(select(models.Tag).order_by(models.Tag.created_at.desc(), models.Tag.id.desc())))


def get_tag(db: Session, tag_id: int) -> models.Tag | None:
    return db.get(models.Tag, tag_id)


def get_tag_by_name(db: Session, name: str) -> models.Tag | None:
    return db.scalar(select(models.Tag).where(func.lower(models.Tag.name) == name.lower()))


def create_tag(db: Session, payload: schemas.TagCreate) -> models.Tag:
    tag = models.Tag(name=payload.name.strip(), color=payload.color)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def delete_tag(db: Session, tag: models.Tag) -> None:
    db.delete(tag)
    db.commit()


def _load_tags(db: Session, tag_ids: list[int]) -> list[models.Tag]:
    if not tag_ids:
        return []
    unique_ids = list(dict.fromkeys(tag_ids))
    return list(db.scalars(select(models.Tag).where(models.Tag.id.in_(unique_ids))))


def list_questions(db: Session, tag_ids: list[int] | None = None) -> list[models.Question]:
    stmt = select(models.Question).options(selectinload(models.Question.tags))
    if tag_ids:
        unique_ids = list(dict.fromkeys(tag_ids))
        subquery = (
            select(models.question_tags.c.question_id)
            .where(models.question_tags.c.tag_id.in_(unique_ids))
            .group_by(models.question_tags.c.question_id)
            .having(func.count(func.distinct(models.question_tags.c.tag_id)) == len(unique_ids))
        )
        stmt = stmt.where(models.Question.id.in_(subquery))
    stmt = stmt.order_by(models.Question.updated_at.desc(), models.Question.id.desc())
    return list(db.scalars(stmt))


def get_question(db: Session, question_id: int) -> models.Question | None:
    return db.scalar(
        select(models.Question)
        .options(selectinload(models.Question.tags))
        .where(models.Question.id == question_id)
    )


def create_question(db: Session, payload: schemas.QuestionCreate) -> models.Question:
    question = models.Question(
        title=payload.title.strip(),
        question=payload.question.strip(),
        answer=payload.answer,
        note=payload.note,
        source=payload.source,
        tags=_load_tags(db, payload.tag_ids),
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return get_question(db, question.id) or question


def update_question(db: Session, question: models.Question, payload: schemas.QuestionUpdate) -> models.Question:
    question.title = payload.title.strip()
    question.question = payload.question.strip()
    question.answer = payload.answer
    question.note = payload.note
    question.source = payload.source
    question.tags = _load_tags(db, payload.tag_ids)
    db.commit()
    db.refresh(question)
    return get_question(db, question.id) or question


def delete_question(db: Session, question: models.Question) -> None:
    db.delete(question)
    db.commit()
