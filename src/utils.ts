export function generateResourceId() {
  const array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}
