import { useState, useEffect } from 'react'

const EMPTY = {
  name: '',
  description: '',
  status: 'planning',
  priority: 'medium',
  progress: 0,
}

export default function ProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    setForm(project ? { ...EMPTY, ...project } : EMPTY)
  }, [project])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{project?.id ? '编辑项目' : '新建项目'}</h2>

        <label>
          项目名称
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="输入项目名称"
            autoFocus
          />
        </label>

        <label>
          项目描述
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="简要描述项目目标"
            rows={3}
          />
        </label>

        <div className="form-row">
          <label>
            状态
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="planning">规划中</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="paused">暂停</option>
            </select>
          </label>

          <label>
            优先级
            <select value={form.priority} onChange={(e) => set('priority', e.target.value)}>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </label>

          <label>
            进度 ({form.progress}%)
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.progress}
              onChange={(e) => set('progress', Number(e.target.value))}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            取消
          </button>
          <button type="submit" className="btn btn-primary">
            {project?.id ? '保存' : '创建'}
          </button>
        </div>
      </form>
    </div>
  )
}
