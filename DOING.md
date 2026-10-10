# DOING

Fonte de verdade operacional para agentes. Atualize no mesmo conjunto de mudancas que altera o estado do trabalho.

| Estado | Dono | Item | Arquivos | Prova |
|---|---|---|---|---|
| FEITO | Codex | Fundacao documental e MVP local-first | `AGENTS.md`, `docs/`, `src/`, `scripts/`, `index.html` | `npm test` |
| FEITO | Codex | Preparacao GitHub e politica de autonomia para agentes | `.github/`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/github.md`, `AGENTS.md` | `npm test` |
| ABERTO | - | Integracao oficial Spotify OAuth/playlist import | `docs/development/spotify-import.md`, `src/features/spotify/` | harness com fixture |
| ABERTO | - | Adaptadores de fonte de letra/traducao apenas por link/licenca | `docs/development/source-adapters.md` | teste de politica de fonte |
| ABERTO | - | Suite visual mobile/desktop | `docs/development/visual-regression.md`, `scripts/` | screenshots revisados |

PROXIMO PASSO: implementar `docs/development/spotify-import.md` com contrato OAuth, fixtures e harness antes de tocar em API real.
