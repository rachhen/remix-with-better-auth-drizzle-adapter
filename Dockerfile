# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.30
FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# Install node modules
COPY package.json ./
RUN bun install

# Copy application code
COPY . .

# Build application
RUN bun run build

# Remove development dependencies
RUN rm -rf node_modules && \
  bun install --ci


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

ARG PORT=8080
# Start the server by default, this can be overwritten at runtime
EXPOSE ${PORT}
CMD [ "bun", "run", "start" ]
# ENTRYPOINT [ "./start.sh" ]