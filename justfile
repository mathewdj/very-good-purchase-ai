lint-backend:
    cd backend && jenv exec ./gradlew ktlintCheck

lint-backend-format:
    cd backend && jenv exec ./gradlew ktlintFormat

lint-frontend:
    cd frontend && npm run lint

lint: lint-backend lint-frontend

test-backend:
    cd backend && jenv exec ./gradlew test

test-frontend:
    echo "No frontend tests configured yet"

test: test-backend test-frontend

up:
    docker compose up --build

down:
    docker compose down
