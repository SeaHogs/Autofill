(async function () {
  // Dynamically load dependencies since content scripts aren't modules
  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Load TensorFlow.js and Universal Sentence Encoder
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder');

  // Dummy data for autofill
  const dummyData = {
    fullName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
  };

  // Predefined intents for semantic classification
  const intents = ['first name', 'last name', 'email address', 'full name'];
  let model, intentEmbeddings;

  // Load the USE model and compute intent embeddings
  async function initNLP() {
    model = await use.load();
    const intentTensors = await model.embed(intents);
    intentEmbeddings = await intentTensors.array();
  }

  // Compute cosine similarity between two vectors
  function cosine(a, b) {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  // Classify a field's combined text into one of our intents
  async function classifyField(text) {
    const [fieldEmb] = await (await model.embed([text])).array();
    let best = { intent: null, score: 0 };
    intentEmbeddings.forEach((emb, i) => {
      const score = cosine(fieldEmb, emb);
      if (score > best.score) best = { intent: intents[i], score };
    });
    return best.score > 0.7 ? best.intent : null;
  }

  // Initialize NLP before proceeding
  await initNLP();

  // Keep track of fields already seen
  const seen = new WeakSet();

  // Derive a human-readable label for a field
  function getFieldLabel(field) {
    const byId = field.id ? document.querySelector(`label[for=\"${field.id}\"]`) : null;
    const labelText = byId ? byId.textContent.trim() : '';
    return (
      field.getAttribute('aria-label') ||
      labelText ||
      field.name ||
      field.placeholder ||
      '(unlabeled)'
    );
  }

  // Autofill logic with regex rules and semantic fallback
  async function autofillField(field) {
    const label = getFieldLabel(field).toLowerCase();
    const text = [label, field.name, field.id, field.placeholder]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (field.readOnly || field.disabled) return;

    // Exact-pattern matching first
    if (/\b(first|given)\s*name\b/.test(text)) {
      field.value = dummyData.firstName;
    } else if (/\b(last|family|surname)\s*name?\b/.test(text)) {
      field.value = dummyData.lastName;
    } else if (text.includes('email')) {
      field.value = dummyData.email;
    } else if (/\bname\b/.test(text)) {
      field.value = dummyData.fullName;
    } else {
      // Semantic fallback via USE embeddings
      const intent = await classifyField(text);
      switch (intent) {
        case 'first name':
          field.value = dummyData.firstName;
          break;
        case 'last name':
          field.value = dummyData.lastName;
          break;
        case 'email address':
          field.value = dummyData.email;
          break;
        case 'full name':
          field.value = dummyData.fullName;
          break;
      }
    }
  }

  // Detect and autofill new fields
  function logNewFields() {
    const fields = document.querySelectorAll('input, textarea, select');
    fields.forEach((field) => {
      if (!seen.has(field)) {
        seen.add(field);
        console.log('Field found:', getFieldLabel(field), field);
        autofillField(field);
      }
    });
  }

  // Observe DOM for dynamically added fields
  function observeFields() {
    const observer = new MutationObserver(logNewFields);
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Kick things off when DOM is ready
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
