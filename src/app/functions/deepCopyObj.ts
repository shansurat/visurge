export function deepCopyObj(obj: any): any {
  if (null == obj || 'object' != typeof obj) return obj;
  if (obj instanceof Date) {
    let copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    let copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopyObj(obj[i]);
    }
    return copy;
  }
  if (obj instanceof Object) {
    let copy: any = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopyObj(obj[attr]);
    }
    return copy;
  }
  throw new Error('Unable to copy obj this object.');
}
