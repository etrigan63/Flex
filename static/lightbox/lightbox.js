// Minimal lightbox for div.gallery thumbnails (no dependencies).
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
    '<img class="lightbox-img" alt="">' +
    '<button class="lightbox-btn lightbox-next" aria-label="Next">&#10095;</button>' +
    '<p class="lightbox-caption"></p>';

  var img = overlay.querySelector('.lightbox-img');
  var caption = overlay.querySelector('.lightbox-caption');
  var current = 0;
  document.body.appendChild(overlay);

  function show(index) {
    current = (index + links.length) % links.length;
    var thumb = links[current].querySelector('img');
    img.src = links[current].href;
    img.alt = thumb ? thumb.alt : '';
    caption.textContent = img.alt;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    img.removeAttribute('src');
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
