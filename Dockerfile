FROM node:22-slim

# Install compilers and runtimes for all supported languages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ make \
    python3 \
    default-jdk-headless \
    golang \
    rustc \
    ruby \
    ghc cabal-install \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
