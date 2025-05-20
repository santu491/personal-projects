export function isPromiseLike(arg: Promise<unknown>): arg is Promise<unknown> {
  return arg != null && typeof arg === 'object' && typeof arg.then === 'function';
}
