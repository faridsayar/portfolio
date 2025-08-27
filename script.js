// Portfolio filters
(function () {
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

  function setActiveFilter(category) {
    filterButtons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-filter') === category || (category === 'all' && btn.getAttribute('data-filter') === 'all'));
      btn.setAttribute('aria-selected', btn.classList.contains('is-active') ? 'true' : 'false');
    });
  }

  function filterCards(category) {
    cards.forEach(function (card) {
      var shouldShow = category === 'all' || card.getAttribute('data-category') === category;
      card.style.display = shouldShow ? '' : 'none';
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = btn.getAttribute('data-filter');
      setActiveFilter(category);
      filterCards(category);
    });
  });
})();

// Contact form handling (FormSubmit)
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  // Redirect back with a success hash to trigger toast
  var nextInput = document.getElementById('_next');
  if (nextInput) {
    var url = new URL(window.location.href);
    url.hash = 'success';
    nextInput.value = url.toString();
  }

  // Success toast
  var toast = document.getElementById('toast');
  var closeBtn = toast ? toast.querySelector('.toast__close') : null;
  
  // Ensure toast is hidden by default and remove any hash from URL
  if (toast) {
    toast.hidden = true;
    // Remove any existing success hash from URL
    if (window.location.hash === '#success') {
      history.replaceState('', document.title, window.location.pathname + window.location.search);
    }
  }
  
  function showToast() {
    if (!toast) return;
    toast.hidden = false;
    // Auto-hide after 6 seconds
    setTimeout(function () { hideToast(); }, 6000);
  }
  
  function hideToast() {
    if (!toast) return;
    toast.hidden = true;
  }
  
  // Add click event listener to close button
  if (closeBtn) {
    closeBtn.addEventListener('click', hideToast);
  }

  // Only show toast if redirected with #success (but we've already cleaned the URL above)
  // This prevents the toast from showing on page load
})();

// Lightbox gallery
(function () {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var imgEl = lightbox.querySelector('.lightbox__img');
  var btnClose = lightbox.querySelector('.lightbox__close');
  var btnPrev = lightbox.querySelector('.lightbox__nav--prev');
  var btnNext = lightbox.querySelector('.lightbox__nav--next');

  var currentImages = [];
  var currentIndex = 0;

  function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index || 0;
    updateImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateImage() {
    if (!currentImages.length) return;
    imgEl.src = currentImages[currentIndex];
  }

  function nextImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateImage();
  }

  function prevImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateImage();
  }

  // Bind clicks on cards
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var imagesRaw = card.getAttribute('data-images') || '';
      var images = imagesRaw.split('|').filter(Boolean);
      if (!images.length) return;
      openLightbox(images, 0);
    });
  });

  // Controls
  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', nextImage);
  if (btnPrev) btnPrev.addEventListener('click', prevImage);

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Click outside to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch swipe for mobile
  var touchStartX = 0;
  var touchEndX = 0;
  function handleGesture() {
    var dx = touchEndX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) nextImage();
    else prevImage();
  }
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });
})();
