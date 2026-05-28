// window.storage API — async localStorage 适配器

window.storage = {
  async set(key, value) {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  },
  async list(prefix) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    return { keys };
  },
  async get(key) {
    const val = localStorage.getItem(key);
    if (!val) return null;
    // 避免双重 JSON.parse
    try { return { value: JSON.parse(val) }; } catch { return { value: val }; }
  },
  async delete(key) {
    localStorage.removeItem(key);
  },
};
