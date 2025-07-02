# Autofill

This repository contains a minimal browser extension that monitors the
current page for form fields and logs each one that appears. It can be used
as a starting point for auto‐filling or analysis tools. The script watches
for dynamic changes so fields that load after the initial page render are
also detected.

## Using the extension
1. Open Chrome or any Chromium‐based browser and navigate to
   `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository directory.
4. Visit any webpage and open the browser console. The extension will print
   a list of form fields (inputs, textareas or selects) found on that page,
   including those loaded dynamically.
