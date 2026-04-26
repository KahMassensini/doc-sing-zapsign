# API de Gestão de Documentos e Signatários

## Sobre o Projeto

API REST desenvolvida como parte do teste técnico da ZapSing, com o objetivo de gerenciar documentos e signatários, permitindo a criação, envio e acompanhamento de contratos digitais.
A solução foi projetada para simular um fluxo real de assinaturas, priorizando organização, escalabilidade e boas práticas de desenvolvimento.

## Funcionalidades

### Gestão de Entidades 

- __CRUD Full Dinâmico:__ Gerenciamento completo de Companies (Empresas), Documents (Documentos) e Signers (Signatários).
- __Interface Fluid UX:__ Operações de criação, leitura, edição e exclusão realizadas sem recarregamento de página.

### Integração Nativa ZapSign

- __Sincronização Automática:__ Ao criar um documento na plataforma, o arquivo é enviado instantaneamente para a API da ZapSign.
- __Persistência de Metadados:__ Armazenamento seguro de token e open_id retornados pela ZapSign para rastreabilidade e ações futuras.

### Inteligência Documental

- __Análise de Conteúdo Automática:__ Processamento de documentos via IA logo após o salvamento.
- __Painel de Insights:__ Exibição estruturada contendo:
  - _Tópicos Faltantes:_ Identificação de lacunas ou cláusulas ausentes.
  - _Resumo Executivo:_ Visão simplificada do conteúdo.
  - _Insights Úteis:_ Dados estratégicos extraídos do texto.

### API para Integração

Exposição de Endpoints RESTful autenticados para que clientes externos integrem seus fluxos de trabalho:
- __POST /documents:__ Criação e envio de documentos.
- __GET /analysis:__ Consulta de novas análises de IA.
- __GET /reports:__ Geração de relatórios de status e métricas.

### Estabilidade e Qualidade

- __Monitoramento via Testes:__ Suíte de testes automatizados que cobrem as rotas críticas e as funcionalidades principais do sistema, garantindo resiliência contra regressões.

## Tecnologias Utilizadas

- __Backend:__ Django + Django REST Framework (DRF) com PostgreSQL.
- __Frontend:__ Angular com componentes reativos.
- __Automação:__ n8n para integração de fluxos externos.
- __Inteligência Artificial:__ OpenAI para análise de conteúdo.
- __Infraestrutura:__ Docker e Docker Compose.
- __Testes:__ Pytest e Jest 

## Como Executar o Projeto

### Pré-requisitos
<ol>
  <li> Git </li>
  <li> Docker e Docker Compose (recomendado) </li>
</ol>

### Passos

```bash
# Clone o repositório
git clone <url-do-repo>

# Acesse a pasta
cd nome-do-projeto

# Subir os serviços
docker-compose up --build
```

## Autora

| [<img src="https://avatars.githubusercontent.com/u/60409021?v=4" width=100><br><sub>Karinne Pereira</sub>](https://github.com/KahMassensini) |
| :----: |
