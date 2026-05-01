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


def _question_title(question_text: str) -> str:
    first_line = question_text.strip().splitlines()[0]
    return first_line[:80] or "未命名题目"


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
    question_text = payload.question.strip()
    question = models.Question(
        title=_question_title(question_text),
        question=question_text,
        answer=payload.answer,
        note=payload.note,
        source=payload.source,
        tags=_load_tags(db, payload.tag_ids),
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return get_question(db, question.id) or question


def create_questions_bulk(db: Session, items: list[schemas.BulkQuestionItem]) -> tuple[list[models.Question], int]:
    existing_tags = {tag.name.lower(): tag for tag in db.scalars(select(models.Tag))}
    created_tag_count = 0
    questions: list[models.Question] = []

    for item in items:
        tags: list[models.Tag] = []
        for raw_name in item.tags:
            name = raw_name.strip()
            if not name:
                continue
            key = name.lower()
            tag = existing_tags.get(key)
            if not tag:
                tag = models.Tag(name=name, color="#2563eb")
                db.add(tag)
                db.flush()
                existing_tags[key] = tag
                created_tag_count += 1
            tags.append(tag)

        question_text = item.question.strip()
        question = models.Question(
            title=_question_title(question_text),
            question=question_text,
            answer=item.answer,
            note=item.note,
            source=item.source or "批量导入",
            tags=list(dict.fromkeys(tags)),
        )
        db.add(question)
        questions.append(question)

    db.commit()
    for question in questions:
        db.refresh(question)

    created_questions = [get_question(db, question.id) or question for question in questions]
    return created_questions, created_tag_count


def update_question(db: Session, question: models.Question, payload: schemas.QuestionUpdate) -> models.Question:
    question_text = payload.question.strip()
    question.title = _question_title(question_text)
    question.question = question_text
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
