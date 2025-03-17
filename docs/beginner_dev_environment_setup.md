# Beginner-Friendly Development Environment Setup

This guide will walk you through setting up the development environment for the ConfidentKids application. These instructions are designed for beginners with minimal technical experience.

## Prerequisites

Before starting, make sure you have:

1. A computer running Windows, macOS, or Linux
2. Administrator access to install software
3. A stable internet connection
4. At least 4GB of free disk space

## Step 1: Install Node.js

Node.js is the foundation for running JavaScript applications like ConfidentKids.

### For Windows:

1. Go to [nodejs.org](https://nodejs.org/)
2. Click the "LTS" (Long Term Support) download button
   ![Node.js Download](https://i.imgur.com/JQZvKTZ.png)

3. Run the downloaded installer
4. Follow the installation wizard:
   - Click "Next" on the welcome screen
   - Accept the license agreement and click "Next"
   - Keep the default installation location and click "Next"
   - On the custom setup screen, make sure "npm package manager" is selected and click "Next"
   - Click "Install"
   - Click "Finish" when complete

### For macOS:

1. Go to [nodejs.org](https://nodejs.org/)
2. Click the "LTS" download button
3. Run the downloaded .pkg installer
4. Follow the installation wizard
5. Enter your password when prompted

### For Linux (Ubuntu/Debian):

1. Open Terminal
2. Run these commands:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

### Verify Installation:

1. Open Command Prompt (Windows) or Terminal (macOS/Linux)
2. Type `node -v` and press Enter
3. You should see a version number like `v18.17.1`
4. Type `npm -v` and press Enter
5. You should see another version number like `9.6.7`

## Step 2: Install Visual Studio Code

Visual Studio Code is a free code editor that makes development easier.

1. Go to [code.visualstudio.com](https://code.visualstudio.com/)
2. Click the download button for your operating system
   ![VS Code Download](https://i.imgur.com/LqTzJHh.png)

3. Run the installer and follow the prompts
4. Launch Visual Studio Code after installation

## Step 3: Install Git

Git is required for version control and working with GitHub.

### For Windows:

1. Go to [git-scm.com](https://git-scm.com/)
2. Click "Download for Windows"
3. Run the installer and use these settings:
   - Accept the license agreement
   - Choose the default installation location
   - Select components (use defaults)
   - Choose default editor (Nano is a good choice for beginners)
   - Choose "Git from the command line and also from 3rd-party software"
   - Choose "Use the OpenSSL library"
   - Choose "Checkout Windows-style, commit Unix-style line endings"
   - Choose "Use MinTTY"
   - Choose "Default" for git pull
   - Choose "Git Credential Manager"
   - Enable file system caching
   - Click "Install"

### For macOS:

1. If you have Homebrew installed:
   ```bash
   brew install git
   ```

2. Otherwise, go to [git-scm.com](https://git-scm.com/), download the macOS installer, and run it

### For Linux:

```bash
sudo apt update
sudo apt install git
```

### Verify Installation:

1. Open Command Prompt (Windows) or Terminal (macOS/Linux)
2. Type `git --version` and press Enter
3. You should see a version number like `git version 2.40.0`

## Step 4: Clone the Repository

Now you'll download the ConfidentKids code from GitHub to your computer.

1. Make sure you've completed the [GitHub Setup Guide](./beginner_github_setup.md) first

2. Open Command Prompt (Windows) or Terminal (macOS/Linux)

3. Navigate to where you want to store the project:
   ```bash
   # Windows example
   cd C:\Users\YourUsername\Documents
   
   # macOS/Linux example
   cd ~/Documents
   ```

4. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/confident-kids-app.git
   ```
   (Replace "YourUsername" with your actual GitHub username)

5. Navigate into the project folder:
   ```bash
   cd confident-kids-app
   ```

## Step 5: Install Project Dependencies

Now you'll install all the packages needed for the project.

1. In Command Prompt/Terminal, make sure you're in the project folder (from Step 4)

2. Install pnpm (a faster package manager):
   ```bash
   npm install -g pnpm
   ```

3. Install project dependencies:
   ```bash
   pnpm install
   ```

4. This may take a few minutes. You'll see a lot of text scrolling by - this is normal!

## Step 6: Set Up Environment Variables

Environment variables store sensitive information like API keys.

1. In your project folder, find the file named `.env.example`

2. Create a new file named `.env.local` in the same folder
   - In VS Code: Right-click in the file explorer, select "New File", and name it `.env.local`
   - Or copy the example file: 
     ```bash
     # Windows
     copy .env.example .env.local
     
     # macOS/Linux
     cp .env.example .env.local
     ```

3. Open `.env.local` in VS Code and replace the placeholder values with your actual API keys
   (You'll get these keys when setting up external services - see [Updated External Services Setup](./updated_external_services_setup.md))

## Step 7: Install Wrangler CLI

Wrangler is Cloudflare's command-line tool for working with Workers and D1 database.

1. In Command Prompt/Terminal:
   ```bash
   pnpm install -g wrangler
   ```

2. Verify installation:
   ```bash
   wrangler --version
   ```
   You should see a version number like `3.0.0`

## Step 8: Start the Development Server

Now you'll run the application locally to test it.

1. In Command Prompt/Terminal:
   ```bash
   pnpm dev
   ```

2. You should see output indicating the server is starting

3. Once you see "ready in XXXms", the application is running

4. Open your web browser and go to: `http://localhost:3000`

5. You should see the ConfidentKids application homepage

## Step 9: Install VS Code Extensions

These extensions will make development easier:

1. Open VS Code

2. Click the Extensions icon in the left sidebar (or press Ctrl+Shift+X)
   ![VS Code Extensions](https://i.imgur.com/Y1JQwSO.png)

3. Search for and install these extensions:
   - ESLint
   - Prettier - Code formatter
   - Tailwind CSS IntelliSense
   - GitHub Pull Requests and Issues

## Step 10: Basic Development Workflow

Here's how to make changes to the code:

1. Open the project in VS Code:
   ```bash
   code .
   ```

2. Make changes to files in the `src` folder

3. Save your changes (Ctrl+S or Cmd+S)

4. The development server will automatically update with your changes

5. To stop the development server, press Ctrl+C in the terminal

## Troubleshooting Common Issues

### "Module not found" errors
- Run `pnpm install` again to ensure all dependencies are installed
- Check that you're in the correct project directory

### "Port 3000 is already in use"
- Another application is using port 3000
- Stop the other application, or use a different port:
  ```bash
  pnpm dev -- -p 3001
  ```

### "Command not found" errors
- Make sure you've installed all required software
- Try closing and reopening your terminal

### Environment variable problems
- Make sure `.env.local` exists and contains all required variables
- Check for typos in variable names
- Restart the development server after changing environment variables

## Next Steps

After setting up your development environment:

1. Follow the [Updated External Services Setup](./updated_external_services_setup.md) guide
2. Explore the codebase to understand its structure
3. Make small changes to test that everything is working

For more help, refer to the [Troubleshooting Guide](./troubleshooting_guide.md) or contact your developer support team.
