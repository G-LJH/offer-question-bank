from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .. import crud
from ..database import get_db
from .questions import parse_tag_ids

router = APIRouter(prefix="/api/export", tags=["export"])


def _section(title: str, content: str | None) -> str:
    return f"### {title}\n\n{content or '暂无'}\n"


@router.get("/questions.md")
def export_questions(tag_ids: list[int] = Depends(parse_tag_ids), db: Session = Depends(get_db)):
    questions = crud.list_questions(db, tag_ids)
    lines = ["# Offer 题库导出\n"]
    for item in questions:
        tag_text = " / ".join(tag.name for tag in item.tags) or "无"
        lines.extend(
            [
                f"## {item.title}\n",
                f"标签：{tag_text}\n",
                _section("问题", item.question),
                _section("答案", item.answer),
            ]
        )
        if item.note:
            lines.append(_section("笔记", item.note))
        if item.source:
            lines.append(f"来源：{item.source}\n")
    return Response(
        "\n".join(lines),
        media_type="text/markdown; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="offer-question-bank.md"'},
    )
