export function getArgument(key: string): string {
  for (const arg of process.argv) {
    if (arg.indexOf(`--${key}=`) >= 0) {
      return arg.replace(`--${key}=`, '');
    }
  }

  return process.env[`npm_config_${key}`] || '';
}

export function getApiArgument(key: string): string {
  const arg = getArgument(key);
  return arg === 'all' ? '' : arg;
}
