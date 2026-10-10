# Arquitetura

O projeto segue tres influencias adaptadas ao tamanho do produto:

- SYZYGY: modularidade incremental, contratos explicitos, local-first e observabilidade simples.
- Kof4j: disciplina de agentes, `DOING.md`, portao de qualidade e prova executavel.
- Akita: estado separado em `Store`, `Query` e `Service`.

## Bounded contexts

| Contexto | Responsabilidade | Status |
|---|---|---|
| Catalogo | Musicas, idioma, clima, status, links e notas | MVP |
| Fontes | Politica para links de letra/traducao e verificacao | MVP |
| Spotify | Importacao de playlist via API oficial | MVP |
| Exportacao | Backup JSON local e versionavel | MVP |

## Fluxo

```text
UI -> CatalogService -> CatalogStore
UI -> CatalogQuery -> CatalogStore
CatalogService -> localStorage
UI -> SpotifyService -> Spotify Web API
UI -> TranslationCandidates -> links externos
```

Futuras integracoes externas devem entrar como adaptadores atras de contratos documentados. A UI nao chama APIs externas diretamente.

## Contratos

- Musica deve ter `id`, `title`, `artist`, `language`, `mood`, `status`, `lyricsUrl`, `translationUrl`, `romanticReason`.
- Status editorial deve ser um dos valores definidos em `catalog.model.js`.
- Persistencia local deve aceitar ausencia de dados e recuperar de JSON invalido sem quebrar a tela.
- Importacao externa deve gerar dados normalizados antes de atualizar o store.
- Spotify usa OAuth PKCE no navegador; Client Secret e tokens nao entram no repositorio.
- Traducao automatica usa links candidatos ranqueados; texto completo de terceiros nao e armazenado.
