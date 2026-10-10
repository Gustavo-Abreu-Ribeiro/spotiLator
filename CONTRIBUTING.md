# Contribuindo

Este projeto foi preparado para desenvolvimento continuo por humanos e agentes.

## Fluxo curto

```bash
npm test
npm run build
git status --short
```

Depois implemente uma unidade pequena, rode `npm test`, atualize docs afetadas e commite.

## Regra de autonomia

Agentes podem, sem pedir permissao ao humano:

- Ler arquivos do repositorio.
- Criar, editar e organizar arquivos dentro do escopo do projeto.
- Rodar `npm test`, `npm run build` e `npm run dev`.
- Inicializar Git, criar commits locais e preparar branches.
- Atualizar `DOING.md`, `docs/status.md` e `docs/activity-log/README.md`.

Agentes nao devem executar sem decisao explicita:

- Publicar segredo, token ou credencial.
- Fazer scraping de letras.
- Versionar letras ou traducoes completas de terceiros.
- Apagar historico Git, resetar branch ou remover trabalho de outra pessoa.
- Criar integracao externa que exija conta, custo ou mudanca de termos.

## Qualidade minima

- `npm test` verde.
- Mudancas pequenas e explicaveis.
- Documentacao atualizada junto com comportamento novo.
- Nenhum arquivo de codigo/documentacao maior que 500 linhas sem justificativa registrada.

## Commits

Use commits pequenos e descritivos:

```text
docs: add spotify import plan
feat: add catalog filter
test: cover catalog export
```

Nao deixe trabalho meio feito sem atualizar `DOING.md`.
