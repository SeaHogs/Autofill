(function () {
  const dummyData = {
    fullName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
  };
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

  function autofillField(field) {
    const label = getFieldLabel(field).toLowerCase();
    const text = [label, field.name, field.id, field.placeholder]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (field.readOnly || field.disabled) {
      return;
    }

    if (/\b(first|given)\s*name\b/.test(text)) {
      field.value = dummyData.firstName;
    } else if (/\b(last|family|surname)\s*name?\b/.test(text)) {
      field.value = dummyData.lastName;
    } else if (text.includes('email')) {
      field.value = dummyData.email;
    } else if (/\bname\b/.test(text)) {
      field.value = dummyData.fullName;
    }
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
        autofillField(field);
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
