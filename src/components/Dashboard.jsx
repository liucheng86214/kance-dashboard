export default function Dashboard({ projects }) {
  const total = projects.length
  const inProgress = projects.filter((p) => p.status === 'in_progress').length
  const completed = projects.filter((p) => p.status === 'completed').length
  const planning = projects.filter((p) => p.status === 'planning').length
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats = [
    { label: '总项目', value: total, color: '#6366f1' },
    { label: '规划中', value: planning, color: '#f59e0b' },
    { label: '进行中', value: inProgress, color: '#3b82f6' },
    { label: '已完成', value: completed, color: '#10b981' },
    { label: '完成率', value: `${rate}%`, color: '#8b5cf6' },
  ]

  return (
    <div className="dashboard">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-value" style={{ color: s.color }}>
            {s.value}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
