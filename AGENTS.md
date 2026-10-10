# AGENTS.md - Guia de agentes do spotiLator

Este arquivo e a primeira leitura obrigatoria para qualquer agente trabalhando neste repositorio.

## Principios

1. Escopo primeiro: o produto cataloga musicas, fontes de letra/traducao e notas romanticas. Nao construa features fora desse fluxo sem registrar decisao.
2. Prova antes de entrega: rode `npm test` depois de qualquer mudanca funcional ou documental relevante.
3. Sem alucinacao de fonte: toda informacao externa sobre letra, traducao, musica ou API deve ter fonte verificavel.
4. Direitos autorais: nao commitar letras ou traducoes completas de terceiros. Use links, metadados, trechos curtos quando permitido e notas originais.
5. Desenvolvimento pequeno: uma mudanca coesa por vez. Atualize docs de status quando mudar comportamento ou decisao.
6. Local-first: o app deve continuar util sem servidor remoto. Integracoes Spotify/letras entram como adaptadores opcionais.

## Loop de trabalho

1. Leia `DOING.md`, `docs/status.md` e `docs/roadmap.md`.
2. Escolha uma tarefa aberta pequena.
3. Atualize `DOING.md` antes ou junto da primeira mudanca.
4. Implemente usando a arquitetura existente.
5. Rode `npm test`.
6. Atualize `docs/activity-log/README.md` com data, mudanca e prova.

## Autonomia e permissoes

O humano nao deve precisar repetir o contexto do projeto. Agentes devem agir com base neste arquivo, `DOING.md`, `docs/status.md` e `docs/roadmap.md`.

Permitido sem pedir permissao:

- Rodar comandos locais de leitura, teste, build e servidor de desenvolvimento.
- Criar/editar arquivos dentro do repositorio.
- Inicializar Git, criar branches locais e commitar unidades concluidas.
- Atualizar documentacao operacional e templates GitHub.
- Corrigir bugs dentro do escopo declarado.

Pedir decisao ou parar somente quando:

- A acao exigir credencial, conta externa, custo ou publicacao remota.
- Houver risco de apagar historico, remover trabalho alheio ou executar comando destrutivo.
- A decisao for legal/produto, como licenca, provedor pago ou permissao para armazenar letras completas.
- O unico caminho violar direitos autorais, termos de uso ou privacidade.

## Arquitetura obrigatoria

- `src/core`: utilitarios compartilhados e primitivas de estado.
- `src/features/<feature>`: modulo vertical com modelo, store, query, service e UI/adapters se necessario.
- `docs/architecture`: contratos e decisoes de arquitetura.
- `docs/development`: trabalho em andamento.
- `docs/development/future`: ideias validas, mas fora do ciclo atual.
- `docs/bugs-and-gaps`: bugs, gaps e riscos vivos.
- `scripts`: harness, verificadores e ferramentas locais sem dependencia externa quando possivel.

## Padrao de estado inspirado em Akita

- `Store`: unica fonte mutavel do estado em memoria.
- `Query`: leitura derivada, filtros e seletores.
- `Service`: comandos, normalizacao, persistencia e integracoes.
- UI chama `Service` para mudar estado e `Query` para ler estado.

## Gates

Antes de considerar uma tarefa concluida:

- `npm test` passou.
- Nenhum arquivo de codigo ultrapassa 500 linhas sem justificativa em `docs/bugs-and-gaps/known-bugs.md`.
- Docs afetadas foram atualizadas.
- Nenhum segredo, token Spotify ou letra completa foi versionado.

## Fora de escopo sem ADR

- Scraping de letras.
- Publicacao de letras completas.
- Login obrigatorio.
- Backend com banco remoto.
- Monetizacao, anuncios ou tracking.
