# Webstore API 🚀

Api completa para lojas virtuais.

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
   Renomear .env_development para .env   

4 . Cria os contêineres [Kong, MySQL, Api] e inicia o servidor
   ```bash
   docker compose up
  ```

