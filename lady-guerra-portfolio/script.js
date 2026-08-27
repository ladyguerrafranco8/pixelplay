(function () {
  var CATEGORIES = {
    casual: 6,
    editorial: 6,
    comercial: 6
  };

  var gallery = document.getElementById('gallery');
  var tabs = document.querySelectorAll('.book__tab');

  function renderCategory(category) {
    var count = CATEGORIES[category] || 0;
    var html = '';
    for (var i = 1; i <= count; i++) {
      var base = 'public/images/' + category + '/' + category + '-' + i;
      html +=
        '<div class="book__gallery-item">' +
        '<img src="' + base + '.jpg" ' +
        'onerror="this.onerror=null;this.src=\'' + base + '.svg\'" ' +
        'alt="' + category + ' ' + i + '" loading="lazy" />' +
        '</div>';
    }
    gallery.innerHTML = html;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderCategory(tab.dataset.category);
    });
  });

  renderCategory('casual');

  // Mobile menu
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');

  function closeMenu() {
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
