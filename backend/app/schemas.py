from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TagBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    color: str = "#2563eb"


class TagCreate(TagBase):
    pass


class TagRead(TagBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuestionBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    question: str = Field(min_length=1)
    answer: str | None = ""
    note: str | None = ""
    source: str | None = ""
    tag_ids: list[int] = []


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(QuestionBase):
    pass


class QuestionRead(BaseModel):
    id: int
    title: str
    question: str
    answer: str | None
    note: str | None
    source: str | None
    created_at: datetime
    updated_at: datetime
    tags: list[TagRead] = []

    model_config = ConfigDict(from_attributes=True)
