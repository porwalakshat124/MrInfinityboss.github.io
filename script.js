// ===== Role cycling text =====
const roles = [
  "Data Analyst",
  "Machine Learning Enthusiast",
  "Power BI Developer",
  "Python & SQL Practitioner",
  "Business Intelligence"
];
const roleEl = document.getElementById('roleCycle');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeRole, 1600);
      return;
    }
  } else {
    charIndex--;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 35 : 55);
}
typeRole();

// ===== Console typing effect =====
const consoleLines = [
  { text: "$ python analyze.py --dataset retail_2026.csv", cls: "" },
  { text: "> Loaded 12,480 rows · 24 columns", cls: "out" },
  { text: "> Cleaning nulls, deduping, casting types...", cls: "out" },
  { text: "$ SELECT category, AVG(margin) FROM sales", cls: "kw" },
  { text: "  GROUP BY category ORDER BY 2 DESC;", cls: "kw" },
  { text: "> 8 rows returned in 0.04s", cls: "out" },
  { text: "$ model.fit(X_train, y_train)", cls: "" },
  { text: "> Accuracy: 0.94 · F1: 0.91", cls: "str" },
  { text: "$ powerbi --publish dashboard.pbix", cls: "" },
  { text: "> Dashboard published ✓", cls: "out" },
];
const consoleEl = document.getElementById('consoleBody');
let lineIdx = 0;

function typeConsoleLine() {
  if (lineIdx >= consoleLines.length) {
    setTimeout(() => {
      consoleEl.textContent = '';
      lineIdx = 0;
      typeConsoleLine();
    }, 2200);
    return;
  }
  const { text, cls } = consoleLines[lineIdx];
  const span = document.createElement('span');
  if (cls) span.className = cls;
  consoleEl.appendChild(span);
  let i = 0;
  function typeChar() {
    if (i <= text.length) {
      span.textContent = text.slice(0, i);
      i++;
      setTimeout(typeChar, 14);
    } else {
      consoleEl.appendChild(document.createTextNode('\n'));
      lineIdx++;
      setTimeout(typeConsoleLine, 220);
    }
  }
  typeChar();
}
typeConsoleLine();

// ===== Navbar scroll state =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
}
navToggle.addEventListener('click', () => {
  setMenu(!navLinks.classList.contains('open'));
});
// close the menu after choosing a link, tapping outside, pressing Esc, or resizing to desktop
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (e) => { if (!navbar.contains(e.target)) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

// ===== Contact form (front-end only placeholder) =====
// ===== Contact Form with Google Sheets =====
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

// REPLACE THIS URL WITH YOUR ACTUAL WEB APP URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzMsLqG-Qj5BKHYV-_EKH-m5ne90OHTFJP4-ed3fX5ZNs9Adtivx4bJwVtog2LG36bz/exec';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  
  // Validate
  if (!name || !email || !message) {
    status.textContent = 'Please fill in all fields.';
    status.style.color = 'var(--red)';
    return;
  }
  
  // Show loading state
  status.textContent = 'Sending...';
  status.style.color = 'var(--amber)';
  
  try {
    // Send data to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    });
    
    // Success (no-cors mode doesn't return readable response)
    status.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
    status.style.color = 'var(--green)';
    
    // Reset form
    form.reset();
    
    // Clear status after 5 seconds
    setTimeout(() => {
      status.textContent = '';
    }, 5000);
    
  } catch (error) {
    console.error('Error:', error);
    status.textContent = '❌ Something went wrong. Please try again or email me directly.';
    status.style.color = 'var(--red)';
  }
});
