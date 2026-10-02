# Publish on GitHub Pages

The docs folder is the complete publishable app, including index.html, charts, fonts, and maps. It is prepared for the Cardio-AI repository.

1. Upload the entire docs folder to the repository root, beside cardioguide-main. Include docs/.nojekyll.
2. Open repository Settings → Pages.
3. Source: Deploy from a branch. Branch: main. Folder: /docs. Save.
4. GitHub displays the live website link when deployment finishes.

If the repository name changes, run: node prepare-github-pages.cjs YOUR-REPOSITORY-NAME and upload docs again.

The original cardioguide-main folder remains the local development copy.
