import dayjs from "dayjs";

function timestamp(): string {
  return dayjs().format("HH:mm:ss");
}

export function logError(msg: string, error?: unknown) {
  console.error(
    `${timestamp()} [ERROR] ${msg} ${error ? (error instanceof Error ? error.message : "unknown error") : ""}`,
  );
}

export function logInfo(msg: string) {
  console.log(`${timestamp()} [INFO] ${msg}`);
}

export function logDebug(msg: string) {
  console.log(`${timestamp()} [DEBUG] ${msg}`);
}
