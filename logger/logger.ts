export function logError(error: unknown, msg?: string) {
  console.error(
    `[ERROR] ${msg ?? ""} ${error instanceof Error ? error.message : "unknown error"}`,
  );
}
