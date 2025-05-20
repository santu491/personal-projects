export type UnknownObject = {
  [key in PropertyKey]: unknown;
};

export function isUnknownObject(x: unknown): x is UnknownObject {
  return x !== null && typeof x === 'object';
}

export function hasProp<Y extends PropertyKey>(obj: unknown, prop: Y): obj is UnknownObject & Record<Y, unknown> {
  return typeof obj === 'object' && obj !== null && Object.prototype.hasOwnProperty.call(obj, prop);
}
