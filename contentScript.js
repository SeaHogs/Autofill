(function() {
  function logTableFields() {
    const fields = document.querySelectorAll(
      'table input, table textarea, table select'
    );
    if (fields.length === 0) {
      console.log('No table form fields found.');
    } else {
      console.log('Table fields found:');
      fields.forEach(f => {
        console.log('  -', f);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logTableFields);
  } else {
    logTableFields();
  }
})();
