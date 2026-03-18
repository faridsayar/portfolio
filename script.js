/**
 * Single Page Portfolio JavaScript
 * Minimal functionality for AK47-F showcase page
 */

class SinglePagePortfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothTransitions();
    this.setupAccessibility();
    this.setupResponsiveHandling();
    this.setupTimeline();
  }

  // Smooth transitions for interactive elements
  setupSmoothTransitions() {
    // Add smooth hover effects to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .bg-white\\/10');

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-2px)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
      });
    });
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Ensure focus is visible
        document.body.classList.add('keyboard-navigation');
      }
    });

    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Add focus indicators for better accessibility
    const focusableElements = document.querySelectorAll('a, button');
    focusableElements.forEach((element) => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #00D4FF';
        element.style.outlineOffset = '2px';
      });

      element.addEventListener('blur', () => {
        element.style.outline = 'none';
      });
    });
  }

  // Responsive handling
  setupResponsiveHandling() {
    // Handle window resize
    window.addEventListener(
      'resize',
      this.debounce(() => {
        this.adjustLayoutForScreenSize();
      }, 250)
    );

    // Initial layout adjustment
    this.adjustLayoutForScreenSize();
  }

  // Interactive timeline (process prioritization)
  setupTimeline() {
    const timeline = document.querySelector('[data-timeline]');
    if (!timeline) return;

    const track = timeline.querySelector('[data-timeline-track]');
    const segments = Array.from(timeline.querySelectorAll('[data-segment]'));
    const handles = Array.from(timeline.querySelectorAll('[data-handle]'));
    const handleLabels = Array.from(timeline.querySelectorAll('[data-handle-label]'));
    const summaryEl = timeline.querySelector('[data-timeline-summary]');
    const inputs = Array.from(timeline.querySelectorAll('[data-phase-input]'));

    if (!track || segments.length !== 7 || handles.length !== 6) return;

    const phases = [
      'Konsultasjon',
      'Brukeranalyse',
      'Konseptutvikling',
      'Prototype',
      'Finjustering',
      'Validering',
      'Ferdigstilling',
    ];

    const minGapPct = 3;
    let boundaries = Array.from({ length: 6 }, (_, i) => Math.round(((i + 1) * 100) / 7));
    let activeHandleIndex = null;
    let pointerId = null;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function computePhasePercents() {
      const b = boundaries;
      const p = [b[0], b[1] - b[0], b[2] - b[1], b[3] - b[2], b[4] - b[3], b[5] - b[4], 100 - b[5]];
      return p.map((x) => clamp(x, 0, 100));
    }

    function computeRoundedPercents(percs) {
      const rounded = percs.map((p) => Math.round(p));
      const sum = rounded.reduce((a, b) => a + b, 0);
      let diff = 100 - sum;
      if (diff === 0) return rounded;

      const order = percs
        .map((p, idx) => ({ idx, p }))
        .sort((a, b) => (diff > 0 ? b.p - a.p : a.p - b.p));

      for (let i = 0; i < Math.abs(diff); i++) {
        rounded[order[i % order.length].idx] += diff > 0 ? 1 : -1;
      }
      return rounded;
    }

    function ensureSummary() {
      if (!summaryEl) return;
      if (summaryEl.children.length === 7) return;
      summaryEl.innerHTML = '';
      phases.forEach((name, idx) => {
        const item = document.createElement('div');
        item.className = 'timeline-summary-item';
        item.dataset.phaseSummary = String(idx);
        item.innerHTML = `
          <span class="timeline-summary-item__name">${name}</span>
          <span class="timeline-summary-item__value">0%</span>
        `;
        summaryEl.appendChild(item);
      });
    }

    function pctFromPointer(clientX) {
      const rect = track.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      return rect.width === 0 ? 0 : (x / rect.width) * 100;
    }

    function setHandleAria(handle, idx) {
      const min = idx === 0 ? minGapPct : boundaries[idx - 1] + minGapPct;
      const max = idx === boundaries.length - 1 ? 100 - minGapPct : boundaries[idx + 1] - minGapPct;
      handle.setAttribute('aria-label', `Grense for ${phases[idx]}`);
      handle.setAttribute('aria-valuemin', String(Math.round(min)));
      handle.setAttribute('aria-valuemax', String(Math.round(max)));
      handle.setAttribute('aria-valuenow', String(Math.round(boundaries[idx])));
    }

    function render() {
      const percs = computePhasePercents();
      const rounded = computeRoundedPercents(percs);

      segments.forEach((seg, i) => {
        seg.style.width = `${percs[i]}%`;
      });

      handles.forEach((handle, i) => {
        handle.style.left = `${boundaries[i]}%`;
        setHandleAria(handle, i);
      });

      handleLabels.forEach((labelEl, i) => {
        labelEl.style.left = `${boundaries[i]}%`;
        labelEl.textContent = `${phases[i]} ${rounded[i]}%`;
      });

      ensureSummary();
      if (summaryEl) {
        const items = Array.from(summaryEl.querySelectorAll('[data-phase-summary]'));
        items.forEach((item) => {
          const idx = Number(item.dataset.phaseSummary);
          const valueEl = item.querySelector('.timeline-summary-item__value');
          if (valueEl) valueEl.textContent = `${rounded[idx]}%`;
        });
      }

      inputs.forEach((inputEl) => {
        const idx = Number(inputEl.dataset.phaseInput);
        if (Number.isFinite(idx) && idx >= 0 && idx < rounded.length)
          inputEl.value = String(rounded[idx]);
      });
    }

    function updateBoundary(idx, nextValue) {
      const min = idx === 0 ? minGapPct : boundaries[idx - 1] + minGapPct;
      const max = idx === boundaries.length - 1 ? 100 - minGapPct : boundaries[idx + 1] - minGapPct;
      boundaries[idx] = clamp(nextValue, min, max);
      render();
    }

    handles.forEach((handle, idx) => {
      handle.addEventListener('pointerdown', (e) => {
        activeHandleIndex = idx;
        pointerId = e.pointerId;
        handle.setPointerCapture(pointerId);
        e.preventDefault();
      });

      handle.addEventListener('pointermove', (e) => {
        if (activeHandleIndex !== idx) return;
        if (pointerId !== e.pointerId) return;
        updateBoundary(idx, pctFromPointer(e.clientX));
      });

      handle.addEventListener('pointerup', (e) => {
        if (pointerId !== e.pointerId) return;
        activeHandleIndex = null;
        pointerId = null;
      });

      handle.addEventListener('pointercancel', (e) => {
        if (pointerId !== e.pointerId) return;
        activeHandleIndex = null;
        pointerId = null;
      });

      handle.addEventListener('keydown', (e) => {
        const step = e.shiftKey ? 5 : 1;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateBoundary(idx, boundaries[idx] - step);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          updateBoundary(idx, boundaries[idx] + step);
        }
      });
    });

    window.addEventListener(
      'resize',
      this.debounce(() => {
        render();
      }, 150)
    );

    render();
  }

  adjustLayoutForScreenSize() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Adjust font sizes for different screen sizes
    const title = document.querySelector('h1');
    if (title) {
      if (isMobile) {
        title.style.fontSize = '2.5rem';
      } else if (isTablet) {
        title.style.fontSize = '4rem';
      } else {
        title.style.fontSize = '5rem';
      }
    }

    // Adjust grid layout for mobile
    const projectDetails = document.querySelector('.grid-cols-1');
    if (projectDetails && isMobile) {
      projectDetails.classList.add('space-y-4');
    }
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Handle external link clicks
  handleExternalLink(url) {
    // Add loading state
    const button = event.target.closest('a');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Opening...';
      button.style.opacity = '0.7';

      // Reset after a short delay
      setTimeout(() => {
        button.textContent = originalText;
        button.style.opacity = '1';
      }, 1000);
    }

    // Open link
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// Initialize the single page portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.singlePagePortfolio = new SinglePagePortfolio();

  // Add click handlers for external links
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.singlePagePortfolio.handleExternalLink(link.href);
    });
  });
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #00D4FF !important;
        outline-offset: 2px !important;
    }
    
    /* Smooth transitions for all elements */
    * {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);
