export const setCache = (key, data, ttlInMinutes = 15) => {
  const now = new Date();
  const item = {
    data: data,
    expiry: now.getTime() + ttlInMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getCache = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch (e) {
    localStorage.removeItem(key);
    return null;
  }
};

export const clearCache = (key) => {
  if (key) {
    localStorage.removeItem(key);
  } else {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('cache_')) {
        localStorage.removeItem(k);
      }
    });
  }
};
