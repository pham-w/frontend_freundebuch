function keyForUser(userId: number) {
  return `friendbook_favorites_v1_user_${userId}`;
}

function read(userId: number): number[] {
  try {
    const raw = localStorage.getItem(keyForUser(userId));
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "number") : [];
  } catch {
    return [];
  }
}

function write(userId: number, ids: number[]) {
  localStorage.setItem(keyForUser(userId), JSON.stringify(ids));
}

export function getFavoriteIds(userId: number): number[] {
  return read(userId);
}

export function toggleFavoriteId(userId: number, id: number): number[] {
  const ids = read(userId);
  const idx = ids.indexOf(id);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.push(id);
  write(userId, ids);
  return ids;
}
