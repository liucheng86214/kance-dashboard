const STATUS_MAP = {
  planning: { label: '规划中', color: '#f59e0b' },
  in_progress: { label: '进行中', color: '#3b82f6' },
  completed: { label: '已完成', color: '#10b981' },
  paused: { label: '暂停', color: '#6b7280' },
}

const PRIORITY_MAP = {
  high: { label: '高', color: '#ef4444' },
  medium: { label: '中', color: '#f59e0b' },
  low: { label: '低', color: '#6b7280' },
}

export default function ProjectCard({ project, onEdit, onDelete }) {
  const status = STATUS_MAP[project.status] || STATUS_MAP.planning
  const priority = PRIORITY_MAP[project.priority] || PRIORITY_MAP.medium

  return (
    <div className="project-card">
      <div className="card-header">
        <h3 className="card-title">{project.name}</h3>
        <div className="card-actions">
          <button className="btn-icon" onClick={() => onEdit(project)} title="编辑">
            &#9998;
          </button>
          <button className="btn-icon btn-delete" onClick={() => onDelete(project.id)} title="删除">
            &times;
          </button>
        </div>
      </div>

      {project.description && (
        <p className="card-desc">{project.description}</p>
      )}

      <div className="card-tags">
        <span className="tag" style={{ background: status.color }}>
          {status.label}
        </span>
        <span className="tag tag-outline" style={{ borderColor: priority.color, color: priority.color }}>
          {priority.label}优先级
        </span>
      </div>

      <div className="progress-wrap">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${project.progress || 0}%`,
              background: status.color,
            }}
          />
        </div>
        <span className="progress-text">{project.progress || 0}%</span>
      </div>

      <div className="card-footer">
        <span className="card-date">
          {new Date(project.createdAt).toLocaleDateString('zh-CN')}
        </span>
      </div>
    </div>
  )
}
