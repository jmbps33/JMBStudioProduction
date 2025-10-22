/* ============================
   JMB Studio Production, Inc.
   External JavaScript Functions
   ============================ */

// Navigation
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => section.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) targetSection.classList.add('active');

  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.classList.remove('text-yellow-300', 'bg-white', 'bg-opacity-30');
    btn.classList.add('text-white');
  });

  event.target.classList.remove('text-white');
  event.target.classList.add('text-yellow-300', 'bg-white', 'bg-opacity-30');
}

// Contact form
function sendMessage(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  alert(`Thank you ${name}! Your message has been received. We'll contact you at ${email}.`);
  event.target.reset();
}

// Admin login
let isAdminLoggedIn = false;

function showAdminLogin() {
  const modal = document.getElementById('adminLoginModal');
  modal.classList.remove('hidden');
}

function closeAdminLogin() {
  document.getElementById('adminLoginModal').classList.add('hidden');
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  const errorDiv = document.getElementById('loginError');

  if (username === 'Josiejorenz2024' && password === 'jmb2026') {
    isAdminLoggedIn = true;
    closeAdminLogin();
    showNotification('Admin login successful!', 'success');
    showAllAdminPortals();
  } else {
    errorDiv.classList.remove('hidden');
  }
}

function adminLogout() {
  isAdminLoggedIn = false;
  hideAllAdminPortals();
  showNotification('Admin logged out.', 'info');
}

// Show admin sections
function showAllAdminPortals() {
  document.querySelectorAll('.admin-portal').forEach(p => p.classList.add('active'));
  document.getElementById('backgroundSettingsBtn').classList.remove('hidden');
}

// Hide admin sections
function hideAllAdminPortals() {
  document.querySelectorAll('.admin-portal').forEach(p => p.classList.remove('active'));
  document.getElementById('backgroundSettingsBtn').classList.add('hidden');
}

// Notifications
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };
  const div = document.createElement('div');
  div.className = `notification border ${colors[type]}`;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

// Raffle Modal
function showBirthdayRaffleModal() {
  document.getElementById('birthdayRaffleModal').classList.remove('hidden');
}
function closeBirthdayRaffleModal() {
  document.getElementById('birthdayRaffleModal').classList.add('hidden');
}

// MOA Modal
function showMOAModal() {
  document.getElementById('moaModal').classList.remove('hidden');
}
function closeMOAModal() {
  document.getElementById('moaModal').classList.add('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => showSection('home'));
