export function generateResourceId() {
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  return Array.from(array, num => num.toString(16).padStart(8, '0')).join('')
}
