export function logError(msg: string, error?: unknown) {
  console.error(
    `[ERROR] ${msg} ${error ? (error instanceof Error ? error.message : "unknown error") : ""}`,
  );
}

export function logInfo(msg: string) {
  console.log(`[INFO] ${msg}`);
}

export function logDebug(msg: string) {
  console.log(`[DEBUG] ${msg}`);
}
