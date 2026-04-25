# **Web Store Api \[monolito modular]** 🚀

## Módulos \[identity, catalog, stock]



**Descrição:** Essa api permite o gerenciamento completo de um e-commerce 

com produtos, estoques, pedidos, vendas, notificações e mais. Construida no ecossistema

docker cria suas próprias dependências como banco de dados, gateway, mensageria e cache.

Abaixo segue uma lista de características e tecnologias usadas nesse projeto: 

[Ver Características](#características)


## 🛠 Tecnologias
- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [TypeORM](https://typeorm.io)
- [MySQL](https://www.mysql.com)

## 📋 Pré-requisitos (desenvolvimento)
- Docker
- Node.js (versão 22 ou superior)
- Gerenciador de pacotes (npm)

## 🔧 Instalação e Execução (desenvolvimento)

1 . Clone o repositório:
  ```bash
   git clone https://github.com/cleverson-matias-dev/WEBSTORE-API.git && cd WEBSTORE-API/
  ```
2 . Instalar dependências:
   ```bash
   npm install
   ```

3 . Variáveis de ambiente:
   - Renomear .env_development para .env   

4 . Cria os contêineres [Kong, MySQL, Api] e inicia o servidor com hot reload.
   ```bash
   docker compose up
   ```


##### Características:


**DOCUMENTAÇÃO** \[swagger]

**VERSÃO** \[path]

**PADRÃO** \[REST]

**AUTENTICAÇÃO/AUTORIZAÇÃO** \[jwt, roles]

**SEGURANÇA** TLS/HTTPS \[jwt, sanitize-html, zod]

**INPUT VALIDATION** \[zod, sanitize-html]

**RATE LIMIT** \[kong]

**CORS** \[cors]

**TESTES** - UNITARIO INTEGRAÇÃO CONTRATO SEGURANÇA(SAST/DAST) CARGA/PERFORMANCE \[jest]

**MENSAGERIA** - DESACOPLAMENTO TRATAMENTO-ERRO-FILA IDEMPOTÊNCIA MONITORAMENTO \[rabbitMQ]

**OBSERVABILIDADE** - LOG-ESTRUTURADO METRICA TRACING-DISTRIBUIDO ALERTAS \[pino]

**CACHE** - CLIENTE-CDN SERVIDOR INVALIDAÇÃO \[redis]

**SECRET-MANAGERS** - EX-HASHICORP \[]

**CI/CD** \[github-actions]

**HEALTH CHECK** \[rota]

   ```

