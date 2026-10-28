<div align="center">
  <img src="assets/deadlock-logo.png" alt="Logo da Deadlock" width="100">
  <h1>Deadlock — Portal</h1>
  <p>Portal de entrada da equipe Deadlock · Projetos, pessoas e código</p>
  <p><strong>Engenharia de Software · Univates · 2026B</strong></p>
</div>

---

## Propósito

O **Deadlock Portal** é a landing page da equipe responsável pelo projeto acadêmico TechPro. Centraliza o acesso aos dois repositórios e ao website publicado, apresenta os quatro integrantes e documenta nossa forma de trabalhar.

- [TechPro App](https://github.com/univates-deadlock/techpro-app) — sistema de gestão de clientes, orçamentos e serviços.
- [TechPro Institutional Page](https://github.com/univates-deadlock/techpro-institutional-page) — site institucional da empresa [TechPro](https://techpro.matbdev.com).
- [GitHub Deadlock](https://github.com/univates-deadlock) — organização da equipe.

A landing page é **100% estática**: HTML sem framework, CSS e JavaScript puro; sem dependências npm, backend, banco de dados ou etapa de build. As prévias mostram **capturas reais** da tela de login do TechPro App e do site institucional publicado. Clique em cada imagem para ampliá-la.

As capturas abrem uma galeria na própria página, com navegação por botões ou
pelas setas do teclado. Feche com `Esc`, pelo botão de fechar ou clicando fora
da imagem. Sem JavaScript, as imagens continuam abrindo diretamente em outra
aba. Cards, fotos, links e botões têm estados de hover, foco e clique; os
movimentos respeitam a preferência de movimento reduzido do dispositivo.

> **Identidade visual:** `assets/deadlock-logo.png` é a imagem usada pela organização [univates-deadlock no GitHub](https://github.com/univates-deadlock). A mesma logo aparece no cabeçalho, destaque inicial, rodapé, página 404, favicon e imagem de compartilhamento. As fotos da equipe também vêm dos perfis confirmados nos commits. Todas as imagens são servidas localmente, sem consultar a API do GitHub durante a navegação. Veja as [fontes dos assets e como atualizar as capturas](docs/asset-sources.md).

## Estrutura

```text
.
├── index.html                  # Página única do portal
├── 404.html                    # Página de erro para Caddy
├── AGENTS.md                   # Convenções de arquitetura, BEM e fluxo de desenvolvimento
├── CLAUDE.md                   # Instruções para agentes e referência às skills instaladas
├── css/
│   ├── variables.css           # Design tokens (cores, tipografia, espaçamentos e movimento)
│   ├── global.css              # Fonte local, reset, layout base e utilitários globais
│   ├── components/             # Estilos BEM de componentes reutilizáveis e galeria
│   └── pages/                  # Estilos específicos das páginas (home.css e 404.css)
├── js/
│   ├── main.js                 # Menu mobile, ano dinâmico e reveal progressivo
│   └── gallery.js              # Galeria acessível das capturas reais
├── assets/                     # Logo, favicon, capa, fotos da equipe, capturas e fontes
├── docs/asset-sources.md       # Origem das imagens, fontes e atualização das capturas
├── docs/github-topics.json     # Metadados de tópicos do repositório
├── tests/check_site.py         # Validação de referências locais e assets CSS
├── tests/check_interactions.cjs # Verificação opcional no navegador
├── .github/workflows/
│   ├── ci.yml                  # Validação e smoke test do container
│   ├── deploy.yml              # Workflow legado de deploy direto SSH (desativado)
│   └── notify-deploy.yml       # Notificação para deploy central (deadlock-deploy)
├── Dockerfile                  # Caddy Alpine
├── Caddyfile                   # HTTP interno na porta 8080
└── compose.yaml                # Container, rede e porta local 8081
```

## Rodar localmente

Pré-requisito: Python 3 (ou Docker com Compose).

```bash
git clone https://github.com/univates-deadlock/deadlock-portal.git
cd deadlock-portal
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra **http://127.0.0.1:8000/**. Para encerrar, use `Ctrl+C`.

Com Docker, use:

```bash
docker compose up -d --build
curl -fsS http://127.0.0.1:8081/health
docker compose logs -f web
# para parar: docker compose down
```

A URL local com Docker é **http://127.0.0.1:8081/**. O Caddy dentro do container escuta na porta **8080**, mapeada apenas para o loopback da VM. Não use `8080:8080` no host: a aplicação institucional TechPro já usa a porta 8080; a mesma VM também já utiliza 80/443.

## Validar as interações

A validação básica não precisa de dependências:

```bash
python3 tests/check_site.py
node --check js/main.js
node --check js/gallery.js
```

O teste opcional de navegador usa Playwright como ferramenta de desenvolvimento;
não adiciona dependências à página. Com o portal rodando, execute:

```bash
npm install --prefix /tmp/deadlock-browser-check --no-save playwright
/tmp/deadlock-browser-check/node_modules/.bin/playwright install chromium
PLAYWRIGHT_MODULE=/tmp/deadlock-browser-check/node_modules/playwright node tests/check_interactions.cjs http://127.0.0.1:8081
```

O teste cobre a galeria, navegação por teclado, foco, bloqueio de rolagem,
fechamento por botão/Esc/clique fora, preferência de movimento reduzido,
telas de 320/390/1440 pixels e abertura das capturas sem JavaScript.

## CI/CD — GitHub Actions

Fluxo:

```text
push/PR ──> CI (HTML/links/JS/Compose/Caddy via smoke test)
CI aprovado na main ──> CD Centralizado (notify-deploy.yml via repository_dispatch) ──> deadlock-deploy (VM)
```

O repositório utiliza entrega contínua centralizada via **CD Central (`notify-deploy.yml`)**, acionada automaticamente após o **CI da `main` concluir com sucesso**:

1. **Notificação de CD Central (`notify-deploy.yml` — mecanismo ativo):**
   Após a validação do CI em push na branch `main`, este workflow envia um evento `repository_dispatch` do tipo `deploy-main` para o repositório de orquestração [`univates-deadlock/deadlock-deploy`](https://github.com/univates-deadlock/deadlock-deploy), utilizando o token `DEPLOY_DISPATCH_TOKEN`. O payload inclui o nome do repositório (`univates-deadlock/deadlock-portal`) e o commit SHA exato que acabou de ser testado.
   Na VM da Univates, um runner self-hosted dedicado consome o evento, executa `git fetch` validando o commit exato, atualiza o container com `docker compose up -d --build --wait` e valida os health checks locais antes de concluir. A entrega é realizada sem expor portas SSH para o GitHub nem depender de conexões de entrada.

2. **Deploy direto SSH (`deploy.yml` — fluxo legado, desativado):**
   Mecanismo anterior baseado em SSH direto acionado a partir do GitHub Actions. O workflow permanece no repositório exclusivamente por histórico e fallback manual (`workflow_dispatch`), mas está desativado na rotina padrão e é ignorado de forma segura caso os segredos SSH não estejam configurados.

### 1. Configurar secrets organizacionais

Configure o secret organizacional necessário para a entrega contínua do repositório:

| Secret | Workflow | Status | Finalidade / Valor esperado |
| --- | --- | --- | --- |
| `DEPLOY_DISPATCH_TOKEN` | `notify-deploy.yml` | **Ativo** | Token com permissão de escrita (*Contents: Read and write*) para disparar o repositório central `deadlock-deploy` |
| `VM_HOST` | `deploy.yml` | *Legado (desativado)* | Requisito exclusivo do workflow legado; IP ou DNS acessível por SSH |
| `VM_USER` | `deploy.yml` | *Legado (desativado)* | Requisito exclusivo do workflow legado; conta Linux no host |
| `VM_PORT` | `deploy.yml` | *Legado (desativado)* | Requisito exclusivo do workflow legado; porta SSH externa (padrão 22 se omitido) |
| `VM_SSH_KEY` | `deploy.yml` | *Legado (desativado)* | Requisito exclusivo do workflow legado; chave privada SSH autorizada para `VM_USER` |
| `VM_KNOWN_HOSTS` | `deploy.yml` | *Legado (desativado)* | Requisito exclusivo do workflow legado; entrada validada do host/porta no `known_hosts` |

> Os segredos `VM_*` pertencem exclusivamente ao workflow legado `deploy.yml` (atualmente desativado). Não são necessários para o fluxo padrão de publicação via `deadlock-deploy`.

### 2. Infraestrutura central e exposição pública HTTPS (`deadlock-deploy`)

A publicação externa e a terminação TLS do portal são providas pela infraestrutura central [`deadlock-deploy`](https://github.com/univates-deadlock/deadlock-deploy), já implantada na VM.

- **Caddy de borda unificado (`deadlock-edge`):** Um container Caddy compartilhado ocupa as portas públicas `80` (HTTP) e `443` (HTTPS e HTTP/3), emitindo e renovando certificados TLS automaticamente via ACME.
- **Rede Docker compartilhada (`deadlock_edge`):** O `compose.yaml` deste portal declara a rede externa `deadlock_edge`. Com isso, o container `deadlock-portal` comunica-se diretamente com o proxy de borda sem expor portas 80/443 adicionais no host.
- **Roteamento oficial:** No `infra/edge/Caddyfile` do `deadlock-deploy`, o domínio oficial do portal já se encontra configurado e apontado para o serviço interno:

```caddyfile
deadlock.matbdev.com {
    reverse_proxy deadlock-portal:8080
}
```

Dessa forma, **não adicione publicações de porta 80/443 ao portal** nem altere arquivos de outros projetos (como o site institucional). O Caddy interno do container escuta na porta `8080` (mapeada para `127.0.0.1:8081` no loopback da VM para testes locais e health checks) e o Caddy de borda central responde externamente por [`deadlock.matbdev.com`](https://deadlock.matbdev.com).

### 3. Operação e diagnóstico

```bash
# Diagnóstico local do container do portal na VM
sudo docker compose -f ~/deadlock-portal/compose.yaml ps
sudo docker compose -f ~/deadlock-portal/compose.yaml logs --tail=100 web
curl -i http://127.0.0.1:8081/health

# Diagnóstico do ingress central e status da infraestrutura
sudo docker ps --filter name=deadlock-edge
sudo docker logs --tail=50 deadlock-edge
cat ~/.local/state/deadlock-deploy/portal.sha
```

Para investigar execuções de entrega:
1. Em **Actions → Notify central CD** neste repositório, confirme que a notificação por dispatch retornou código HTTP 204.
2. Em **Actions → Deploy Deadlock** no repositório [`deadlock-deploy`](https://github.com/univates-deadlock/deadlock-deploy), acompanhe a compilação, o reload do container e a validação do health check executados pelo runner na VM.

## Equipe

- [Alexandra Padilha](https://github.com/alexandrapadilha1) — frontend e site institucional.
- [Diogo Felipe Zanco](https://github.com/DiogoFZanco) — frontend.
- [Mateus Carniel Brambilla](https://github.com/matbdev) — DevOps, backend e infraestrutura.
- [Tainá Luiza Schmidt](https://github.com/TainaSchmidt) — backend.

As atribuições refletem o escopo do projeto acadêmico, não cargos profissionais.

## Metadados do GitHub

**Descrição:** Portal da equipe Deadlock — projetos, integrantes e desenvolvimento de software na Univates.

**Topics:** `deadlock`, `portfolio`, `landing-page`, `html`, `css`, `javascript`, `caddy`, `docker`, `github-actions`, `devops`, `univates`, `techpro` (definidos também em [`docs/github-topics.json`](docs/github-topics.json))

**Homepage:** https://deadlock.matbdev.com

## Licença e identidade

Código disponibilizado para fins de demonstração acadêmica. Sem arquivo de licença, todos os direitos permanecem com seus respectivos autores; adicione uma licença explícita com aprovação da equipe antes de conceder direitos de reutilização irrestrita.
