// Handle fixed menu
const header = document.querySelector(".header");
window.addEventListener("scroll", (e) => {
  if (window.scrollY > 82) {
    header.classList.add("is-active");
    document.body.classList.add("active")
  } else {
    header.classList.remove("is-active");
    document.body.classList.remove("active")
  }
});
// end Handle fixed menu


// Handle Click show menu
const headerMenuBtn = document.querySelector(".header__menu-btn");
const headerCloseMenuBtn = document.querySelector(".header__close-btn");
const headerNavList = document.querySelector(".header__nav-list");

headerMenuBtn.addEventListener("click", handleShowHeaderMenu);
function handleShowHeaderMenu() {
  headerNavList.classList.add("active");
  headerCloseMenuBtn.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

headerCloseMenuBtn.addEventListener("click", handleCloseMenu);
function handleCloseMenu() {
  headerNavList.classList.remove("active");
  headerCloseMenuBtn.classList.add("hidden");
  document.body.style.overflow = "auto";
}
// end Handle Click show menu

// ARCODIANT
const accordionContent = document.querySelectorAll(
  ".fui-accordion .accordion-content"
);
accordionContent.forEach((item, index) => {
  let header = item.querySelector("header");
  item.classList.remove("open");
  header.addEventListener("click", () => {
    item.classList.toggle("open");

    let description = item.querySelector(".description");
    if (item.classList.contains("open")) {
      description.style.height = `${description.scrollHeight}px`;
    } else {
      description.style.height = "0px";
    }
    removeOpen(index);
  });
});

function removeOpen(index1) {
  accordionContent.forEach((item2, index2) => {
    if (index1 != index2) {
      item2.classList.remove("open");

      let des = item2.querySelector(".description");
      des.style.height = "0px";
    }
  });
}
// ARCODIANT
