const dark = document.querySelector("span.dark");
const light = document.querySelector("span.light");
const root = document.querySelector(":root");

light.addEventListener("click", () => {
  if (light.classList.contains("active")) {
    light.classList.remove("active");
    dark.classList.add("active");
    darkMode();
  } else {
    light.classList.add("active");
    darkMode();
  }
});
dark.addEventListener("click", () => {
  if (dark.classList.contains("active")) {
    dark.classList.remove("active");
    light.classList.add("active");
    lightMode();
  } else {
    dark.classList.add("active");
    lightMode();
  }
});

function darkMode() {
  root.style.setProperty("--bg-p", "#040303");
  root.style.setProperty("--bg-s", "#040d12");
  root.style.setProperty("--text-p", "#eeeded");
}

function lightMode() {
  root.style.setProperty("--bg-p", "#eeeded");
  root.style.setProperty("--bg-s", "#b9b4c7");
  // root.style.setProperty("--bg-s", "#32e447");
  root.style.setProperty("--text-p", "#352f44");
}

const openPopup = document.querySelectorAll("button.tambah");
const closePopup = document.querySelectorAll("button.close");
const popup = document.querySelector(".popup");
openPopup.forEach((open) => {
  open.addEventListener("click", () => {
    popup.classList.add("showpopup");
  });
});
closePopup.forEach((close) => {
  close.addEventListener("click", () => {
    popup.classList.remove("showpopup");
  });
});

const openMenu = document.querySelector("span.burger");
const closeMenu = document.querySelector("span.close");
const sideBar = document.querySelector(".sidebar");
const link = document.querySelectorAll("span.link");
const aLink = document.querySelectorAll("a.link");
openMenu.addEventListener("click", () => {
  openMenu.classList.toggle("closemenu");
  closeMenu.classList.toggle("closemenu");
  sideBar.classList.toggle("flexsidebar");
  link.forEach((lnk) => {
    lnk.classList.toggle("flexlink");
  });
  aLink.forEach((a) => {
    a.classList.toggle("alink");
  });
});
closeMenu.addEventListener("click", () => {
  openMenu.classList.toggle("closemenu");
  closeMenu.classList.toggle("closemenu");
  sideBar.classList.toggle("flexsidebar");
  link.forEach((lnk) => {
    lnk.classList.toggle("flexlink");
  });
  aLink.forEach((a) => {
    a.classList.toggle("alink");
  });
});
