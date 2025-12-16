# Använd en officiell Node.js image
FROM node:18-alpine

# Skapa app-katalog
WORKDIR /usr/src/app

# Kopiera package.json och package-lock.json först (för snabbare build)
COPY package*.json ./

# Installera dependencies
RUN npm install --production

# Kopiera resten av koden
COPY . .

# Exponera port (samma som i din app, t.ex. 3000)
EXPOSE 3000

# Starta appen
CMD ["node", "src/server.js"]
