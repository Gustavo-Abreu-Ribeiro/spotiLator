# GitHub Setup

Este repositorio ja contem a base local para GitHub:

- CI em `.github/workflows/ci.yml`.
- Templates de issue em `.github/ISSUE_TEMPLATE/`.
- Template de pull request em `.github/PULL_REQUEST_TEMPLATE.md`.
- Politica de contribuicao em `CONTRIBUTING.md`.
- Politica de seguranca em `SECURITY.md`.

## Criar remoto

Quando houver uma conta/organizacao GitHub escolhida:

```bash
gh repo create spotiLator --private --source=. --remote=origin --push
```

Se preferir publico, troque `--private` por `--public`.

## Branch protection recomendada

Na branch principal:

- Exigir status check `test`.
- Exigir pull request antes de merge, quando houver mais de uma pessoa/agente.
- Bloquear push com segredos via GitHub secret scanning.
- Manter historico linear se o time preferir rebase.

## Labels sugeridas

- `scope:catalog`
- `scope:spotify`
- `scope:sources`
- `scope:docs`
- `type:bug`
- `type:feature`
- `type:task`
- `risk:copyright`
- `risk:credentials`

## Regra para agentes

Agentes nao precisam pedir permissao para preparar commits locais, rodar testes, atualizar docs ou organizar arquivos do projeto. Eles so devem parar quando precisarem de credenciais, conta externa, custo, remocao destrutiva ou decisao de produto/legal ausente.
