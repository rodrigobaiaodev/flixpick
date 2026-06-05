/** Extract numeric TMDB ID from route segments like "550" or "1083381-backrooms". */
export function parseContentId(idParam: string): number | null {
  const match = idParam.match(/^(\d+)/);
  if (!match) return null;

  const parsed = Number.parseInt(match[1], 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Optional slug suffix embedded in the id segment after the numeric prefix. */
export function parseSlugFromIdParam(idParam: string): string | null {
  const match = idParam.match(/^\d+-(.+)$/);
  return match?.[1] ?? null;
}
