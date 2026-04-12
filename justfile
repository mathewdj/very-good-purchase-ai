lint-backend:
    cd backend && ./gradlew ktlintCheck

lint-frontend:
    cd frontend && npm run lint

lint: lint-backend lint-frontend

test-backend:
    cd backend && ./gradlew test

test-frontend:
    echo "No frontend tests configured yet"

test: test-backend test-frontend

up:
    docker compose up --build

down:
    docker compose down
