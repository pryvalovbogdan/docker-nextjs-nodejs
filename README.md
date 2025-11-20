# Dockerized Next.js & Node.js App

This project is a full-stack e-commerce application for medical products, built with a modern tech stack and fully containerized using Docker.

## 🏗 Tech Stack

*   **Frontend**: [Next.js](https://nextjs.org/) (React), Chakra UI, TypeScript.
*   **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), TypeORM, TypeScript.
*   **Database**: [PostgreSQL](https://www.postgresql.org/).
*   **Infrastructure**: [Docker](https://www.docker.com/), Docker Compose, Nginx (Reverse Proxy).

## 🚀 Prerequisites

*   [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.
*   Git.

## 🛠 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd docker-nextjs-nodejs
    ```

2.  **Environment Variables:**
    Ensure you have a `.env` file in the root directory. (Refer to `.env.example` if available, or ask the team for the secrets).

3.  **Start the Application (Development):**
    ```bash
    docker compose up --build
    ```
    *   **Frontend**: [http://localhost:3000](http://localhost:3000)
    *   **Backend API**: [http://localhost:8080](http://localhost:8080)
    *   **Nginx**: [http://localhost:80](http://localhost:80)

## 🐳 Docker Commands

### Development

*   **Start Services**:
    ```bash
    docker compose up
    ```
    Add `-d` to run in detached mode (background).

*   **Stop Services**:
    ```bash
    docker compose down
    ```

*   **Rebuild Containers**:
    Use this if you installed new packages or changed Dockerfiles.
    ```bash
    docker compose up --build
    ```

*   **Clean Rebuild (Fix for "Exec format error" / Architecture issues)**:
    If you switch between architectures (e.g., Mac ARM64 vs Linux) or encounter `bcrypt` errors, run this to clear volumes and cache:
    ```bash
    docker compose down -v
    docker compose build --no-cache
    docker compose up
    ```

### Production

The production setup uses `docker-compose.prod.yaml` and enforces resource limits.

*   **Start Production Services**:
    ```bash
    docker compose -f docker-compose.prod.yaml up --build
    ```

## 📂 Project Structure

*   `front-end/`: Next.js application source code.
*   `back-end/`: Node.js/Express API source code.
*   `nginx/`: Nginx configuration files.
*   `docker-compose.yaml`: Development Docker configuration.
*   `docker-compose.prod.yaml`: Production Docker configuration with resource limits.

## 🔧 Troubleshooting

### `Exec format error` (bcrypt)
If you see an error related to `bcrypt_lib.node` or `Exec format error`, it means there is an architecture mismatch (e.g., using Mac binaries in a Linux container).

**Fix:**
1.  Ensure `docker-compose.yaml` has the volume `/app/node_modules` for the server.
2.  Run a clean rebuild:
    ```bash
    docker compose down -v
    docker compose up --build
    ```
