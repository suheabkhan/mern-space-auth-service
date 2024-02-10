FROM node:18-alpine as builder

WORKDIR /app

# will copy package.json,package-lock.json into /app
COPY package*.json ./

# to install the dependecies, to install the same dependencies as the same versions as that of the package-lock.json
RUN npm ci 

COPY . .

#build the js file
RUN npm run build

# for production image, we need to minimize the size of the image. we only need the build folder that will be be copied from builder

FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

#ignore the scripts that are inside the node_module packages
#remove the dev dependencies
RUN npm ci --ignore-scripts 

COPY --from=builder /app/dist ./

EXPOSE 5500

CMD ["node", "src/server.js"]



