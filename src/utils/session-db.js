const project_name = process.env.VUE_APP_PROJECT_NAME

const session_db = {
  set(key, value) {
    sessionStorage.setItem(project_name + ':' + key, JSON.stringify(value))
  },
  get(key) {
    return JSON.parse(sessionStorage.getItem(project_name + ':' + key))
  },
  remove(key) {
    sessionStorage.removeItem(project_name + ':' + key)
  },
  clear() {
    for (const key in sessionStorage) {
      if (Object.prototype.hasOwnProperty.call(sessionStorage, key) && key.indexOf(project_name) > -1) {
        sessionStorage.removeItem(key)
      }
    }
  }
}

export default session_db
