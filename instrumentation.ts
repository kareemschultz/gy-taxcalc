export async function register() {
  // Node.js may provide a broken localStorage stub via --localstorage-file.
  // Patch it so SSR code that touches localStorage doesn't crash.
  if (
    typeof globalThis.localStorage !== "undefined" &&
    typeof globalThis.localStorage.getItem !== "function"
  ) {
    const store: Record<string, string> = {}
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = String(value) },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
        get length() { return Object.keys(store).length },
        key: (n: number) => Object.keys(store)[n] ?? null,
      },
      writable: true,
      configurable: true,
    })
  }
}
