# Fontes dos assets

Imagens consultadas e capturadas em 27/10/2026. Os arquivos ficam no portal para
que a página não dependa de requisições ao GitHub ou a um serviço de screenshots.
Não são imagens geradas nem interfaces conceituais.

## Identidade Deadlock

- `assets/deadlock-logo.png`: imagem da organização
  [univates-deadlock](https://github.com/univates-deadlock), obtida pelo
  [avatar público da organização](https://avatars.githubusercontent.com/u/316752697?v=4&s=512).
  O arquivo retornado tem 460 × 460 pixels; seu fundo original foi preservado.
- `assets/favicon.png`: redução da mesma imagem para 48 × 48 pixels.
- `assets/og-cover.png`: capa de 1200 × 630 pixels com a mesma logo e o texto
  do portal.

A logo provisória de cadeado e suas versões antigas foram removidas.

## Participantes

Os quatro perfis foram confirmados no histórico dos repositórios
[TechPro App](https://github.com/univates-deadlock/techpro-app/commits/main/)
e [site institucional](https://github.com/univates-deadlock/techpro-institutional-page/commits/main/).
Os nomes completos também constam nos READMEs desses projetos. O nome de Mateus
foi conferido no seu perfil público, pois alguns commits usam apenas `matbdev`.
As atribuições já apresentadas no portal foram preservadas; a identificação de
Mateus como DevOps e backend foi atualizada por solicitação dele.

| Participante | Perfil | Evidência de contribuição no App | Avatar de origem |
| --- | --- | --- | --- |
| Mateus Carniel Brambilla | [@matbdev](https://github.com/matbdev) | [Commit](https://github.com/univates-deadlock/techpro-app/commit/855f006b32f0801bb75d7a677b8b1c8570892a50) | [Imagem](https://avatars.githubusercontent.com/u/210099336?v=4&s=320) |
| Alexandra Padilha | [@alexandrapadilha1](https://github.com/alexandrapadilha1) | [Commit](https://github.com/univates-deadlock/techpro-app/commit/0f86a3e72e4894bf352f709ff1cfa153ea5f8096) | [Imagem](https://avatars.githubusercontent.com/u/310811143?v=4&s=320) |
| Diogo Felipe Zanco | [@DiogoFZanco](https://github.com/DiogoFZanco) | [Commit](https://github.com/univates-deadlock/techpro-app/commit/9cbd17bc0ca46d9240e5f18371df107da79555d3) | [Imagem](https://avatars.githubusercontent.com/u/275521141?v=4&s=320) |
| Tainá Luiza Schmidt | [@TainaSchmidt](https://github.com/TainaSchmidt) | [Commit](https://github.com/univates-deadlock/techpro-app/commit/e5c31da022cbe80cd84a4fd9ce140731e71d4093) | [Imagem](https://avatars.githubusercontent.com/u/219932390?v=4&s=320) |

Os avatares foram baixados em 320 × 320 pixels e convertidos para WebP em
`assets/team/`, sem alterar o conteúdo. São as imagens públicas escolhidas
pelos próprios participantes para seus perfis.

## Projetos

| Arquivo | Origem da captura | Conteúdo |
| --- | --- | --- |
| `assets/projects/techpro-app.webp` | Frontend do [TechPro App](https://github.com/univates-deadlock/techpro-app/tree/83cbe234a1e8fbc6f81fbaf993c840b618b4e37f/frontend), executado localmente em modo de produção | Tela de login, com campos vazios, sem dados de usuários ou clientes |
| `assets/projects/techpro-website.webp` | [Site TechPro publicado](https://techpro.matbdev.com/pages/home.html) | Página inicial, incluindo navegação, apresentação e início da seção de públicos atendidos |

As capturas têm 1440 × 900 pixels e foram convertidas para WebP com qualidade 88.
O App foi executado a partir de uma cópia temporária do frontend, com seu código
original, sem modificar o outro repositório. O login permite mostrar uma tela
real sem exigir sessão autenticada ou expor cadastros internos.

### Atualizar as capturas

1. Abra a página real em um navegador com viewport de 1440 × 900 e escala 1.
2. Aguarde o carregamento das fontes e imagens. Para o App, use `npm run build`
   e `npm run start` no frontend para evitar indicadores de desenvolvimento.
3. Capture a área visível, mantendo campos de login vazios e sem dados internos.
4. Converta a captura para WebP e substitua o arquivo correspondente em
   `assets/projects/`. Mantenha o mesmo nome e dimensões para preservar o layout.
5. Atualize a data e a origem neste documento. Execute `python3 tests/check_site.py`
   e confira a página no desktop e no celular.
