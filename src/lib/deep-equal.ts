/* eslint-disable @typescript-eslint/no-explicit-any */
// copied from: https://github.com/TanStack/router/blob/main/packages/router-core/src/utils.ts
// which is copied from https://github.com/jonschlinkert/is-plain-object

export function isPlainObject(o: any) {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function hasObjectPrototype(o: any) {
  return Object.prototype.toString.call(o) === "[object Object]";
}

export function isPlainArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}

export function deepEqual(
  a: any,
  b: any,
  opts?: { partial?: boolean; ignoreUndefined?: boolean }
): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0, l = a.length; i < l; i++) {
      if (!deepEqual(a[i], b[i], opts)) return false;
    }
    return true;
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const ignoreUndefined = opts?.ignoreUndefined ?? true;

    if (opts?.partial) {
      for (const k in b) {
        if (!ignoreUndefined || b[k] !== undefined) {
          if (!deepEqual(a[k], b[k], opts)) return false;
        }
      }
      return true;
    }

    let aCount = 0;
    if (!ignoreUndefined) {
      aCount = Object.keys(a).length;
    } else {
      for (const k in a) {
        if (a[k] !== undefined) aCount++;
      }
    }

    let bCount = 0;
    for (const k in b) {
      if (!ignoreUndefined || b[k] !== undefined) {
        bCount++;
        if (bCount > aCount || !deepEqual(a[k], b[k], opts)) return false;
      }
    }

    return aCount === bCount;
  }

  return false;
}
