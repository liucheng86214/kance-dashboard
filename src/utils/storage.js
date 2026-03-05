const STORAGE_KEY = 'kance-projects'

export function getProjects() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function addProject(project) {
  const projects = getProjects()
  const newProject = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...project,
  }
  projects.unshift(newProject)
  saveProjects(projects)
  return projects
}

export function updateProject(id, updates) {
  const projects = getProjects()
  const idx = projects.findIndex((p) => p.id === id)
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...updates }
    saveProjects(projects)
  }
  return projects
}

export function deleteProject(id) {
  const projects = getProjects().filter((p) => p.id !== id)
  saveProjects(projects)
  return projects
}
