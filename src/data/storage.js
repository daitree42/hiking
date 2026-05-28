// window.storage API — async localStorage 适配器

function ls() {
  try { return localStorage; } catch { return null; }
}

window.storage = {
  async set(key, value) {
    const s = ls();
    if (!s) return;
    s.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  },
  async list(prefix) {
    const s = ls();
    if (!s) return { keys: [] };
    const keys = [];
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    return { keys };
  },
  async get(key) {
    const s = ls();
    if (!s) return null;
    const val = s.getItem(key);
    if (!val) return null;
    try { return { value: JSON.parse(val) }; } catch { return { value: val }; }
  },
  async delete(key) {
    const s = ls();
    if (!s) return;
    s.removeItem(key);
  },
};
