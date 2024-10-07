.PHONY: build-development
build-development: 
		docker compose -f docker-compose.yml -f docker-compose.dev.yml build

.PHONY: start-development
start-development: 
		docker compose -f docker-compose.yml -f docker-compose.dev.yml up

.PHONY: stop-development
stop-development:
		docker compose -f docker-compose.yml -f docker-compose.dev.yml down

.PHONY: build-production
build-production:
		docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

.PHONY: start-production
start-production:
		docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

.PHONY: stop-production
stop-production:
		docker compose -f docker-compose.yml -f docker-compose.prod.yml down
