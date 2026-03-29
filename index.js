/* SMOOTH SCROLL (backup in case CSS doesn't work) */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});


/* TYPING EFFECT */
const text = "Building clean, functional, and modern web applications.";
let i = 0;
const speed = 40;

function typeEffect() {
  const element = document.querySelector(".hero p");
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, speed);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".hero p").innerHTML = "";
  typeEffect();
});


/* FADE IN ON SCROLL */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
});

document.querySelectorAll(".section, .card").forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(40px)";
  el.style.transition = "all 0.6s ease";
  observer.observe(el);
});