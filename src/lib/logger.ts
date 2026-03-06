export function safeErrorLog(message: string, error: unknown) {
  // Decision: only log minimal metadata to avoid leaking tokens/secrets.
  console.error(message, {
    name: error instanceof Error ? error.name : "unknown",
    message: error instanceof Error ? error.message : "Unexpected error",
  });
}
