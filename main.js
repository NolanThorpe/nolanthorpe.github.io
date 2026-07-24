// ===== Scroll reveal =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealEls = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => observer.observe(el));
}

// ===== Terminal typing loop =====
const typedEl = document.getElementById('typed');
const commands = [
  'nmap -sV 10.0.0.0/24',
  'splunk search "index=sec severity=high"',
  'aws sts get-caller-identity',
  'sudo wireshark -i eth0',
  'python3 threat_intel_rag.py',
];

if (typedEl && !prefersReducedMotion) {
  let cmdIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = commands[cmdIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 55 + Math.random() * 60);
    } else {
      typedEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        cmdIndex = (cmdIndex + 1) % commands.length;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 24);
    }
  };
  setTimeout(tick, 900);
} else if (typedEl) {
  typedEl.textContent = commands[0];
}

// ===== Nav: scrolled state =====
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Nav: mobile menu =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// ===== Nav: highlight active section =====
const sections = document.querySelectorAll('section[id], header[id]');
const linkMap = new Map(
  [...navLinks.querySelectorAll('a[href^="#"]')].map(a => [a.getAttribute('href').slice(1), a])
);
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const link = linkMap.get(entry.target.id);
      if (link && entry.isIntersecting) {
        linkMap.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
