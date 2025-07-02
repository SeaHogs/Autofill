(function () {
  /**
   * Keeps track of form fields that were already reported so we do not
   * print duplicates when new nodes are inserted into the DOM.
   */
  const seen = new WeakSet();

  /**
   * Attempt to derive a human‑readable label for a field.
   * Falls back to the name or placeholder attribute.
   */
  function getFieldLabel(field) {
    const byId = field.id
      ? document.querySelector(`label[for="${field.id}"]`)
      : null;
    const labelText = byId ? byId.textContent.trim() : '';
    return (
      field.getAttribute('aria-label') ||
      labelText ||
      field.name ||
      field.placeholder ||
      '(unlabeled)'
    );
  }

  /**
   * Logs any new form fields currently in the document.
   */
  function logNewFields() {
    const fields = document.querySelectorAll('input, textarea, select');
    fields.forEach((field) => {
      if (!seen.has(field)) {
        seen.add(field);
        const label = getFieldLabel(field);
        console.log('Field found:', label, field);
      }
    });
  }

  /**
   * Observes DOM mutations so dynamically inserted form fields are
   * detected and logged.
   */
  function observeFields() {
    const observer = new MutationObserver(logNewFields);
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      logNewFields();
      observeFields();
    });
  } else {
    logNewFields();
    observeFields();
  }
})();
