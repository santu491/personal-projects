export function getOsEnv(key: string): string {
  return process.env[key] as string;
}

export function toNumber(value: string): number {
  return parseInt(value, 10);
}

export function toBool(value: string): boolean {
  return value === 'true';
}
