export const logger = {
  error: (message: string, ...details: unknown[]) => {
    console.error(`[Memora] ${message}`, ...details);
  },
  warn: (message: string, ...details: unknown[]) => {
    console.warn(`[Memora] ${message}`, ...details);
  },
  info: (message: string, ...details: unknown[]) => {
    console.info(`[Memora] ${message}`, ...details);
  },
};
