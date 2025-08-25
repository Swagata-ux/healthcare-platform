.PHONY: help dev-up dev-down db-migrate seed test-all e2e lint format run-k6 tf-plan tf-apply

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-up: ## Start local development environment
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	sleep 10

dev-down: ## Stop local development environment
	docker-compose down

db-migrate: ## Run database migrations
	cd services/common-lib && npm run db:migrate

seed: ## Seed database with demo data
	cd services/common-lib && npm run db:seed

test-all: ## Run all tests
	npm run test:unit
	npm run test:integration
	npm run test:contract

e2e: ## Run end-to-end tests
	cd app-mobile && npm run test:e2e

lint: ## Run linting
	npm run lint

format: ## Format code
	npm run format

run-k6: ## Run load tests
	cd ops/k6 && k6 run booking-flow.js

tf-plan: ## Terraform plan
	cd infra/terraform/envs/dev && terraform plan

tf-apply: ## Terraform apply
	cd infra/terraform/envs/dev && terraform apply

clean: ## Clean all build artifacts
	find . -name "node_modules" -type d -exec rm -rf {} +
	find . -name "dist" -type d -exec rm -rf {} +
	docker system prune -f