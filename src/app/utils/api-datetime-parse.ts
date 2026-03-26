/**
 * Truncates sub-millisecond fractional seconds (e.g. .NET "o" format) so
 * `new Date(...)` parses consistently across browsers.
 */
export function normalizeApiDateTimeString(raw: string): string {
  return raw.replace(/(\.\d{3})\d+/g, '$1');
}

export function parseApiDateTime(value: string | number | null | undefined): Date | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value !== 'string') return null;
  const d = new Date(normalizeApiDateTimeString(value));
  return Number.isNaN(d.getTime()) ? null : d;
}
