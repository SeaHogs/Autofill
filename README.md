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
4. Visit any webpage and open the browser console. The extension will
   automatically fill common name and email fields with example data and
   print a list of form fields (inputs, textareas or selects) found on that
   page, including those loaded dynamically.

## Included libraries
This extension dynamically loads TensorFlow.js version **4.16.0** and the
Universal Sentence Encoder model version **1.3.3** from jsDelivr. Pinning
specific versions ensures consistent behavior across installs.
