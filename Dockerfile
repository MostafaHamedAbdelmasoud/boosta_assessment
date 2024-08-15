FROM node:19 as base

# 
FROM base as local
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
EXPOSE 4000
CMD ["npm","run", "dev"]


# 
FROM base as development
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
EXPOSE 4000
CMD ["npm","run", "dev"]

# 
FROM base as production
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . .
EXPOSE 4000
CMD ["npm","run", "start"]


FROM mysql
EXPOSE 3306