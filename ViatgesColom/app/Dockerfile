# Utilitza una imatge oficial de Node.js com a base
FROM node:20-alpine

# Estableix el directori de treball dins del contenidor
WORKDIR /app

# Copia els fitxers de definició de dependències
COPY package.json package-lock.json* ./

# Instal·la les dependències del projecte
RUN npm install

# Copia la resta de fitxers de l'aplicació
COPY . .

# Exposa el port que Vite utilitza per al servidor de desenvolupament
EXPOSE 5173

# La comanda per arrencar l'aplicació en mode de desenvolupament
CMD ["npm", "run", "dev", "--", "--host"]
