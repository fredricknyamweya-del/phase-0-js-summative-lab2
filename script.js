const body = document.body;
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const navLinks = document.querySelectorAll('.nav-links a');
const themeToggle = document.getElementById('themeToggle');
const themeLabel = themeToggle.querySelector('.theme-label');
const breadcrumb = document.getElementById('breadcrumb');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const counterElements = document.querySelectorAll('.counter-value');
const sectionElements = document.querySelectorAll('main section');
const contactForm = document.getElementById('contactForm');
const contactFeedback = document.getElementById('contactFeedback');

function setTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    themeLabel.textContent = 'Light';
    themeToggle.querySelector('.theme-icon').textContent = '☀';
  } else {
    body.classList.remove('dark-mode');
    themeLabel.textContent = 'Dark';
    themeToggle.querySelector('.theme-icon').textContent = '☾';
  }
  localStorage.setItem('siteTheme', theme);
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('siteTheme') || 'light';
  setTheme(savedTheme);
}

function toggleMenu() {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  primaryNav.classList.toggle('open');
}

function updateActiveLink() {
  const fromTop = window.scrollY + 120;
  sectionElements.forEach(section => {
    const id = section.getAttribute('id');
    if (!id) return;
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      breadcrumb.textContent = `Home / ${link.textContent}`;
    }
  });
}

function handleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.style.display = 'grid';
  } else {
    scrollTopBtn.style.display = 'none';
  }
}

function animateCounters(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = +counter.dataset.target;
    let count = 0;
    const step = Math.max(1, Math.floor(target / 80));
    const interval = setInterval(() => {
      count += step;
      counter.textContent = count > target ? target : count;
      if (count >= target) {
        clearInterval(interval);
        counter.textContent = target;
      }
    }, 16);
    observer.unobserve(counter);
  });
}

function validateForm(form) {
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  for (const [name, value] of Object.entries(values)) {
    if (!value.trim()) {
      return { valid: false, message: 'Please fill out all fields before sending.' };
    }
  }
  const email = values.email || '';
  if (!/^[\w.+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  return { valid: true };
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const feedbackTarget = contactFeedback;
  const result = validateForm(form);
  if (!result.valid) {
    feedbackTarget.textContent = result.message;
    feedbackTarget.style.color = '#d64545';
    return;
  }
  feedbackTarget.textContent = form.id === 'contactForm'
    ? 'Thanks! Your message is on its way.'
    : 'Success! You’re subscribed to updates.';
  feedbackTarget.style.color = '#159e6f';
  form.reset();
}

menuToggle.addEventListener('click', toggleMenu);
navLinks.forEach(link => link.addEventListener('click', () => {
  primaryNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

themeToggle.addEventListener('click', () => {
  setTheme(body.classList.contains('dark-mode') ? 'light' : 'dark');
});

document.addEventListener('scroll', () => {
  updateActiveLink();
  handleScrollTop();
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

contactForm.addEventListener('submit', handleFormSubmit);

const observerCounters = new IntersectionObserver(animateCounters, { threshold: 0.5 });
counterElements.forEach(counter => observerCounters.observe(counter));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section, .timeline-item, .hero-card').forEach(element => {
  revealObserver.observe(element);
});

function initialize() {
  initializeTheme();
  updateActiveLink();
}

initialize();
