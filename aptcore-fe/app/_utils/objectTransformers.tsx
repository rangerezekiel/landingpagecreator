export function setInitialName(value: string): string {
  return value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '';
}

function isAllCaps(str: string): boolean {
  return str === str.toUpperCase()
}

function camelToSnakeCase(name: string): string {
  return name.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

export function toSnake<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const newObj: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = isAllCaps(key) ? key : camelToSnakeCase(key)
      newObj[snakeKey] = obj[key]
    }
  }
  return newObj
}

export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function storageUrl(url: string | null){
  return url ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${url}` : ""
}

export function formatLabel(key: string): string {
  return key
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
