FROM node:24.19.0-bookworm-slim
WORKDIR /app
COPY --chown=node:node . .
RUN mkdir -p /app/student-data && chown node:node /app/student-data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 DATA_PATH=/app/student-data/cluevera.sqlite
VOLUME ["/app/student-data"]
EXPOSE 3000
CMD ["node", "backend/server.cjs"]
