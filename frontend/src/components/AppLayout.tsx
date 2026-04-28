import { BookOpen, Download, LayoutDashboard, Plus, Settings, Tags } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="workspace">
      <aside className="nav-rail">
        <div className="brand-block">
          <div className="brand-mark">O</div>
          <div>
            <strong>Offer 题库</strong>
            <span>Interview Bank</span>
          </div>
        </div>
        <nav className="main-nav">
          <NavLink to="/review"><LayoutDashboard size={18} />复习面板</NavLink>
          <NavLink to="/" end><BookOpen size={18} />题目库</NavLink>
          <NavLink to="/questions/new"><Plus size={18} />新增题目</NavLink>
          <NavLink to="/settings/tags"><Tags size={18} />标签配置</NavLink>
          <NavLink to="/export"><Download size={18} />导出中心</NavLink>
        </nav>
        <div className="nav-footer">
          <Settings size={16} />
          <span>本地单用户 · SQLite</span>
        </div>
      </aside>
      <Outlet />
    </div>
  )
}
