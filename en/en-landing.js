// NOTE: Web3Forms submit handler for English intent landing pages only (no hero shuffle or other site JS).
(function setupEnLandingForms() {
  const forms = Array.from(document.querySelectorAll('[data-en-landing-form]'));
  if (forms.length === 0) return;

  const web3FormsEndpoint = 'https://api.web3forms.com/submit';

  forms.forEach((form) => {
    const emailInput = form.querySelector('[data-en-landing-email]');
    const textarea = form.querySelector('[data-en-landing-message]');
    const submitBtn = form.querySelector('[data-en-landing-submit]');
    const statusEl = form.querySelector('[data-en-landing-status]');
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    if (!emailInput || !textarea || !submitBtn || !statusEl || !accessKeyInput) return;

    const serviceName = (form.dataset.serviceName || '').trim();
    let isSending = false;
    let isSent = false;

    const setStatus = (message, state) => {
      statusEl.textContent = message;
      if (state) {
        statusEl.dataset.state = state;
      } else {
        delete statusEl.dataset.state;
      }
    };

    const render = () => {
      const hasValidEmail = emailInput.value.trim().length > 0 && emailInput.checkValidity();
      const hasText = textarea.value.trim().length > 0;
      const shouldDisable = isSent || !hasValidEmail || !hasText || isSending;

      emailInput.disabled = isSending || isSent;
      textarea.disabled = isSending || isSent;
      submitBtn.disabled = shouldDisable;
      submitBtn.classList.toggle('is-inactive', shouldDisable);
    };

    const sendRequest = async () => {
      const email = emailInput.value.trim();
      const description = textarea.value.trim();
      const accessKey = accessKeyInput.value.trim();

      if (!email || !emailInput.checkValidity()) {
        setStatus('Enter a valid email address first.', 'error');
        render();
        return;
      }

      if (!description) {
        setStatus('Add a short project brief first.', 'error');
        render();
        return;
      }

      if (!accessKey || accessKey.startsWith('REPLACE_WITH_')) {
        setStatus('Form is not configured yet. Please try again later.', 'error');
        render();
        return;
      }

      const formData = new FormData(form);
      const fullDescription = [
        `Service: ${serviceName}`,
        `Page: ${window.location.href}`,
        '',
        'Project brief:',
        description,
      ]
        .filter(Boolean)
        .join('\n');

      formData.set('subject', `EN landing: ${serviceName}`);
      formData.set('email', email);
      formData.set('service_name', serviceName);
      formData.set('description', fullDescription);
      formData.set('replyto', email);

      isSending = true;
      setStatus('Sending request…', 'loading');
      render();

      try {
        const response = await fetch(web3FormsEndpoint, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Submission failed');
        }

        isSending = false;
        isSent = true;
        form.reset();
        setStatus('Thank you. Your request was sent. We will reply shortly.', 'success');
        render();
      } catch (_error) {
        isSending = false;
        setStatus('Could not send right now. Please try again in a moment.', 'error');
        render();
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    submitBtn.addEventListener('click', async () => {
      if (isSending || isSent || submitBtn.disabled) return;
      await sendRequest();
    });

    textarea.addEventListener('input', () => {
      if (statusEl.dataset.state !== 'success') {
        setStatus('', '');
      }
      render();
    });

    emailInput.addEventListener('input', () => {
      if (statusEl.dataset.state !== 'success') {
        setStatus('', '');
      }
      render();
    });

    render();
  });
})();
