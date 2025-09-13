export function getClientIp(xff: string | null, fallback: string | null): string | null {
  if (xff) {
    const ip = xff.split(',')[0].trim();
    return ip || fallback;
  }
  return fallback;
}
