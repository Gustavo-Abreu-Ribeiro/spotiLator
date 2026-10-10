# Status

Data: 2026-10-10

## Estado atual

MVP local-first criado. O app roda como site estatico, persiste dados em `localStorage` e possui harness executavel por `npm test`.

## Gates atuais

- Documentacao minima: pronta.
- Harness: pronto.
- Integracao Spotify real: pendente.
- Politica de copyright: definida, ainda precisa virar checagem mais forte no fluxo de importacao futuro.

## Riscos

- Letras/traducoes completas nao podem ser coletadas automaticamente sem licenca.
- APIs de letra costumam ter termos restritivos; cada adaptador precisa de decisao documentada.
- Spotify exige OAuth para playlist completa de usuario.
