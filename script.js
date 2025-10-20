/* jmb.js
   JavaScript for JMB Studio Production HTML
   - Handles section routing, admin panels, gallery/news/partner management
   - Persists items to localStorage
   - Countdown timer, search, background settings, raffle & MOA forms
*/

/* -------------------------
   Utility / DOM helpers
   ------------------------- */
const q = sel => document.querySelector(sel);
const qa = sel => Array.from(document.querySelectorAll(sel));
const show = el => el && (el.classList.remove('hidden'), el.classList.add('fade-in'));
const hide = el => el && el.classList.add('hidden');
const byId = id => document.getElementById(id);

/* -------------------------
   Section routing / menu
   ------------------------- */
function showSection(name) {
  // hide all .section-content
  qa('.section-content').forEach(s => s.classList.add('hidden'));
  const el = byId(name);
  if (el) {
    el.classList.remove('hidden');
    el.classList.add('fade-in');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // close mobile menu
  const mm = byId('mobileMenu');
  if (mm && !mm.classList.contains('hidden')) mm.classList.add('hidden');
}
window.showSection = showSection;

/* -------------------------
   Mobile menu toggle
   ------------------------- */
function toggleMobileMenu() {
  const mm = byId('mobileMenu');
  if (!mm) return;
  mm.classList.toggle('hidden');
}
window.toggleMobileMenu = toggleMobileMenu;

/* -------------------------
   Christmas Countdown
   ------------------------- */
function updateChristmasCountdown() {
  const daysEl = byId('days'), hrsEl = byId('hours'), minEl = byId('minutes'), secEl = byId('seconds');
  if (!daysEl) return;
  const now = new Date();
  // target: December 25 this year (if past, next year)
  let year = now.getFullYear();
  let target = new Date(year, 11, 25, 0, 0, 0); // Dec 25
  if (now > target) {
    target = new Date(year + 1, 11, 25, 0, 0, 0);
  }
  const diff = target - now;
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  daysEl.textContent = days;
  hrsEl.textContent = hours.toString().padStart(2,'0');
  minEl.textContent = minutes.toString().padStart(2,'0');
  secEl.textContent = seconds.toString().padStart(2,'0');
}
setInterval(updateChristmasCountdown, 1000);
updateChristmasCountdown();

/* -------------------------
   Search
   ------------------------- */
function performSearch(query) {
  const qLower = (query || '').trim().toLowerCase();
  const resultsDiv = byId('searchResults');
  resultsDiv.innerHTML = '';
  if (!qLower) { resultsDiv.classList.add('hidden'); return; }
  const results = [];

  // search news
  const news = loadFromStorage('jmb_news') || [];
  news.forEach(n => {
    if ((n.title + ' ' + (n.content||'')).toLowerCase().includes(qLower)) {
      results.push({type:'News', title: n.title, body: n.content || '', id: n.id});
    }
  });

  // search gallery
  const gallery = loadFromStorage('jmb_gallery') || [];
  gallery.forEach(g => {
    if ((g.title + ' ' + (g.description||'')).toLowerCase().includes(qLower)) {
      results.push({type:'Gallery', title: g.title, body: g.description || '', id: g.id});
    }
  });

  // search partners
  const partners = loadFromStorage('jmb_partners') || [];
  partners.forEach(p => {
    if ((p.name + ' ' + (p.description||'')).toLowerCase().includes(qLower)) {
      results.push({type:'Partner', title: p.name, body: p.description || '', id: p.id});
    }
  });

  if (!results.length) {
    resultsDiv.innerHTML = `<div class="p-3 text-sm text-gray-600">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
    resultsDiv.classList.remove('hidden');
    return;
  }

  resultsDiv.innerHTML = results.slice(0,10).map(r => `
    <div class="p-2 border-b clickable-item" data-type="${r.type}" data-id="${r.id}">
      <div class="text-sm font-semibold">${escapeHtml(r.title)}</div>
      <div class="text-xs text-gray-500">${escapeHtml(r.type)} — ${escapeHtml(truncate(r.body,120))}</div>
    </div>
  `).join('');
  resultsDiv.classList.remove('hidden');

  // attach clicks
  resultsDiv.querySelectorAll('.clickable-item').forEach(item=>{
    item.onclick = () => {
      const type = item.dataset.type;
      const id = item.dataset.id;
      if (type === 'News') { showSection('news'); highlightNews(id); }
      if (type === 'Gallery') { showSection('gallery'); highlightGallery(id); }
      if (type === 'Partner') { showSection('partners'); highlightPartner(id); }
      resultsDiv.classList.add('hidden');
      byId('searchInput').value = '';
    };
  });
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function truncate(s, n){ if(!s) return ''; return s.length>n ? s.slice(0,n-1)+'…' : s; }

byId('searchInput')?.addEventListener('input', e=>{
  performSearch(e.target.value);
});
document.addEventListener('click', e=>{
  const sr = byId('searchResults');
  if (!sr) return;
  if (!sr.contains(e.target) && e.target !== byId('searchInput')) sr.classList.add('hidden');
});

/* -------------------------
   Modal helpers
   ------------------------- */
function showModal(id) {
  const el = byId(id);
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.remove('hidden');
}
function hideModal(id) {
  const el = byId(id);
  if (!el) return;
  el.classList.add('hidden');
}

/* -------------------------
   Birthday Raffle
   ------------------------- */
function showBirthdayRaffleModal(){ showModal('birthdayRaffleModal'); }
function closeBirthdayRaffleModal(){ hideModal('birthdayRaffleModal'); }
window.showBirthdayRaffleModal = showBirthdayRaffleModal;
window.closeBirthdayRaffleModal = closeBirthdayRaffleModal;

function adjustTickets(delta) {
  const input = byId('raffleTickets');
  if (!input) return;
  let v = parseInt(input.value || '1', 10);
  v = Math.max(1, Math.min(50, v + delta));
  input.value = v;
  updateRaffleTotal();
}
window.adjustTickets = adjustTickets;

function updateRaffleTotal() {
  const t = parseInt(byId('raffleTickets')?.value || '1', 10);
  const totalEl = byId('totalAmount');
  if (totalEl) totalEl.textContent = `₱${(t*50).toLocaleString()}`;
}
updateRaffleTotal();

function submitBirthdayRaffle(e) {
  e && e.preventDefault && e.preventDefault();
  // gather form values
  const name = byId('raffleFullName').value.trim();
  const age = byId('raffleAge').value;
  const email = byId('raffleEmail').value.trim();
  const phone = byId('rafflePhone').value.trim();
  const address = byId('raffleAddress').value.trim();
  const city = byId('raffleCity').value.trim();
  const province = byId('raffleProvince').value.trim();
  const tickets = parseInt(byId('raffleTickets').value||'1',10);
  const message = byId('raffleMessage').value.trim();
  const agree = byId('agreeRaffleTerms')?.checked && byId('agreeRaffleInfo')?.checked && byId('agreeRaffleContact')?.checked && byId('agreeRaffleRules')?.checked;
  if (!agree) return alert('Please accept all raffle terms.');
  if (!name || !email || !phone || !address) return alert('Please fill required fields.');
  const entry = { id: 'r' + Date.now(), name, age, email, phone, address, city, province, tickets, message, created: new Date().toISOString() };
  const arr = loadFromStorage('jmb_raffle') || [];
  arr.push(entry); saveToStorage('jmb_raffle', arr);
  alert(`Thanks ${name}! Your raffle entry was saved. Total ₱${tickets*50}`);
  e.target && e.target.reset && e.target.reset();
  updateRaffleTotal();
  closeBirthdayRaffleModal();
}
window.submitBirthdayRaffle = submitBirthdayRaffle;

/* -------------------------
   MOA Partnership
   ------------------------- */
function showMOAModal(){ showModal('moaModal'); }
function closeMOAModal(){ hideModal('moaModal'); }
window.showMOAModal = showMOAModal;
window.closeMOAModal = closeMOAModal;

function submitMOA(e) {
  e && e.preventDefault && e.preventDefault();
  const companyName = byId('companyName').value.trim();
  const companyType = byId('companyType').value;
  const industry = byId('industry').value.trim();
  const contactName = byId('contactName').value.trim();
  const contactEmail = byId('contactEmail').value.trim();
  const address = byId('address').value.trim();
  const partnershipType = byId('partnershipType').value;
  const services = byId('services').value.trim();
  const agreeTerms = byId('agreeTerms')?.checked && byId('agreeInfo')?.checked && byId('agreeContact')?.checked;
  if (!agreeTerms) return alert('Please accept the MOA terms.');
  if (!companyName || !contactName || !contactEmail) return alert('Please fill required fields.');
  const entry = { id:'m' + Date.now(), companyName, companyType, industry, contactName, contactEmail, address, partnershipType, services, created: new Date().toISOString() };
  const arr = loadFromStorage('jmb_moa') || [];
  arr.push(entry); saveToStorage('jmb_moa', arr);
  alert('MOA application submitted. Thank you!');
  e.target && e.target.reset && e.target.reset();
  closeMOAModal();
}
window.submitMOA = submitMOA;

/* -------------------------
   Background Settings
   ------------------------- */
function showBackgroundSettings(){ showModal('backgroundModal'); }
function closeBackgroundSettings(){ hideModal('backgroundModal'); }
window.showBackgroundSettings = showBackgroundSettings;
window.closeBackgroundSettings = closeBackgroundSettings;

function applyBackground() {
  const url = byId('backgroundUrl').value.trim();
  const opacity = parseInt(byId('backgroundOpacity').value || '20', 10);
  const size = byId('backgroundSize').value || 'cover';
  const pos = byId('backgroundPosition').value || 'center';
  const body = document.body;
  if (url) {
    body.style.backgroundImage = `url(${url})`;
    body.style.backgroundSize = size;
    body.style.backgroundPosition = pos;
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundBlendMode = 'overlay';
  } else {
    body.style.backgroundImage = '';
  }
  // opacity overlay: adjust pattern pseudo-element via setting a CSS variable
  document.documentElement.style.setProperty('--jmb-bg-opacity', (opacity/100).toString());
  saveToStorage('jmb_bg', { url, opacity, size, pos });
  alert('Background applied.');
}
window.applyBackground = applyBackground;

function resetBackground() {
  document.body.style.backgroundImage = '';
  document.documentElement.style.removeProperty('--jmb-bg-opacity');
  saveToStorage('jmb_bg', {});
  alert('Background reset.');
}
window.resetBackground = resetBackground;

/* load saved background on start */
(function loadSavedBackground(){
  const bg = loadFromStorage('jmb_bg') || {};
  if (!bg) return;
  if (bg.url) {
    byId('backgroundUrl') && (byId('backgroundUrl').value = bg.url);
    document.body.style.backgroundImage = `url(${bg.url})`;
    document.body.style.backgroundSize = bg.size || 'cover';
    document.body.style.backgroundPosition = bg.pos || 'center';
  }
  if (bg.opacity) { byId('backgroundOpacity') && (byId('backgroundOpacity').value = bg.opacity); byId('opacityValue') && (byId('opacityValue').textContent = bg.opacity + '%'); }
  if (byId('backgroundSize')) byId('backgroundSize').value = bg.size || 'cover';
  if (byId('backgroundPosition')) byId('backgroundPosition').value = bg.pos || 'center';
})();

/* update opacity label */
byId('backgroundOpacity')?.addEventListener('input', e=>{
  const v = e.target.value;
  byId('opacityValue') && (byId('opacityValue').textContent = `${v}%`);
});

/* -------------------------
   Admin Login & Portal controls
   ------------------------- */
function showAdminLogin(){ showModal('adminLoginModal'); }
function closeAdminLogin(){ hideModal('adminLoginModal'); }
window.showAdminLogin = showAdminLogin;
window.closeAdminLogin = closeAdminLogin;

function handleAdminLogin(e) {
  e && e.preventDefault && e.preventDefault();
  const user = byId('adminUsername').value.trim();
  const pass = byId('adminPassword').value;
  // NOTE: simple client-side auth for demo. Replace with server-side in production.
  const validUser = 'admin';
  const validPass = 'admin123';
  const loginError = byId('loginError');
  if (user === validUser && pass === validPass) {
    loginError && loginError.classList.add('hidden');
    hideModal('adminLoginModal');
    enableAdminPortals();
    alert('Admin access granted (demo).');
  } else {
    loginError && loginError.classList.remove('hidden');
  }
}
window.handleAdminLogin = handleAdminLogin;

function enableAdminPortals(){
  // show admin-portal toggles and gallery/news/partner admin portals
  qa('.admin-portal').forEach(p => p.classList.remove('hidden'));
  const bgBtn = byId('backgroundSettingsBtn');
  bgBtn && (bgBtn.classList.remove('hidden'));
  // reveal "galleryAdmin" etc are already inside sections; admin-portal elements are now visible
}

/* hide admin view helper */
function toggleAdminView(viewId) {
  const parents = qa(`#${viewId}`).map?[]:[]; // placeholder to silence linter
  // hide sibling admin-view inside same admin-portal
  const viewEl = byId(viewId);
  if (!viewEl) return;
  const container = viewEl.closest('.admin-portal');
  if (!container) return;
  container.querySelectorAll('.admin-view').forEach(v => v.classList.add('hidden'));
  viewEl.classList.remove('hidden');
}
window.toggleAdminView = toggleAdminView;

function hideAdminPortal(section) {
  const id = section === 'gallery' ? 'galleryAdmin' : section === 'news' ? 'newsAdmin' : section === 'partner' ? 'partnerAdmin' : section === 'partners' ? 'partnersAdmin' : null;
  if (!id) return;
  hideModal(id);
}
window.hideAdminPortal = hideAdminPortal;

/* -------------------------
   Storage helpers
   ------------------------- */
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch(e){ return null; }
}

/* -------------------------
   Gallery admin
   ------------------------- */
function addGalleryItem(e) {
  e && e.preventDefault && e.preventDefault();
  const title = byId('galleryTitle').value.trim();
  const type = byId('galleryType').value;
  const fileInput = byId('galleryFile');
  const description = byId('galleryDescription').value.trim();
  if (!title || !fileInput || !fileInput.files || !fileInput.files[0]) return alert('Please provide a title and select a file.');
  const f = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(ev) {
    const dataUrl = ev.target.result;
    const arr = loadFromStorage('jmb_gallery') || [];
    arr.push({ id: 'g' + Date.now(), title, type, dataUrl, description, created: new Date().toISOString() });
    saveToStorage('jmb_gallery', arr);
    alert('Gallery item added.');
    e.target && e.target.reset && e.target.reset();
    renderGalleryItems();
    renderGalleryAdminList();
  };
  reader.readAsDataURL(f);
  return false;
}
window.addGalleryItem = addGalleryItem;

function renderGalleryItems() {
  const items = loadFromStorage('jmb_gallery') || [];
  const container = byId('galleryItems');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <div class="text-6xl mb-4">📸</div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">No Gallery Items Yet</h3>
      <p class="text-gray-600 text-sm">Use the admin portal to add stunning images and videos to showcase your work!</p>
    </div>`;
    return;
  }
  container.innerHTML = items.map(it => `
    <div class="gallery-item card-hover p-0">
      ${it.type === 'video' ? `<video class="gallery-media" src="${it.dataUrl}" controls></video>` : `<img class="gallery-media" src="${it.dataUrl}" alt="${escapeHtml(it.title)}">`}
      <div class="p-4">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold">${escapeHtml(it.title)}</h4>
            <div class="text-xs text-gray-500">${escapeHtml(truncate(it.description, 120))}</div>
          </div>
          <div class="media-badge"> ${it.type}</div>
        </div>
      </div>
    </div>
  `).join('');
}
renderGalleryItems();

function renderGalleryAdminList() {
  const arr = loadFromStorage('jmb_gallery') || [];
  const el = byId('galleryAdminList');
  if (!el) return;
  if (!arr.length) {
    el.innerHTML = `<div class="bg-white p-3 rounded border text-center"><p class="text-gray-600">No gallery items added yet.</p></div>`;
    return;
  }
  el.innerHTML = arr.map(a => `<div class="bg-white p-3 rounded border flex justify-between items-center">
    <div><strong>${escapeHtml(a.title)}</strong> <div class="text-xs text-gray-500">${escapeHtml(truncate(a.description,80))}</div></div>
    <div><button onclick="deleteGalleryItem('${a.id}')" class="text-sm bg-red-600 text-white px-2 py-1 rounded">Delete</button></div>
  </div>`).join('');
}
renderGalleryAdminList();

function deleteGalleryItem(id) {
  if (!confirm('Delete gallery item?')) return;
  const arr = (loadFromStorage('jmb_gallery') || []).filter(a => a.id !== id);
  saveToStorage('jmb_gallery', arr);
  renderGalleryItems();
  renderGalleryAdminList();
}
window.deleteGalleryItem = deleteGalleryItem;

/* -------------------------
   News admin
   ------------------------- */
function addNewsItem(e) {
  e && e.preventDefault && e.preventDefault();
  const title = byId('newsTitle').value.trim();
  const content = byId('newsContent').value.trim();
  const imageInput = byId('newsImage');
  if (!title || !content) return alert('Please provide title and content.');
  const proceed = (imgDataUrl) => {
    const arr = loadFromStorage('jmb_news') || [];
    arr.push({ id: 'n' + Date.now(), title, content, image: imgDataUrl || null, created: new Date().toISOString() });
    saveToStorage('jmb_news', arr);
    alert('News published.');
    e.target && e.target.reset && e.target.reset();
    renderNewsItems();
    renderNewsAdminList();
  };
  if (imageInput && imageInput.files && imageInput.files[0]) {
    const r = new FileReader();
    r.onload = ev => proceed(ev.target.result);
    r.readAsDataURL(imageInput.files[0]);
  } else {
    proceed(null);
  }
}
window.addNewsItem = addNewsItem;

function renderNewsItems() {
  const arr = loadFromStorage('jmb_news') || [];
  const cont = byId('newsItems');
  if (!cont) return;
  if (!arr.length) {
    cont.innerHTML = `<div class="text-center p-6 bg-gray-50 rounded-lg"><p class="text-gray-600">No news articles added yet. Use the admin portal to add news.</p></div>`;
    return;
  }
  cont.innerHTML = arr.map(n => `
    <article class="bg-white rounded-lg p-4 shadow-sm">
      ${n.image ? `<img src="${n.image}" alt="${escapeHtml(n.title)}" class="w-full h-48 object-cover rounded mb-3">` : ''}
      <h3 class="font-semibold text-lg">${escapeHtml(n.title)}</h3>
      <p class="text-sm text-gray-600">${escapeHtml(truncate(n.content, 240))}</p>
      <div class="text-xs text-gray-400 mt-2">Published: ${new Date(n.created).toLocaleString()}</div>
    </article>
  `).join('');
}
renderNewsItems();

function renderNewsAdminList() {
  const arr = loadFromStorage('jmb_news') || [];
  const el = byId('newsAdminList');
  if (!el) return;
  if (!arr.length) {
    el.innerHTML = `<div class="bg-white p-3 rounded border text-center"><p class="text-gray-600">No news articles added yet.</p></div>`;
    return;
  }
  el.innerHTML = arr.map(n => `<div class="bg-white p-3 rounded border flex justify-between items-center">
    <div><strong>${escapeHtml(n.title)}</strong> <div class="text-xs text-gray-500">${escapeHtml(truncate(n.content,80))}</div></div>
    <div><button onclick="deleteNewsItem('${n.id}')" class="text-sm bg-red-600 text-white px-2 py-1 rounded">Delete</button></div>
  </div>`).join('');
}
renderNewsAdminList();

function deleteNewsItem(id) {
  if (!confirm('Delete news article?')) return;
  const arr = (loadFromStorage('jmb_news') || []).filter(a => a.id !== id);
  saveToStorage('jmb_news', arr);
  renderNewsItems();
  renderNewsAdminList();
}
window.deleteNewsItem = deleteNewsItem;

/* -------------------------
   Partners admin
   ------------------------- */
function addPartnershipContent(e) {
  e && e.preventDefault && e.preventDefault();
  const title = byId('partnerTitle').value.trim();
  const content = byId('partnerContent').value.trim();
  const imageInput = byId('partnerImage');
  if (!title || !content) return alert('Please provide title and content.');
  const proceed = (imgDataUrl) => {
    const arr = loadFromStorage('jmb_partnercontent') || [];
    arr.push({ id: 'pc' + Date.now(), title, content, image: imgDataUrl || null, created: new Date().toISOString() });
    saveToStorage('jmb_partnercontent', arr);
    alert('Partnership content added.');
    e.target && e.target.reset && e.target.reset();
    renderPartnerContent();
    renderPartnerAdminList();
  };
  if (imageInput && imageInput.files && imageInput.files[0]) {
    const r = new FileReader();
    r.onload = ev => proceed(ev.target.result);
    r.readAsDataURL(imageInput.files[0]);
  } else proceed(null);
}
window.addPartnershipContent = addPartnershipContent;

function addPartner(e) {
  e && e.preventDefault && e.preventDefault();
  const name = byId('partnerName').value.trim();
  const desc = byId('partnerDescription').value.trim();
  const logoInput = byId('partnerLogo');
  const website = byId('partnerWebsite').value.trim();
  if (!name || !desc) return alert('Please fill required fields.');
  const proceed = (logoData) => {
    const arr = loadFromStorage('jmb_partners') || [];
    arr.push({ id:'p' + Date.now(), name, description: desc, logo: logoData || null, website, created: new Date().toISOString() });
    saveToStorage('jmb_partners', arr);
    alert('Partner added.');
    e.target && e.target.reset && e.target.reset();
    renderPartnersGrid();
    renderPartnersAdminList();
  };
  if (logoInput && logoInput.files && logoInput.files[0]) {
    const r = new FileReader();
    r.onload = ev => proceed(ev.target.result);
    r.readAsDataURL(logoInput.files[0]);
  } else proceed(null);
}
window.addPartner = addPartner;

function renderPartnerContent() {
  const arr = loadFromStorage('jmb_partnercontent') || [];
  const cont = byId('partnerContent');
  if (!cont) return;
  if (!arr.length) {
    cont.innerHTML = `<div class="text-center p-6 bg-gray-50 rounded-lg"><p class="text-gray-600">No partnership content added yet. Use the admin portal to add content.</p></div>`;
    return;
  }
  cont.innerHTML = arr.map(pc => `
    <div class="bg-white rounded-lg p-4 shadow-sm">
      ${pc.image ? `<img src="${pc.image}" class="w-full h-44 object-cover rounded mb-2">` : ''}
      <h4 class="font-semibold">${escapeHtml(pc.title)}</h4>
      <p class="text-sm text-gray-600">${escapeHtml(truncate(pc.content,220))}</p>
    </div>
  `).join('');
}
renderPartnerContent();

function renderPartnersGrid() {
  const arr = loadFromStorage('jmb_partners') || [];
  const grid = byId('partnersGrid');
  if (!grid) return;
  if (!arr.length) {
    grid.innerHTML = `<div class="text-center p-6 bg-gray-50 rounded-lg"><p class="text-gray-600">No partners added yet. Use the admin portal to add partners.</p></div>`;
    return;
  }
  grid.innerHTML = arr.map(p => `
    <div class="bg-white rounded-lg p-4 text-center shadow-sm">
      ${p.logo ? `<img src="${p.logo}" class="w-24 h-24 object-contain mx-auto mb-2">` : `<div class="w-24 h-24 mx-auto mb-2 bg-gray-100 flex items-center justify-center rounded">Logo</div>`}
      <h4 class="font-semibold">${escapeHtml(p.name)}</h4>
      <p class="text-xs text-gray-500">${escapeHtml(truncate(p.description,120))}</p>
      ${p.website ? `<div class="mt-2"><a href="${escapeHtml(p.website)}" target="_blank" class="text-sm text-indigo-600 underline">Website</a></div>` : ''}
    </div>
  `).join('');
}
renderPartnersGrid();

function renderPartnerAdminList() {
  const arr = loadFromStorage('jmb_partnercontent') || [];
  const el = byId('partnerAdminList');
  if (!el) return;
  if (!arr.length) {
    el.innerHTML = `<div class="bg-white p-3 rounded border text-center"><p class="text-gray-600">No partnership content added yet.</p></div>`;
    return;
  }
  el.innerHTML = arr.map(a => `<div class="bg-white p-3 rounded border flex justify-between items-center">
    <div><strong>${escapeHtml(a.title)}</strong> <div class="text-xs text-gray-500">${escapeHtml(truncate(a.content,80))}</div></div>
    <div><button onclick="deletePartnerContent('${a.id}')" class="text-sm bg-red-600 text-white px-2 py-1 rounded">Delete</button></div>
  </div>`).join('');
}
renderPartnerAdminList();

function renderPartnersAdminList() {
  const arr = loadFromStorage('jmb_partners') || [];
  const el = byId('partnersAdminList');
  if (!el) return;
  if (!arr.length) {
    el.innerHTML = `<div class="bg-white p-3 rounded border text-center"><p class="text-gray-600">No partners added yet.</p></div>`;
    return;
  }
  el.innerHTML = arr.map(a => `<div class="bg-white p-3 rounded border flex justify-between items-center">
    <div><strong>${escapeHtml(a.name)}</strong> <div class="text-xs text-gray-500">${escapeHtml(truncate(a.description,80))}</div></div>
    <div><button onclick="deletePartner('${a.id}')" class="text-sm bg-red-600 text-white px-2 py-1 rounded">Delete</button></div>
  </div>`).join('');
}
renderPartnersAdminList();

function deletePartnerContent(id) {
  if (!confirm('Delete item?')) return;
  const arr = (loadFromStorage('jmb_partnercontent') || []).filter(x => x.id !== id);
  saveToStorage('jmb_partnercontent', arr);
  renderPartnerContent(); renderPartnerAdminList();
}
function deletePartner(id) {
  if (!confirm('Delete partner?')) return;
  const arr = (loadFromStorage('jmb_partners') || []).filter(x => x.id !== id);
  saveToStorage('jmb_partners', arr);
  renderPartnersGrid(); renderPartnersAdminList();
}
window.deletePartnerContent = deletePartnerContent;
window.deletePartner = deletePartner;

/* -------------------------
   Helpers used by search highlight
   ------------------------- */
function highlightNews(id) {
  // naive: just show news section and scroll to top (detailed highlight requires ids in DOM)
  showSection('news');
  window.setTimeout(()=> window.scrollTo({ top: byId('news').offsetTop, behavior: 'smooth' }), 200);
}
function highlightGallery(id) { showSection('gallery'); }
function highlightPartner(id) { showSection('partners'); }

/* -------------------------
   Small safe-guards & init
   ------------------------- */
function ensureLocalStorageKeys() {
  if (!loadFromStorage('jmb_news')) saveToStorage('jmb_news', []);
  if (!loadFromStorage('jmb_gallery')) saveToStorage('jmb_gallery', []);
  if (!loadFromStorage('jmb_partners')) saveToStorage('jmb_partners', []);
  if (!loadFromStorage('jmb_partnercontent')) saveToStorage('jmb_partnercontent', []);
  if (!loadFromStorage('jmb_raffle')) saveToStorage('jmb_raffle', []);
  if (!loadFromStorage('jmb_moa')) saveToStorage('jmb_moa', []);
}
ensureLocalStorageKeys();

/* set initial visible section */
document.addEventListener('DOMContentLoaded', () => {
  // default to home
  showSection('home');
  // wire admin view toggle buttons inside admin portals (if present)
  qa('.admin-portal .admin-view').forEach((el,i)=>{
    // hide all except first
    if (i>0) el.classList.add('hidden');
  });
});
