// NOTE: Hydrates shared EN landing layout from EN_LANDING_PAGES and handles quote forms.
(function enLandingApp() {
  let didHydrate = false;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function injectJsonLd(page) {
    if (!page.jsonLd) return;
    Object.values(page.jsonLd).forEach((payload) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(payload);
      document.head.appendChild(script);
    });
  }

  function hydrateEnLanding() {
    if (didHydrate) return;

    const slug = document.body.getAttribute('data-en-landing-page');
    const pages = window.EN_LANDING_PAGES;
    const page = slug && pages ? pages[slug] : null;
    const layout = document.querySelector('[data-en-landing-layout]');
    if (!page || !layout) return;

    didHydrate = true;
    injectJsonLd(page);

    const section = layout.querySelector('[data-en-landing-section]');
    const hero = layout.querySelector('[data-en-landing-hero]');
    const heroImg = layout.querySelector('[data-en-landing-hero-img]');
    const breadcrumbCurrent = layout.querySelector('[data-en-landing-breadcrumb-current]');
    const titleEl = layout.querySelector('[data-en-landing-title]');
    const leadEl = layout.querySelector('[data-en-landing-lead]');
    const deliverablesEl = layout.querySelector('[data-en-landing-deliverables]');
    const turnaroundEl = layout.querySelector('[data-en-landing-turnaround]');
    const priceEl = layout.querySelector('[data-en-landing-price]');
    const form = layout.querySelector('[data-en-landing-form]');
    const messageEl = layout.querySelector('[data-en-landing-message]');
    const seoEl = layout.querySelector('[data-en-landing-seo]');
    const crosslinksEl = layout.querySelector('[data-en-landing-crosslinks]');

    if (section) section.setAttribute('aria-label', page.sectionLabel);
    if (hero) hero.setAttribute('aria-label', page.heroLabel);
    if (heroImg && page.heroImage) {
      heroImg.src = page.heroImage.src;
      heroImg.alt = page.heroImage.alt || '';
    }
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = page.breadcrumb;
      breadcrumbCurrent.href = `/en/${page.slug}`;
    }
    if (titleEl) titleEl.textContent = page.title;
    if (leadEl) leadEl.textContent = page.lead;
    if (deliverablesEl) {
      deliverablesEl.innerHTML = page.deliverables
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('');
    }
    if (turnaroundEl) {
      if (page.turnaround) {
        turnaroundEl.textContent = page.turnaround;
        turnaroundEl.hidden = false;
      } else {
        turnaroundEl.hidden = true;
      }
    }
    if (priceEl) {
      if (page.price) {
        priceEl.textContent = page.price;
        priceEl.hidden = false;
      } else {
        priceEl.hidden = true;
      }
    }
    if (form) form.dataset.serviceName = page.serviceName;
    if (messageEl && page.formPlaceholder) {
      messageEl.placeholder = page.formPlaceholder;
    }
    if (seoEl && page.seoSections) {
      seoEl.innerHTML = page.seoSections
        .map((block) => `<h2>${escapeHtml(block.heading)}</h2><p>${block.html}</p>`)
        .join('');
    }
    if (crosslinksEl && page.crosslinksHtml) {
      crosslinksEl.innerHTML = page.crosslinksHtml;
    }

    setupEnLandingForms();
  }

  function setupEnLandingForms() {
    const forms = Array.from(document.querySelectorAll('[data-en-landing-form]'));
    if (forms.length === 0) return;

    const web3FormsEndpoint = 'https://api.web3forms.com/submit';

    forms.forEach((form) => {
      if (form.dataset.enLandingFormReady === 'true') return;
      form.dataset.enLandingFormReady = 'true';

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
        ].join('\n');

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
  }

  function tryHydrate() {
    hydrateEnLanding();
  }

  document.addEventListener('components:ready', tryHydrate);
  document.addEventListener('DOMContentLoaded', tryHydrate);
})();
