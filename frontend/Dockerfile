# ---- Stage 1: Build React app ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---- Stage 2: Serve with Nginx ----
FROM nginx:stable-alpine

# Copy build artifacts from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 5172

CMD ["nginx", "-g", "daemon off;"]
