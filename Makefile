.PHONY: help install test build start dev docker-build docker-run tag-release

# Default target
help: ## Show this help message
	@echo "🚀 RaidHelper Web - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "📝 Examples:"
	@echo "  make install     - Install dependencies"
	@echo "  make test        - Run tests"
	@echo "  make build       - Build for production"
	@echo "  make dev         - Start development server"
	@echo "  make docker-build - Build Docker image"
	@echo "  make tag-release VERSION=1.0.0 - Create and push a release tag"

# Development
install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	npm install

test: ## Run tests
	@echo "🧪 Running tests..."
	npm test -- --coverage --watchAll=false

build: ## Build for production
	@echo "🏗️  Building for production..."
	npm run build

start: ## Start production server
	@echo "🚀 Starting production server..."
	npm start

dev: ## Start development server
	@echo "🚀 Starting development server..."
	npm run dev

# Docker
docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	docker build -f Dockerfile.ci -t raidhelper-web:latest .

docker-run: ## Run Docker container
	@echo "🐳 Running Docker container..."
	docker run -p 3000:3000 raidhelper-web:latest

# Release
tag-release: ## Create and push a release tag
	@if [ -z "$(VERSION)" ]; then \
		echo "❌ Error: VERSION is required. Usage: make tag-release VERSION=x.x.x [FORCE=1]"; \
		exit 1; \
	fi
	@if git rev-parse v$(VERSION) >/dev/null 2>&1; then \
		if [ "$(FORCE)" = "1" ]; then \
			echo "⚠️  Tag v$(VERSION) already exists. Force overwriting..."; \
			git tag -d v$(VERSION) 2>/dev/null || true; \
			git push origin :refs/tags/v$(VERSION) 2>/dev/null || true; \
		else \
			echo "❌ Error: Tag v$(VERSION) already exists!"; \
			echo "   Use 'make tag-release VERSION=$(VERSION) FORCE=1' to overwrite it."; \
			exit 1; \
		fi; \
	fi
	@echo "🏷️  Creating and pushing tag v$(VERSION)..."
	@git tag v$(VERSION)
	@git push origin v$(VERSION)
	@echo "✅ Tag v$(VERSION) created and pushed successfully!"
	@echo "🚀 Release workflow should now be triggered..."

# Catch-all rule to prevent make from interpreting --force as a target
%:
	@:
