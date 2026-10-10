# spotiLator

spotiLator e um web app leve para catalogar musicas de uma playlist romantica do Spotify, revisar fontes de letra e traducao, e registrar por que cada musica funciona no contexto romantico da playlist.

O projeto nasce com documentacao operacional para agentes: escopo fechado, contratos por modulo, controle de progresso e harness de qualidade. A prioridade e continuidade sem delirio: qualquer agente deve conseguir ler `AGENTS.md`, `DOING.md` e `docs/status.md`, executar `npm test`, e continuar.

## Uso local

```bash
npm test
npm run dev
```

Abra `http://127.0.0.1:4173`.

Tambem funciona abrindo `index.html` direto no navegador, porque o MVP nao exige backend.

## O que o MVP ja faz

- Cadastra musicas manualmente ou via colagem de lista simples.
- Importa faixas de playlist Spotify usando OAuth PKCE no navegador.
- Guarda idioma, clima, status editorial, links de letra e traducao.
- Sugere buscas ranqueadas para encontrar traducoes melhores.
- Registra uma justificativa curta do motivo romantico da musica.
- Filtra por busca, idioma, clima e status.
- Persiste dados em `localStorage`.
- Exporta/importa JSON para controle manual de versao.

## Importar a playlist Spotify

A playlist alvo pode ser colada no campo `Playlist Spotify`. Para importar automaticamente:

1. Crie um app no Spotify Developer Dashboard.
2. Configure o Redirect URI igual ao valor mostrado no app.
3. Cole o Client ID no app.
4. Clique em `Conectar`, autorize e volte.
5. Clique em `Finalizar login`.
6. Clique em `Importar playlist`.

O link recebido nesta sessao foi normalizado para:

```text
https://open.spotify.com/playlist/0FoBQqwEzAoBWlDzcswX1A
```

## Limite importante sobre letras

Letras e traducoes completas normalmente sao protegidas por direitos autorais. O app deve registrar links, fonte, status de verificacao e comentarios originais do usuario. Ele nao deve copiar, publicar nem versionar letras completas de terceiros sem permissao/licenca.

Por isso a busca automatica de traducao hoje gera candidatos ranqueados e preenche links de busca/verificacao. Buscar e copiar texto completo automaticamente so deve entrar depois de um provedor licenciado ou permissao clara.

## Fontes de arquitetura usadas como referencia

- SYZYGY: plataforma incremental com infraestrutura local-first, contratos modulares, observabilidade e soberania digital.
- Kof4j: disciplina de agentes com `AGENTS.md`, `DOING.md`, portao de qualidade e prova antes de entrega.
- Akita: separacao entre `Store`, `Query` e `Service` para estado previsivel.

Referencias consultadas:

- https://github.com/Syzygy-Alpha/syzygy
- https://github.com/KofLang/Kof4j
- https://opensource.salesforce.com/akita/docs/angular/architecture/
