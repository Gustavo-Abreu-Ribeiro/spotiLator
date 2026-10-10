# Source Adapters - Plano de desenvolvimento

## Objetivo

Permitir que o usuario registre e avalie fontes de letra e traducao sem violar direitos autorais.

## Regras

- Adaptador deve retornar metadados e link, nao letra completa.
- Cada provedor precisa de uma nota de termos de uso.
- Fonte deve ter status: `nao_verificada`, `boa`, `duvidosa`, `bloqueada`.

## Prova esperada

- Harness com fontes ficticias.
- Verificacao de que export JSON nao contem corpo de letra completo.
