let mainHeader = document.querySelector(".main-header");
let menuButton = document.querySelector(".main-header__button-toggle");

mainHeader.classList.toggle("main-header--opened");
menuButton.classList.toggle("main-header__button-toggle--hidden");

menuButton.addEventListener("click", function () {
  mainHeader.classList.toggle("main-header--opened");
});
