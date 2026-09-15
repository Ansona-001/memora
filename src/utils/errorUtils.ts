interface ErrorLike {
  message?: unknown;
  error?: unknown;
}

function messageFrom(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  // Supabase/PostgREST/Storage errors are plain objects, not Error instances.
  // Without this they all collapsed to the generic fallback, hiding the
  // real cause (e.g. missing ai_caption column, RLS violation, quota).
  if (error && typeof error === "object") {
    const candidate = error as ErrorLike;
    const direct = messageFrom(candidate.message);
    if (direct) {
      return direct;
    }

    const nested = messageFrom(candidate.error);
    if (nested) {
      return nested;
    }
  }

  return "Something went wrong. Please try again.";
}

