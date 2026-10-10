export const TRANSLATION_PROVIDERS = [
  {
    id: "letras",
    name: "Letras",
    score: 95,
    buildUrl: (song) => searchUrl(`site:letras.mus.br "${song.artist}" "${song.title}" traducao`)
  },
  {
    id: "musixmatch",
    name: "Musixmatch",
    score: 85,
    buildUrl: (song) => searchUrl(`site:musixmatch.com "${song.artist}" "${song.title}" translation`)
  },
  {
    id: "genius",
    name: "Genius",
    score: 75,
    buildUrl: (song) => searchUrl(`site:genius.com "${song.artist}" "${song.title}" translation`)
  },
  {
    id: "web",
    name: "Web",
    score: 60,
    buildUrl: (song) => searchUrl(`"${song.artist}" "${song.title}" traducao portugues letra`)
  }
];

export function buildTranslationCandidates(song) {
  return TRANSLATION_PROVIDERS.map((provider) => ({
    providerId: provider.id,
    providerName: provider.name,
    score: provider.score,
    url: provider.buildUrl(song)
  })).sort((left, right) => right.score - left.score);
}

function searchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
