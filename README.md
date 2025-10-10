# Mixology Tales - Setup Guide for Beginners

A beautiful cocktail recipe website where you can discover, browse, and explore cocktail recipes.

## What You'll Need

Before you start, you need to install **Node.js** on your computer. Node.js is a free program that lets you run this website on your computer.

### Step 1: Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the version labeled **"LTS"** (Long Term Support) - this is the recommended version
3. Run the installer and follow the instructions (just click "Next" for everything)
4. Restart your computer after installation

To check if it installed correctly:
- **Windows**: Open "Command Prompt"
- **Mac**: Open "Terminal"
- Type: `node --version` and press Enter
- You should see something like `v20.x.x` or similar

---

## Step 2: Download This Project

1. Download all the project files to a folder on your computer
   - If you got this as a ZIP file, extract it to a folder like `Documents/mixology-tales`
   - If you're using Git, open Terminal/Command Prompt and type:
     ```
     git clone [your-repository-url]
     ```

---

## Step 3: Install Required Components

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to the project folder:
   - Type `cd` followed by a space
   - Drag the project folder into the Terminal/Command Prompt window (this will paste the path)
   - Press Enter

   Example:
   ```
   cd /Users/yourname/Documents/mixology-tales
   ```

3. Install the components by typing:
   ```
   npm install
   ```
4. Wait for it to finish (this might take 1-2 minutes)

---

## Step 4: Start the Website

1. In the same Terminal/Command Prompt window, type:
   ```
   npm run dev
   ```

2. You should see a message like:
   ```
   Local: http://localhost:5173
   ```

3. Open your web browser (Chrome, Firefox, Safari, etc.)

4. Type this address in the address bar:
   ```
   http://localhost:5173
   ```

5. **You're done!** The website should now be running on your computer.

---

## How to Stop the Website

- Go back to the Terminal/Command Prompt window
- Press `Ctrl + C` (on both Windows and Mac)
- The website will stop running

---

## How to Start It Again Later

1. Open Terminal/Command Prompt
2. Navigate to the project folder:
   ```
   cd /path/to/your/project
   ```
3. Type:
   ```
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser

---

## Troubleshooting

### "npm: command not found" or "node: command not found"
- Node.js isn't installed correctly. Go back to Step 1 and reinstall it.
- Make sure to restart your computer after installing Node.js.

### Port already in use
- If you see an error about port 5173 being in use, try closing other programs or use a different port:
  ```
  npm run dev -- --port 3000
  ```
- Then visit `http://localhost:3000` instead.

### Nothing happens when I open localhost:5173
- Make sure the `npm run dev` command is still running in Terminal/Command Prompt
- Try refreshing the browser page
- Check that you typed the address correctly

### The website looks broken or has errors
- Make sure you ran `npm install` completely without errors
- Try deleting the `node_modules` folder and running `npm install` again

---

## Need Help?

If you're stuck:
1. Make sure you followed each step in order
2. Try restarting your computer and starting from Step 3
3. Check that Node.js is installed by typing `node --version` in Terminal/Command Prompt
