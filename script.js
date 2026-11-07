// Initial LocalStorage Data Seed with default Admin credentials
if (!localStorage.getItem('es_users')) {
  localStorage.setItem('es_users', JSON.stringify([
    { id: 1, name: "Admin Officer", email: "admin@eventschool.edu", pass: "AdminPass123!", role: "admin" }
  ]));
}

if (!localStorage.getItem('es_events')) {
  localStorage.setItem('es_events', JSON.stringify([
    { 
      id: 101, 
      title: "Annual Science Exhibition", 
      category: "Academic", 
      status: "Open for Registration", 
      date: "2026-11-15", 
      time: "10:00 AM", 
      venue: "Main Auditorium", 
      limit: 50, 
      registered: 2, 
      head: "Prof. Sharma", 
      img: "https://images.unsplash.com/photo-1564069114553-74243c4a6601?w=500", 
      desc: "Annual showcase of student science projects." 
    },
    { 
      id: 102, 
      title: "Inter-School Football Tournament", 
      category: "Sports", 
      status: "Open for Registration", 
      date: "2026-11-20", 
      time: "09:00 AM", 
      venue: "Sports Ground", 
      limit: 100, 
      registered: 5, 
      head: "Coach Rajiv", 
      img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500", 
      desc: "Football tournament for high school teams." 
    }
  ]));
}

if (!localStorage.getItem('es_regs')) {
  localStorage.setItem('es_regs', JSON.stringify([]));
}

if (!localStorage.getItem('es_photos')) {
  localStorage.setItem('es_photos', JSON.stringify([
    "https://picsum.photos/id/1069/400/300",
    "https://picsum.photos/id/1084/400/300"
  ]));
}

let currentUser = JSON.parse(localStorage.getItem('es_current_user')) || null;
let currentTab = 'overview';

// Helper Functions
function getEvents() { return JSON.parse(localStorage.getItem('es_events')) || []; }
function getUsers() { return JSON.parse(localStorage.getItem('es_users')) || []; }
function getRegs() { return JSON.parse(localStorage.getItem('es_regs')) || []; }
function getPhotos() { return JSON.parse(localStorage.getItem('es_photos')) || []; }
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Init UI on load
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  renderEvents();
  renderGallery();
});

function updateAuthUI() {
  const authDiv = document.getElementById('topbarAuth');
  const myRegsSec = document.getElementById('myRegsSection');
  const dashSec = document.getElementById('dashboardSection');
  const addPhotoBtn = document.getElementById('addPhotoNavBtn');

  if (currentUser) {
    authDiv.innerHTML = `<span>Welcome, <strong>${currentUser.name}</strong> (${currentUser.role})</span> | <a onclick="logout()">Log out</a>`;
    if (currentUser.role === 'student') {
      myRegsSec.style.display = 'block';
      dashSec.style.display = 'none';
      if (addPhotoBtn) addPhotoBtn.style.display = 'none';
      renderMyRegs();
    } else if (currentUser.role === 'admin') {
      myRegsSec.style.display = 'none';
      dashSec.style.display = 'block';
      if (addPhotoBtn) addPhotoBtn.style.display = 'inline-block';
      document.getElementById('dashTitle').innerText = 'Administrator Dashboard';
      switchTab(currentTab);
    }
  } else {
    authDiv.innerHTML = `<a onclick="openModal('loginModal')">Log in</a> | <a onclick="openModal('signupModal')">Sign up</a>`;
    myRegsSec.style.display = 'none';
    dashSec.style.display = 'none';
    if (addPhotoBtn) addPhotoBtn.style.display = 'none';
  }
}

// Authentication Actions
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('lEmail').value.trim();
  const pass = document.getElementById('lPass').value;
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);

  if (user) {
    currentUser = user;
    localStorage.setItem('es_current_user', JSON.stringify(user));
    closeModal('loginModal');
    updateAuthUI();
    renderEvents();
    renderGallery();
  } else {
    alert("Invalid email or password! (Default Admin: admin@eventschool.edu / AdminPass123!)");
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('sName').value;
  const email = document.getElementById('sEmail').value.trim();
  const pass = document.getElementById('sPass').value;
  const users = getUsers();

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    alert("User already exists!");
    return;
  }

  const newUser = { id: Date.now(), name, email, pass, role: "student" };
  users.push(newUser);
  localStorage.setItem('es_users', JSON.stringify(users));
  currentUser = newUser;
  localStorage.setItem('es_current_user', JSON.stringify(newUser));
  closeModal('signupModal');
  updateAuthUI();
  renderEvents();
  alert("Student account created and logged in successfully!");
}

function logout() {
  currentUser = null;
  localStorage.removeItem('es_current_user');
  updateAuthUI();
  renderEvents();
  renderGallery();
}

// Events Rendering & Management
function renderEvents() {
  const events = getEvents();
  const search = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  const stat = document.getElementById('statusFilter').value;

  const grid = document.getElementById('eventsGrid');
  const timeline = document.getElementById('timelineList');
  grid.innerHTML = '';
  timeline.innerHTML = '';

  const filtered = events.filter(e => {
    return (cat === 'All' || e.category === cat) &&
           (stat === 'All' || e.status === stat) &&
           (e.title.toLowerCase().includes(search) || e.desc.toLowerCase().includes(search));
  });

  filtered.forEach(ev => {
    const seatsLeft = ev.limit - ev.registered;
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="card-img-container">
        <img src="${ev.img}" class="card-img" alt="Event">
        <span class="card-category">${ev.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${ev.title}</h3>
        <div class="card-meta">
          <p>📅 ${ev.date} @ ${ev.venue}</p>
          <p>👤 Head: ${ev.head}</p>
        </div>
        <div class="seat-progress">
          <div class="seat-label"><span>${seatsLeft} seats left</span><span>${Math.round((ev.registered/ev.limit)*100)}%</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width: ${(ev.registered/ev.limit)*100}%"></div></div>
        </div>
        <button class="btn btn-primary btn-sm" style="margin-top: 10px;" ${seatsLeft <= 0 ? 'disabled' : ''} onclick="registerEvent(${ev.id})">
          ${seatsLeft <= 0 ? 'Full' : 'Register Now'}
        </button>
      </div>
    `;
    grid.appendChild(card);

    const tItem = document.createElement('div');
    tItem.className = 'timeline-item';
    tItem.innerHTML = `<h4>${ev.title}</h4><p>${ev.date} @ ${ev.venue}</p>`;
    timeline.appendChild(tItem);
  });
}

function registerEvent(eventId) {
  if (!currentUser) {
    alert("Please log in first to register!");
    openModal('loginModal');
    return;
  }
  if (currentUser.role !== 'student') {
    alert("Admin accounts cannot register for events as participants.");
    return;
  }

  const regs = getRegs();
  if (regs.find(r => r.eventId === eventId && r.userEmail === currentUser.email)) {
    alert("You are already registered for this event!");
    return;
  }

  const events = getEvents();
  const ev = events.find(e => e.id === eventId);
  ev.registered += 1;
  localStorage.setItem('es_events', JSON.stringify(events));

  const newReg = {
    id: Date.now(),
    eventId: eventId,
    eventTitle: ev.title,
    userEmail: currentUser.email,
    userName: currentUser.name,
    status: "Pending",
    ticketCode: "TICK-" + Math.floor(100000 + Math.random() * 900000)
  };
  regs.push(newReg);
  localStorage.setItem('es_regs', JSON.stringify(regs));

  alert("Registration submitted successfully! Status is Pending.");
  renderEvents();
  renderMyRegs();
}

function renderMyRegs() {
  if (!currentUser || currentUser.role !== 'student') return;
  const regs = getRegs().filter(r => r.userEmail === currentUser.email);
  const tbody = document.getElementById('myRegsBody');
  tbody.innerHTML = regs.map(r => `
    <tr>
      <td>${r.eventTitle}</td>
      <td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td>
      <td><code>${r.ticketCode}</code></td>
      <td>
        ${r.status === 'Approved' ? `<button class="btn btn-outline btn-sm" onclick="showTicket('${r.ticketCode}')">Ticket</button>` : 'Awaiting Approval'}
      </td>
    </tr>
  `).join('');
}

function showTicket(code) {
  document.getElementById('tCode').innerText = code;
  document.getElementById('qrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`;
  openModal('ticketModal');
}

// Admin Dashboard Tabs & Actions
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.sidebar-tab').forEach(b => b.classList.remove('active'));
  const content = document.getElementById('dashContent');

  if (tab === 'overview') {
    const events = getEvents();
    const regs = getRegs();
    content.innerHTML = `
      <h3>System Overview</h3>
      <div class="stats-grid" style="margin-top:15px;">
        <div class="stat-card"><h4>Total Events</h4><div style="font-size:1.5rem; font-weight:bold;">${events.length}</div></div>
        <div class="stat-card"><h4>Total Registrations</h4><div style="font-size:1.5rem; font-weight:bold;">${regs.length}</div></div>
      </div>
    `;
  } else if (tab === 'events') {
    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3>Manage Events (Admin Control)</h3>
        <button class="btn btn-primary btn-sm" onclick="openModal('createEventModal')">+ Create Event</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Seats</th><th>Action</th></tr></thead>
          <tbody>
            ${getEvents().map(e => `
              <tr>
                <td>${e.title}</td>
                <td>${e.category}</td>
                <td>${e.date}</td>
                <td>${e.registered}/${e.limit}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="deleteEvent(${e.id})">Delete Event</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'participants') {
    content.innerHTML = `
      <h3>Participant Approvals</h3>
      <div class="table-responsive" style="margin-top:15px;">
        <table>
          <thead><tr><th>Student Name</th><th>Event</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${getRegs().map(r => `
              <tr>
                <td>${r.userName}</td>
                <td>${r.eventTitle}</td>
                <td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="updateStatus(${r.id}, 'Approved')">Approve</button>
                  <button class="btn btn-secondary btn-sm" onclick="updateStatus(${r.id}, 'Rejected')">Reject</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

function handleCreateEvent(e) {
  e.preventDefault();
  const events = getEvents();
  const newEv = {
    id: Date.now(),
    title: document.getElementById('evTitle').value,
    category: document.getElementById('evCat').value,
    status: "Open for Registration",
    date: document.getElementById('evDate').value,
    venue: document.getElementById('evVenue').value,
    limit: parseInt(document.getElementById('evLimit').value),
    registered: 0,
    head: currentUser.name,
    img: document.getElementById('evImg').value, // <--- Now grabs the custom URL from your input field
    desc: document.getElementById('evDesc').value
  };
  events.push(newEv);
  localStorage.setItem('es_events', JSON.stringify(events));
  closeModal('createEventModal');
  renderEvents();
  switchTab('events');
  alert("Event created successfully with your custom image!");
}

function deleteEvent(eventId) {
  if (!confirm("Are you sure you want to delete this event?")) return;
  let events = getEvents();
  events = events.filter(e => e.id !== eventId);
  localStorage.setItem('es_events', JSON.stringify(events));
  renderEvents();
  switchTab('events');
  alert("Event deleted successfully!");
}

function updateStatus(regId, newStatus) {
  const regs = getRegs();
  const r = regs.find(item => item.id === regId);
  if (r) {
    r.status = newStatus;
    localStorage.setItem('es_regs', JSON.stringify(regs));
    switchTab('participants');
  }
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = 'All';
  document.getElementById('statusFilter').value = 'All';
  renderEvents();
}

function filterCat(cat) {
  document.getElementById('categoryFilter').value = cat;
  renderEvents();
  window.location.href = '#events';
}

function renderGallery() {
  const photos = getPhotos();
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = photos.map(src => `
    <div class="gallery-item"><img src="${src}" alt="Gallery Photo"></div>
  `).join('');
}

function promptAddPhoto() {
  if (!currentUser || currentUser.role !== 'admin') {
    alert("Only admin can add photos to the gallery.");
    return;
  }
  const url = prompt("Enter Image URL for the new gallery photo:");
  if (url) {
    const photos = getPhotos();
    photos.push(url);
    localStorage.setItem('es_photos', JSON.stringify(photos));
    renderGallery();
    alert("Photo added to gallery successfully!");
  }
}
