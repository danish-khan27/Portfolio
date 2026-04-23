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
  if (!element) return;

  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, speed);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const element = document.querySelector(".hero p");
  if (!element) return;

  element.innerHTML = "";
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


/* CONTACT FORM */
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    const formData = new FormData(contactForm);
    const endpoint = contactForm.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.className = "form-status";
    formStatus.textContent = "";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error(result.message || "The message could not be sent.");
      }

      contactForm.reset();
      formStatus.classList.add("success");
      formStatus.textContent = "Message sent. Thanks for reaching out.";
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent = "Message did not send. Email me directly at dkhans2001@gmail.com.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
