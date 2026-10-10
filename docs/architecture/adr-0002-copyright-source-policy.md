# ADR-0002 - Politica de fontes e copyright

Data: 2026-10-10

## Decisao

O app registra links e estado de verificacao de letras/traducoes, mas nao armazena letras ou traducoes completas de terceiros no repositorio ou no export padrao.

## Motivo

Letras e traducoes geralmente sao protegidas por direitos autorais. O produto deve facilitar curadoria e verificacao, nao republicacao.

## Consequencias

- Campos principais sao `lyricsUrl`, `translationUrl` e `romanticReason`.
- Adaptadores futuros devem documentar termos de uso.
- Qualquer campo de trecho deve ser curto e opcional.
