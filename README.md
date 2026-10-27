<div align="center">
  <img src="assets/deadlock-mark.svg" alt="Deadlock — cadeado" width="100">
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

A landing page é **100% estática**: HTML sem framework, CSS e JavaScript puro; sem dependências npm, backend, banco de dados ou etapa de build. As prévias visuais dos dois projetos são **ilustrações conceituais**, não capturas reais dos sistemas nem métricas de produção.

> **Identidade visual:** `assets/deadlock-mark.svg` é uma marca vetorial provisória no estilo cadeado, pois o arquivo original da logo Deadlock não estava disponível ao montar este repositório. Para usar a logo já aprovada pelo grupo, substitua o arquivo mantendo o nome e ajuste os favicons conforme necessário.

## Estrutura

```text
.
├── index.html                  # Página única do portal
├── 404.html                    # Página de erro para Caddy
├── css/style.css              # Layout, tokens e responsividade
├── js/main.js                 # Menu mobile, ano e reveal discreto
├── assets/                    # Marca, favicon e imagem de compartilhamento
├── tests/check_site.py        # Validação de referências locais
├── .github/workflows/
│   ├── ci.yml                 # Validação e smoke test do container
│   └── deploy.yml             # Deploy SSH na VM a partir da main
├── Dockerfile                 # Caddy Alpine
├── Caddyfile                  # HTTP interno na porta 8080
└── compose.yaml               # Container, rede e porta local 8081
```

## Rodar localmente

Pré-requisito: Python 3 (ou Docker com Compose).

```bash
git clone https://github.com/univates-deadlock/deadlock-portal.git
cd deadlock-portal
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra **http://127.0.0.1:8000/**. Para encerrar, use `Ctrl+C`. Durante o desenvolvimento inicial em `matbforge`, use `https://github.com/matbforge/deadlock-portal.git` como endereço do clone.

Com Docker, use:

```bash
docker compose up -d --build
curl -fsS http://127.0.0.1:8081/health
docker compose logs -f web
# para parar: docker compose down
```

A URL local com Docker é **http://127.0.0.1:8081/**. O Caddy dentro do container escuta na porta **8080**, mapeada apenas para o loopback da VM. Não use `8080:8080` no host: a aplicação institucional TechPro já usa a porta 8080; a mesma VM também já utiliza 80/443.

## CI/CD — GitHub Actions → VM da Univates

Fluxo:

```text
push/PR ──> CI (HTML/links/JS/Compose/Caddy via smoke test)
CI aprovado na main ──> CD (SSH com known_hosts) ──> git pull na VM
           └──> docker compose up -d --build --wait ──> GET /health
```

O CD só inicia automaticamente após o **CI da `main` concluir com sucesso** (além de aceitar `workflow_dispatch`). Foi adaptado do workflow de `univates-deadlock/techpro-institutional-page`. Para não bloquear a criação inicial do repositório, **o deploy é ignorado quando faltam secrets**. Depois de configurá-los, faça outro push em `main` ou execute **Actions → CD — Deploy Deadlock Portal → Run workflow**.

### 1. Preparar o clone na VM (somente uma vez)

Conecte-se à VM por SSH de uma rede permitida e execute **como o mesmo usuário usado por `VM_USER`**:

```bash
cd "$HOME"
git clone https://github.com/univates-deadlock/deadlock-portal.git deadlock-portal
cd deadlock-portal
sudo docker compose up -d --build --wait
curl -fsS http://127.0.0.1:8081/health
```

Se o projeto ainda estiver privado em `matbforge`, faça o clone usando a URL dessa organização e uma credencial Git autorizada na VM. Após a transferência, ajuste o remoto: `git remote set-url origin https://github.com/univates-deadlock/deadlock-portal.git`. Para repositórios privados, o VM precisa de autenticação para `git pull` independentemente da chave usada pelo Actions para acessar a VM.

A conta SSH precisa ter `sudo -n docker ...` autorizado sem prompt de senha, como no workflow institucional original. Nenhuma regra de UFW extra é necessária para a porta 8081, pois o serviço está disponível somente em `127.0.0.1` no host.

### 2. Configurar secrets organizacionais

Configure os seguintes **Actions secrets** na organização que possui o repositório. Se escolher visibilidade **Selected repositories**, inclua explicitamente o `deadlock-portal`.

| Secret | Valor esperado |
| --- | --- |
| `VM_HOST` | IP ou DNS que o runner do GitHub consegue acessar por SSH |
| `VM_USER` | Conta Linux do usuário que possui `~/deadlock-portal` |
| `VM_PORT` | Porta externa SSH configurada na VM (padrão 22 se omitido) |
| `VM_SSH_KEY` | Chave **privada** SSH autorizada para `VM_USER` |
| `VM_KNOWN_HOSTS` | Entrada validada do host/porta, incluindo `[host]:porta` quando não for 22 |

Os secrets **não são transferidos automaticamente** entre `matbforge` e `univates-deadlock`. Reative o acesso aos secrets na nova organização após mover o repositório. Não copie chaves privadas para o Git.

### 3. Tornar a página pública com HTTPS sem disputar 80/443

A VM já publica `techpro.matbdev.com` por outro Caddy, que ocupa as portas 80/443. Este portal usa **seu próprio Caddy de aplicação**, mas precisa entrar no **Caddy de borda existente** para receber um domínio HTTPS. O Compose cria uma rede Docker nomeada `deadlock_edge`.

No `compose.yaml` do **projeto institucional**, adicione a rede externa ao serviço `web`, preservando suas redes atuais:

```yaml
services:
  web:
    networks:
      - default
      - deadlock_edge

networks:
  deadlock_edge:
    external: true
```

> Trecho para mesclar, não para substituir o Compose inteiro do site institucional.

No `Caddyfile` do site institucional (Caddy de borda), adicione outro bloco além de `techpro.matbdev.com`:

```caddyfile
# Substituir por domínio real, depois de configurar o DNS apontando para a VM.
portal.example.com {
    reverse_proxy deadlock-portal:8080
}
```

Por fim, aplique as alterações do site institucional com `docker compose up -d --build` naquele projeto. **Não adicione novas publicações de porta 80/443 ao portal.** O HTTPS e os certificados ficam a cargo do Caddy de borda. A migração do domínio exige DNS, validação da acessibilidade 80/443 e escolha de nome pela equipe — não ocorre apenas pela configuração deste repositório.

### 4. Operação e diagnóstico

```bash
cd ~/deadlock-portal
sudo docker compose ps
sudo docker compose logs --tail=100 web
curl -i http://127.0.0.1:8081/health
sudo docker compose up -d --build --wait
```

Se o deploy falhar, consulte **Actions → CD — Deploy Deadlock Portal**, confirme que o repositório está clonado em `~/deadlock-portal`, que `git pull` funciona no usuário SSH e que os secrets organizacionais estão habilitados para o repositório.

## Equipe

- [Alexandra Padilha](https://github.com/alexandrapadilha1) — frontend e site institucional.
- [Diogo Felipe Zanco](https://github.com/DiogoFZanco) — frontend.
- [Mateus Carniel Brambilla](https://github.com/matbdev) — backend e infraestrutura.
- [Tainá Luiza Schmidt](https://github.com/TainaSchmidt) — backend.

As atribuições refletem o escopo do projeto acadêmico, não cargos profissionais.

## Publicar o repositório no GitHub

No computador com `gh` autenticado e Git configurado, descompacte o projeto e execute:

```bash
cd deadlock-portal
bash scripts/publish.sh
```

O script cria **`matbforge/deadlock-portal`** público, com descrição, topics, branch `main` e todos os arquivos. Ele não substitui repositórios existentes e depende da permissão de criar repositórios na organização. Para usar outro owner/nome, passe `bash scripts/publish.sh owner/repo`.

## Metadados sugeridos para o GitHub

**Descrição:** Portal da equipe Deadlock — projetos, integrantes e desenvolvimento de software na Univates.

**Topics:** `deadlock`, `portfolio`, `landing-page`, `html`, `css`, `javascript`, `caddy`, `docker`, `github-actions`, `devops`, `univates`, `techpro`

**Homepage:** preencher depois de configurar o DNS e o HTTPS.

## Licença e identidade

Código disponibilizado para fins de demonstração acadêmica. Sem arquivo de licença, todos os direitos permanecem com seus respectivos autores; adicione uma licença explícita com aprovação da equipe antes de conceder direitos de reutilização irrestrita.
