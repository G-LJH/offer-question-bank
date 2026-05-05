# Offer 题库助手

一个本地单用户求职题库管理系统，基于 React + TypeScript + FastAPI + SQLite 开发。第一阶段支持题目录入、编辑、删除、查看、答案隐藏、标签管理、多标签组合筛选和 Markdown 导出。

## 功能

- 题目管理：新增、批量导入、查看、编辑、删除题目
- 答案隐藏：列表页和详情页都可显示或隐藏答案
- 标签管理：创建、展示、删除标签，题目可绑定多个标签
- 多标签筛选：选择多个标签时，只展示同时包含这些标签的题目
- Markdown 导出：可导出全部题目或当前筛选结果

## 技术栈

- 前端：React、TypeScript、Vite、Axios、React Router、Lucide Icons
- 后端：FastAPI、SQLAlchemy、Pydantic
- 数据库：SQLite
- Python 环境管理：uv

## 本地启动

一键启动（Windows）：

```powershell
.\start-dev.ps1
```

也可以直接双击根目录的 `start-dev.bat`。脚本会检查前端依赖，必要时自动执行 `npm install`，然后分别启动后端和前端，并打开题目库。

后端：

```powershell
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

前端：

```powershell
cd frontend
npm install
npm run dev
```

## 最近修改

- 新增 Windows 一键启动脚本 `start-dev.ps1`，可同时启动 FastAPI 后端和 Vite 前端。
- 新增双击启动入口 `start-dev.bat`，方便从资源管理器直接启动项目。
- 更新本地启动说明，补充快捷启动方式和自动安装前端依赖的说明。
- 合并新增题目和批量导入入口，在新增题目页面内切换“单题录入”和“批量导入”。
- 移除复习面板页面、导航入口和相关复习状态展示，保留题目库、标签配置和导出能力。

访问：

- 题目库：http://localhost:5173
- 新增题目：http://localhost:5173/questions/new
- 标签配置：http://localhost:5173/settings/tags
- 导出中心：http://localhost:5173/export

## API 概览

- `GET /api/tags`：查询标签
- `POST /api/tags`：创建标签
- `DELETE /api/tags/{id}`：删除标签
- `GET /api/questions`：查询题目，可用 `tag_ids=1,2` 组合筛选
- `GET /api/questions/{id}`：查询题目详情
- `POST /api/questions`：新增题目
- `PUT /api/questions/{id}`：编辑题目
- `DELETE /api/questions/{id}`：删除题目
- `GET /api/export/questions.md`：导出 Markdown

## 后续扩展

项目结构为后续 AI 能力预留了扩展空间，可以继续加入 AI 自动打标签、答案总结、面试表达版答案生成、相似题检索和智能复习计划。
