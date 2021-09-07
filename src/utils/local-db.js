const project_name = process.env.VUE_APP_PROJECT_NAME

const local_db = {
  set(key, value) {
    localStorage.setItem(project_name + ':' + key, JSON.stringify(value))
  },
  get(key) {
    return JSON.parse(localStorage.getItem(project_name + ':' + key))
  },
  remove(key) {
    localStorage.removeItem(project_name + ':' + key)
  },
  clear() {
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key) && key.indexOf(project_name) > -1) {
        localStorage.removeItem(key)
      }
    }
  }
}

export default local_db
