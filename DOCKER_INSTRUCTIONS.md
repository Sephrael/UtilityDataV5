# Docker Instructions

## Development Container

The development container is a full environment with all dependencies, including system libraries required for Electron and Wine (for Windows builds). It is designed to be used with VS Code Dev Containers or run interactively.

### 1. Build the Development Image
Run the following command to build the image targeting the `development` stage:

```bash
npm run docker:build:dev
# OR manually:
docker build --target development -t dadutility-dev .
```

### 2. Run the Development Container
To run the container and drop into a shell (useful for debugging or manual builds):

```bash
docker run -it -p 5173:5173 -v $(pwd):/workspace dadutility-dev bash
```
*   `-it`: Interactive terminal.
*   `-p 5173:5173`: Maps port 5173 (Vite) to your host.
*   `-v $(pwd):/workspace`: Mounts your current directory to `/workspace` in the container so changes persist.

**Note:** If you are using VS Code, it is recommended to use the **Dev Containers** extension. Open the project and click "Reopen in Container".

---

## Production Container

The production container is a lightweight Nginx server that serves only the built static assets. It does not contain Node.js, source code, or build tools.

### 1. Build the Production Image
Run the following command to build the image targeting the `production` stage:

```bash
npm run docker:build
# OR manually:
docker build --target production -t dadutility .
```

### 2. Run the Production Container
To serve the application:

```bash
npm run docker:run
# OR manually:
docker run -p 8080:80 dadutility
```
*   Access the app at `http://localhost:8080`.
