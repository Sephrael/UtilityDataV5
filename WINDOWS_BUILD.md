# Windows Build & GitHub Setup Guide

## 1. Push to GitHub

Since you've already initialized the git repository locally, follow these steps to get it on GitHub:

1.  **Create a new repository on GitHub**:
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `DadUtility` (or whatever you prefer).
    *   **Do not** initialize with README, .gitignore, or License (we already have these).
    *   Click **Create repository**.

2.  **Push your local code**:
    *   Copy the commands under "…or push an existing repository from the command line". They will look like this (replace `YOUR_USERNAME` with your actual GitHub username):

    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/DadUtility.git
    git branch -M main
    git push -u origin main
    ```

    *   Run these commands in your terminal here on your Mac.

## 2. Build on Windows

On your Windows computer:

### Prerequisites
1.  **Install Node.js**: Download and install the LTS version from [nodejs.org](https://nodejs.org/).
2.  **Install Git**: Download and install from [git-scm.com](https://git-scm.com/).

### Clone and Build
1.  Open PowerShell or Command Prompt.
2.  Clone your new repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/DadUtility.git
    cd DadUtility
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  **Build the App**:
    Since you are on Windows, you need to run the build command.
    ```bash
    npm run build
    ```
    *Note: If the `build` script in `package.json` is set to `vite build && electron-builder`, it should detect the OS and build the Windows executable (`.exe`).*

5.  **Locate the Executable**:
    *   After the build finishes, look for a `dist` folder in the project directory.
    *   Inside `dist`, you should find the Windows installer (e.g., `DadUtility Setup X.X.X.exe`) or the unpacked executable in `dist/win-unpacked/DadUtility.exe`.

### Troubleshooting Windows Builds
*   **Missing Build Tools**: If `npm install` fails, you might need Windows Build Tools. You can install them by running this command in PowerShell as Administrator:
    ```bash
    npm install --global --production windows-build-tools
    ```
    (Alternatively, install "Desktop development with C++" via the Visual Studio Installer).
