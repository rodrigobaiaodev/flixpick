export interface SeasonEpisodeCount {
  seasonNumber: number;
  episodeCount: number;
}

/** Episodes watched through S{season} E{episode} (inclusive). */
export function countEpisodesWatched(
  seasons: SeasonEpisodeCount[],
  season: number,
  episode: number,
): number {
  let total = 0;
  for (const s of seasons) {
    if (s.seasonNumber < season) {
      total += s.episodeCount;
    } else if (s.seasonNumber === season) {
      total += Math.min(episode, s.episodeCount);
      break;
    }
  }
  return total;
}

export function computeTVProgressPercent(
  totalEpisodes: number,
  seasons: SeasonEpisodeCount[],
  season: number | null,
  episode: number | null,
): number {
  if (!totalEpisodes || totalEpisodes <= 0) return 0;
  if (season == null || episode == null) return 5;
  const watched = countEpisodesWatched(seasons, season, episode);
  return Math.min(100, Math.round((watched / totalEpisodes) * 100));
}

export function formatWatchProgress(
  season: number | null,
  episode: number | null,
): string | null {
  if (season == null || episode == null) return null;
  return `S${season} · E${episode}`;
}
