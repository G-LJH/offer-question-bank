from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


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
    question: str
    answer: str | None
    note: str | None
    source: str | None
    created_at: datetime
    updated_at: datetime
    tags: list[TagRead] = []

    model_config = ConfigDict(from_attributes=True)


class BulkQuestionItem(BaseModel):
    question: str = Field(
        min_length=1,
        validation_alias=AliasChoices("question", "题目"),
    )
    answer: str | None = Field(default="", validation_alias=AliasChoices("answer", "答案"))
    note: str | None = Field(default="", validation_alias=AliasChoices("note", "笔记"))
    source: str | None = Field(default="批量导入", validation_alias=AliasChoices("source", "来源"))
    tags: list[str] = Field(default=[], validation_alias=AliasChoices("tags", "标签"))

    model_config = ConfigDict(populate_by_name=True)


class BulkQuestionCreate(BaseModel):
    items: list[BulkQuestionItem] = Field(min_length=1)


class BulkQuestionResult(BaseModel):
    created_count: int
    created_tag_count: int
    questions: list[QuestionRead]
