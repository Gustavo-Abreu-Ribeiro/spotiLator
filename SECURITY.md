# Security Policy

## Segredos

Nunca commite:

- Tokens Spotify.
- Chaves de API de provedores de letra/traducao.
- Cookies, sessoes ou exports privados.
- Arquivos `.env`.

Use `.env.example` para documentar nomes de variaveis quando integracoes forem criadas.

## Dados sensiveis

Exports JSON podem conter preferencias pessoais de playlist. Trate como dado privado do usuario.

## Reporte

Registre vulnerabilidades em `docs/bugs-and-gaps/known-bugs.md` com:

- impacto;
- reproducao minima;
- arquivos afetados;
- prova esperada de correcao.
