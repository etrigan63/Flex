// Minimal lightbox for div.gallery thumbnails (no dependencies).
// Crossfades between images using two stacked layers.
document.addEventListener('DOMContentLoaded', function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll('div.gallery a')
  );
  if (!links.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML =
    '<button class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-btn lightbox-prev" aria-label="Previous">&#10094;</button>' +
    '<div class="lightbox-stage">' +
    '<img class="lightbox-img" alt="">' +
    '<img class="lightbox-img" alt="">' +
    '</div>' +
    '<button class="lightbox-btn lightbox-next" aria-label="Next">&#10095;</button>' +
    '<p class="lightbox-caption"></p>';

  var layers = overlay.querySelectorAll('.lightbox-img');
  var caption = overlay.querySelector('.lightbox-caption');
  var current = 0;
  var visible = 0;
  var ticket = 0;
  document.body.appendChild(overlay);

  function preload(index) {
    var preloader = new Image();
    preloader.src = links[(index + links.length) % links.length].href;
  }

  function show(index) {
    current = (index + links.length) % links.length;
    var myTicket = ++ticket;
    var incoming = layers[1 - visible];
    var outgoing = layers[visible];
    var thumb = links[current].querySelector('img');
    var url = links[current].href;
    var alt = thumb ? thumb.alt : '';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    incoming.onload = null;
    incoming.onerror = null;
    incoming.classList.remove('visible');

    var reveal = function () {
      if (myTicket !== ticket) return;
      incoming.alt = alt;
      // Force a reflow so the opacity transition always runs.
      void incoming.offsetWidth;
      incoming.classList.add('visible');
      outgoing.classList.remove('visible');
      visible = 1 - visible;
      caption.textContent = alt;
      preload(current + 1);
      preload(current - 1);
    };

    if (incoming.getAttribute('src') === url && incoming.complete) {
      reveal();
    } else {
      incoming.onload = reveal;
      incoming.onerror = reveal;
      incoming.src = url;
    }
  }

  function close() {
    ticket++;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    layers[0].classList.remove('visible');
    layers[1].classList.remove('visible');
    layers[0].removeAttribute('src');
    layers[1].removeAttribute('src');
  }

  links.forEach(function (link, index) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      show(index);
    });
  });

  overlay.querySelector('.lightbox-close').addEventListener('click', close);
  overlay.querySelector('.lightbox-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    show(current - 1);
  });
  overlay.querySelector('.lightbox-next').addEventListener('click', function (e) {
    e.stopPropagation();
    show(current + 1);
  });
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', function (event) {
    if (!overlay.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    else if (event.key === 'ArrowLeft') show(current - 1);
    else if (event.key === 'ArrowRight') show(current + 1);
  });
});
