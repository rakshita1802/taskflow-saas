FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm install --production

# Install sequelize-cli globally to run migrations in container
RUN npm install -g sequelize-cli

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
# We use a shell script or directly run start, but in production we should run migrations before start
# For simplicity, we just run the server. Migrations can be run manually or via an init container.
CMD ["npm", "start"]
