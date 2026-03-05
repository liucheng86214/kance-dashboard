import { useState, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import ProjectCard from './components/ProjectCard'
import ProjectForm from './components/ProjectForm'
import FilterBar from './components/FilterBar'
import { getProjects, addProject, updateProject, deleteProject } from './utils/storage'

export default function App() {
  const [projects, setProjects] = useState(getProjects)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null) // null=closed, {}=new, {id,...}=edit
  const [search, setSearch] = useState('')

  const filtered = projects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSave = useCallback((form) => {
    if (form.id) {
      setProjects(updateProject(form.id, form))
    } else {
      setProjects(addProject(form))
    }
    setEditing(null)
  }, [])

  const handleDelete = useCallback((id) => {
    if (confirm('确定删除该项目？')) {
      setProjects(deleteProject(id))
    }
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>KANCE Dashboard</h1>
          <span className="subtitle">项目管理中心</span>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          + 新建项目
        </button>
      </header>

      <Dashboard projects={projects} />

      <div className="toolbar">
        <FilterBar current={filter} onChange={setFilter} />
        <input
          className="search-input"
          type="text"
          placeholder="搜索项目..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          {projects.length === 0
            ? '还没有项目，点击「+ 新建项目」开始'
            : '没有匹配的项目'}
        </div>
      ) : (
        <div className="project-grid">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editing !== null && (
        <ProjectForm
          project={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
