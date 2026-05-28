// window.storage API — localStorage 适配器
// set(key, value) / list(prefix) / remove(key)

const PREFIX = "hiking_route_";

window.storage = {
  set(key, value) {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  },
  list(prefix) {
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          results.push({ key, data });
        } catch {
          // skip invalid entries
        }
      }
    }
    return results.sort((a, b) => b.data.savedAt - a.data.savedAt);
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};
