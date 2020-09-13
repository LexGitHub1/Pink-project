(function () {
  var menu = document.querySelector('.main-nav');
  var menuBtn = menu.querySelector('.main-nav__toggle');

  var hideMenu = function () {
    if(menu && menu.classList.contains('main-nav--nojs')) {
      menu.classList.add('main-nav--closed');
      menu.classList.remove('main-nav--nojs');
    }
  }

  var toggleMenu = function () {
    menu.classList.toggle('main-nav--closed');
  }

  hideMenu();
  menuBtn.addEventListener('click', toggleMenu);
})();
