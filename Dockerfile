FROM node:22-alpine

WORKDIR /app

# Install pnpm globally (required by n8n tooling)
RUN npm install -g pnpm

# Set up pnpm environment
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV N8N_LOG_LEVEL=debug
RUN mkdir -p $PNPM_HOME

COPY package.json package-lock.json ./

# Install n8n node CLI using pnpm (as required by the package)
RUN pnpm install --global @n8n/node-cli

# Install project dependencies with npm
RUN npm install

COPY . .

RUN n8n-node build

EXPOSE 5678


CMD [ "n8n-node", "dev" ]

