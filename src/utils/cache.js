export const setCache = (key, data, ttlInMinutes = 15) => {
  const now = new Date();
  const item = {
    data: data,
    expiry: now.getTime() + ttlInMinutes * 60 * 1000,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    // Cache writes are best-effort.
  }
};

export const getCache = (key) => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return { hit: false, data: null };

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return { hit: false, data: null };
    }

    return { hit: true, data: item.data };
  } catch (e) {
    try {
      localStorage.removeItem(key);
    } catch (removeError) {
      // Cache cleanup is best-effort.
    }
    return { hit: false, data: null };
  }
};

export const clearCache = (key) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('cache_')) {
          localStorage.removeItem(k);
        }
      });
    }
  } catch (e) {
    // Cache cleanup is best-effort.
  }
};
