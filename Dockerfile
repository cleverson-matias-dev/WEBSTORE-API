# --- Estágio 1: Base (Comum) ---
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# --- Estágio 2: Dependências de Desenvolvimento ---
# Usado para o ambiente de DEV (roda o npm install completo)
FROM base AS development
RUN npm install
COPY . .
# O comando padrão de dev continua sendo o que você já usa
CMD ["npm", "run", "dev"]

# --- Estágio 3: Build (Compilação) ---
# Estágio intermediário para gerar o código JS
FROM development AS builder
RUN npm run build

# --- Estágio 4: Homologação/Produção ---
# Imagem final: limpa, leve e sem código TS ou node_modules de dev
FROM base AS production
# Instala apenas o necessário para rodar (ignora devDependencies)
RUN npm install --omit=dev
# Copia apenas o que foi compilado do estágio builder
COPY --from=builder /usr/src/app/build ./build
# Expor a porta
EXPOSE 3000
# Roda o código compilado
CMD ["node", "build/main.js"]
