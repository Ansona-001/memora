import { logger } from "@/lib/logger";

export function logAiError(message: string, error: unknown): void {
  if (error instanceof DOMException && error.name === "AbortError") {
    logger.info(`[AI] ${message}: cancelled`);
    return;
  }

  logger.warn(`[AI] ${message}`, error);
}
