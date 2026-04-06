# 1. Imagem base leve
FROM node:22.20-alpine

# 2. Criar diretório da aplicação
WORKDIR /usr/src/app

# 3. Instalar dependências primeiro (aproveita o cache do Docker)
# Copiamos apenas os arquivos de manifesto primeiro
COPY package*.json ./

# Instala todas as dependências (incluindo as de dev como typescript e ts-node-dev)
RUN npm install

# 4. Copiar o restante do código
# Nota: No Docker Compose, o volume vai sobrescrever isso, 
# mas é boa prática para builds isolados.
COPY . .

# 5. Expor a porta da API
EXPOSE 3000

# 6. Comando para rodar em modo de desenvolvimento
# O script "dev" deve estar no seu package.json
CMD ["npm", "run", "dev"]
