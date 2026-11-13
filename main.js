// ---------- Thème clair / sombre ----------
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const icon = themeBtn.querySelector('i');
    icon.className = theme === 'light' ? 'bx bx-moon' : 'bx bx-sun';
    try { localStorage.setItem('theme', theme); } catch (e) { /* stockage indisponible */ }
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) { }
applyTheme(savedTheme || 'dark');

themeBtn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});

// ---------- Menu mobile ----------
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

function setMenu(open) {
    navbar.classList.toggle('active', open);
    menuIcon.setAttribute('aria-expanded', String(open));
    menuIcon.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
}

menuIcon.addEventListener('click', () => setMenu(!navbar.classList.contains('active')));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => setMenu(false)));

// ---------- Scroll : header, progression, lien actif ----------
const header = document.querySelector('.header');
const progress = document.getElementById('scroll-progress');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
let ticking = false;

function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

    let current = 'home';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// ---------- Texte animé (Typed.js) ----------
if (typeof Typed !== 'undefined' && document.querySelector('.typed-text')) {
    new Typed('.typed-text', {
        strings: ['Laravel', 'Full Stack Web', 'de plateformes SaaS', 'Génie logiciel'],
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 1500,
        loop: true
    });
}

// ---------- Apparition au scroll, barres, compteurs ----------
function animateCount(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const duration = 1400;
    (function step(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
    })(start);
}

const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        el.querySelectorAll('.bar-fill').forEach(b => { b.style.width = b.dataset.width + '%'; });
        el.querySelectorAll('[data-count]').forEach(animateCount);
        io.unobserve(el);
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Filtres de projets ----------
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');

filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projects.forEach(p => {
        const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
        p.classList.toggle('hide', !show);
    });
}));

// ---------- Formulaire : ouvre la messagerie avec le message pré-rempli ----------
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const body = `${d.get('message')}\n\n— ${d.get('nom')} (${d.get('email')})`;
    const url = 'mailto:aboubakarassidickmahamatadjid@gmail.com'
        + '?subject=' + encodeURIComponent(d.get('sujet'))
        + '&body=' + encodeURIComponent(body);
    window.location.href = url;
    note.textContent = 'Votre messagerie s\'ouvre. Il ne reste qu\'à cliquer sur « Envoyer ».';
});

// ---------- Année du copyright ----------
document.getElementById('year').textContent = new Date().getFullYear();
