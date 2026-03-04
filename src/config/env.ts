
const required = (key: string): string => {
  const raw = (import.meta.env as any)[key];
  if (!raw) throw new Error(`Missing required environment variable: ${key}`);
  return String(raw);
};

export const env = {
  NODE_ENV: (import.meta.env.MODE as string) ?? 'development',
  VITE_API_BASE_URL: (import.meta.env.VITE_API_BASE_URL as string) ?? '',
  required,
};

export default env;