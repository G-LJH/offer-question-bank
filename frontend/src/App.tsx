import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "./components/AppLayout"
import { QuestionCreatePage } from "./pages/QuestionCreatePage"
import { QuestionDetailPage } from "./pages/QuestionDetailPage"
import { QuestionEditPage } from "./pages/QuestionEditPage"
import { QuestionListPage } from "./pages/QuestionListPage"
import { ExportCenterPage } from "./pages/ExportCenterPage"
import { TagSettingsPage } from "./pages/TagSettingsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<QuestionListPage />} />
          <Route path="/questions/new" element={<QuestionCreatePage />} />
          <Route path="/questions/bulk" element={<Navigate to="/questions/new?mode=bulk" replace />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/questions/:id/edit" element={<QuestionEditPage />} />
          <Route path="/settings/tags" element={<TagSettingsPage />} />
          <Route path="/export" element={<ExportCenterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
