export function resolveSystemABaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_SYSTEM_A_API_URL;
  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8001`;
  }

  return "http://127.0.0.1:8001";
}

export function resolveSystemBBaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_SYSTEM_B_API_URL;
  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8002`;
  }

  return "http://127.0.0.1:8002";
}
