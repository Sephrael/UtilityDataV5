# Developer Setup & Deployment Instructions

This guide details how to set up a fresh computer to develop, build, and deploy the **DadUtility** application.

## Choose Your Workflow

| Workflow | Best For | Prerequisites | Admin Rights? |
| :--- | :--- | :--- | :--- |
| **A. GitHub Codespaces** | Work computers, quick edits, zero setup | GitHub Account | **No** |
| **B. Local Docker** | Consistent dev environment, clean system | Docker Desktop, VS Code | Yes (to install Docker) |
| **C. Native Node.js** | Traditional dev, maximum performance | Node.js, Git | Yes (to install Node) |

---

## A. GitHub Codespaces (Cloud-Based)
*Recommended if you cannot install software on your machine.*

1.  **Navigate to GitHub**: Go to the repository page.
2.  **Create Codespace**:
    *   Click the green **Code** button.
    *   Select the **Codespaces** tab.
    *   Click **Create codespace on main**.
3.  **Wait for Setup**: GitHub will build the container (installing Node, Wine, etc.). This takes ~2 minutes the first time.
4.  **Start Developing**:
    *   The VS Code editor will open in your browser.
    *   Open the terminal (Ctrl+`) and run:
        ```bash
        npm run dev
        ```
5.  **Build/Deploy**:
    *   **Web (Docker)**: `npm run docker:build` (Note: running docker-in-docker inside Codespaces has limitations, stick to `npm run dev` for preview).
    *   **Windows App**: `npm run electron:build:win`. The `.exe` will appear in `dist/`. Right-click to download.

---

## B. Local Docker Setup (Containerized)
*Recommended for keeping your machine clean and ensuring cross-platform consistency.*

### 1. Prerequisites
*   **Install Docker Desktop**: [Download Here](https://www.docker.com/products/docker-desktop/)
*   **Install VS Code**: [Download Here](https://code.visualstudio.com/)
*   **Install "Dev Containers" Extension**: In VS Code, search for `ms-vscode-remote.remote-containers` and install.

### 2. Setup
1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd DadUtility
    ```
2.  **Open in VS Code**:
    ```bash
    code .
    ```
3.  **Reopen in Container**:
    *   You should see a popup: *"Folder contains a Dev Container configuration file..."* -> Click **Reopen in Container**.
    *   *Or*: Press `F1` -> Type "Dev Containers: Reopen in Container".
4.  **Wait**: Docker will build the environment.

### 3. Development
*   **Run Dev Server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:5173`.

### 4. Build & Deploy
*   **Build Production Image**:
    ```bash
    npm run docker:build
    ```
*   **Run Production Container**:
    ```bash
    npm run docker:run
    ```
    Access at `http://localhost:8080`.

---

## C. Native Node.js Setup (Traditional)
*Use this if you don't want to use Docker.*

### 1. Prerequisites
*   **Install Node.js (v20 LTS)**: [Download Here](https://nodejs.org/)
*   **Install Git**: [Download Here](https://git-scm.com/)

### 2. Setup
1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd DadUtility
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```

### 3. Development
*   **Run Dev Server**:
    ```bash
    npm run dev
    ```
    *Note: This runs the web version. To run the full Electron desktop app locally:*
    ```bash
    npm run electron:dev
    ```

### 4. Build
*   **Build Web App**:
    ```bash
    npm run build
    ```
*   **Build Electron App**:
    ```bash
    npm run electron:build
    ```
    *Note: Building for Windows on a Mac requires Wine, which is hard to set up natively. Use the Docker method for cross-compilation.*
