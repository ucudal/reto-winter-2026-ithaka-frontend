function requireEnv(key) {
  const value = import.meta.env[key]
  if (value === undefined || value === '') {
    throw new Error(
      `Falta la variable de entorno "${key}". ` +
        'Copia .env.example a .env y define su valor.',
    )
  }
  return value
}

export const env = {
  apiUrl: requireEnv('VITE_API_URL').replace(/\/+$/, ''),
}
