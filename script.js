// ==========================================
// EventSchool Management Platform - JavaScript
// Strictly tailored for school events with matching images
// ==========================================

let events = [
  {
    id: 1,
    title: "Annual Science Fair 2026",
    description: "Students showcase innovative science projects and experiments.",
    category: "Academic",
    date: "2026-11-15",
    time: "9:00 AM - 4:00 PM",
    venue: "School Auditorium",
    status: "Open for Registration",
    max_participants: 200,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Annual Sports Day",
    description: "Inter-house track and field athletics competitions.",
    category: "Sports",
    date: "2026-12-10",
    time: "8:00 AM - 5:00 PM",
    venue: "School Ground",
    status: "Planning",
    max_participants: 500,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Annual Cultural Day",
    description: "Student music performances, dance, and theatrical plays.",
    category: "Cultural",
    date: "2026-12-20",
    time: "10:00 AM - 6:00 PM",
    venue: "School Open Air Stage",
    status: "Open for Registration",
    max_participants: 600,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Robotics & Coding Workshop",
    description: "Hands-on STEM and coding workshop for students.",
    category: "Workshops",
    date: "2026-11-25",
    time: "10:00 AM - 2:00 PM",
    venue: "Computer Lab 1",
    status: "In Progress",
    max_participants: 60,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Parent-Teacher Progress Meet",
    description: "Discussion on quarterly student academic performance.",
    category: "Parent-Teacher Meets",
    date: "2026-11-05",
    time: "1:00 PM - 5:00 PM",
    venue: "School Classrooms",
    status: "Open for Registration",
    max_participants: 300,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
  }
];

// Sample registrations stored in JavaScript
let registrations = [
  {
    id: 1,
    event_id: 1,
    event_title: "Annual Science Fair 2026",
    participant_name: "Rahul Sharma",
    participant_type: "Student",
    email: "rahul@email.com",
    phone: "+91 9876543210",
    registration_date: "2026-10-01",
    check_in_status: "Not Checked In"
  },
  {
    id: 2,
    event_id: 1,
    event_title: "Annual Science Fair 2026",
    participant_name: "Mrs. Sunita Sharma",
    participant_type: "Parent",
    email: "sunita@email.com",
    phone: "+91 9876543211",
    registration_date: "2026-10-02",
    check_in_status: "Checked In"
  }
];

// Sample Resources, Volunteers, and Budget data
let resources = [
  { id: 1, event_id: 1, resource_name: "Projector & Sound Mic", quantity: 2, status: "Allocated" },
  { id: 2, event_id: 2, resource_name: "Track Hurdles & Flags", quantity: 20, status: "Pending Approval" }
];

let volunteers = [
  { id: 1, name: "Priya Roy", role: "Registration Desk", event: "Annual Science Fair 2026", availability: "Full Day" },
  { id: 2, name: "Amit Patel", role: "Stage Coordinator", event: "Annual Cultural Day", availability: "Morning Shift" }
];

let budget = [
  { id: 1, event_id: 1, category: "Trophies", description: "Science Fair Medals", amount: 250, type: "Expense" },
  { id: 2, event_id: 1, category: "Sponsorship", description: "PTA Science Grant", amount: 600, type: "Income / Grant" }
];

let currentRole = 'Admin';

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  renderEvents(events);
  renderDashboard();
  populateEventDropdowns();
});

// Role Selector
function changeUserRole(role) {
  currentRole = role;
  showToast(`Role switched to: ${role}`);
}

// Mobile Navbar Toggle
function toggleMobileMenu() {
  document.getElementById('navMenu').classList.toggle('show');
}

// Render Event Cards Grid
function renderEvents(items) {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
      <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
      <p>No matching school events found.</p>
    </div>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="card-image-wrap">
        <img src="${item.image}" alt="${item.title}">
        <span class="status-tag">${item.status}</span>
      </div>
      <div class="card-content">
        <span class="card-category">${item.category}</span>
        <h3 class="card-title">${item.title}</h3>
        <div class="card-details">
          <span><i class="fa-solid fa-calendar-day"></i> ${item.date} (${item.time})</span>
          <span><i class="fa-solid fa-location-dot"></i> ${item.venue}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm flex-1" onclick="viewEventDetails(${item.id})">Details</button>
          <button class="btn btn-primary btn-sm flex-1" onclick="openRegisterModal(${item.id})">Register</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Real-time Event Filter
function filterEvents() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;

  const filtered = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search) || e.venue.toLowerCase().includes(search);
    const matchesCat = (category === 'All') || (e.category === category);
    const matchesStatus = (status === 'All') || (e.status === status);
    return matchesSearch && matchesCat && matchesStatus;
  });

  renderEvents(filtered);
}

function filterByCategory(cat) {
  document.getElementById('categoryFilter').value = cat;
  filterEvents();
  document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = 'All';
  document.getElementById('statusFilter').value = 'All';
  renderEvents(events);
}

// Modal Toggle Helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

// View Details Modal
function viewEventDetails(id) {
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  document.getElementById('detTitle').innerText = evt.title;
  document.getElementById('detImage').src = evt.image;
  document.getElementById('detCategory').innerText = evt.category;
  document.getElementById('detStatus').innerText = evt.status;
  document.getElementById('detDate').innerText = evt.date;
  document.getElementById('detTime').innerText = evt.time;
  document.getElementById('detVenue').innerText = evt.venue;
  document.getElementById('detCapacity').innerText = evt.max_participants;
  document.getElementById('detDesc').innerText = evt.description;

  openModal('eventDetailModal');
}

// Open Registration Modal
function openRegisterModal(id) {
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  document.getElementById('regEventId').value = evt.id;
  document.getElementById('regEventTitle').value = evt.title;
  openModal('registerModal');
}

// Create New Event Handler
function handleCreateEvent(e) {
  e.preventDefault();
  const newEvt = {
    id: events.length + 1,
    title: document.getElementById('evtTitle').value,
    category: document.getElementById('evtCategory').value,
    status: document.getElementById('evtStatus').value,
    date: document.getElementById('evtDate').value,
    time: document.getElementById('evtTime').value,
    venue: document.getElementById('evtVenue').value,
    max_participants: parseInt(document.getElementById('evtMax').value),
    image: document.getElementById('evtImage').value,
    description: document.getElementById('evtDesc').value
  };

  events.push(newEvt);
  renderEvents(events);
  populateEventDropdowns();
  renderDashboard();
  closeModal('createEventModal');
  showToast("School Event Created Successfully!");
  e.target.reset();
}

// Participant Registration Handler
function handleRegistrationSubmit(e) {
  e.preventDefault();
  const newReg = {
    id: registrations.length + 1,
    event_id: parseInt(document.getElementById('regEventId').value),
    event_title: document.getElementById('regEventTitle').value,
    participant_name: document.getElementById('regName').value,
    email: document.getElementById('regEmail').value,
    participant_type: document.getElementById('regType').value,
    phone: document.getElementById('regPhone').value,
    registration_date: new Date().toISOString().split('T')[0],
    check_in_status: "Not Checked In"
  };

  registrations.push(newReg);
  renderDashboard();
  closeModal('registerModal');
  showToast("Registration submitted successfully!");
  e.target.reset();
}

// Volunteer Handler
function handleVolunteerSubmit(e) {
  e.preventDefault();
  const selectElem = document.getElementById('volEventSelect');
  const eventName = selectElem.options[selectElem.selectedIndex] ? selectElem.options[selectElem.selectedIndex].text : "General";

  const newVol = {
    id: volunteers.length + 1,
    name: document.getElementById('volName').value,
    role: document.getElementById('volRole').value,
    event: eventName,
    availability: document.getElementById('volAvailability').value
  };

  volunteers.push(newVol);
  renderDashboard();
  closeModal('volunteerModal');
  showToast("Volunteer registered successfully!");
  e.target.reset();
}

// Resource Handler
function handleAddResourceSubmit(e) {
  e.preventDefault();
  const newRes = {
    id: resources.length + 1,
    resource_name: document.getElementById('resName').value,
    event_id: parseInt(document.getElementById('resEventSelect').value),
    quantity: parseInt(document.getElementById('resQty').value),
    status: document.getElementById('resStatus').value
  };

  resources.push(newRes);
  renderDashboard();
  closeModal('addResourceModal');
  showToast("Resource allocated!");
  e.target.reset();
}

// Budget Handler
function handleAddBudgetSubmit(e) {
  e.preventDefault();
  const newBud = {
    id: budget.length + 1,
    description: document.getElementById('budItem').value,
    event_id: parseInt(document.getElementById('budEventSelect').value),
    type: document.getElementById('budType').value,
    amount: parseFloat(document.getElementById('budAmount').value),
    category: "General Expense"
  };

  budget.push(newBud);
  renderDashboard();
  closeModal('addBudgetItemModal');
  showToast("Budget entry recorded!");
  e.target.reset();
}

function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Thank you! Message sent to School Committee.");
  e.target.reset();
}

// Lightbox Viewer
function openLightbox(url, caption) {
  document.getElementById('lightboxImg').src = url;
  document.getElementById('lightboxCaption').innerText = caption;
  openModal('lightboxModal');
}

// Switch Dashboard Tab
function switchDashTab(panelId) {
  document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) targetPanel.classList.add('active');
}

// Render Dashboard Data Tables & Stats
function renderDashboard() {
  const statEvents = document.getElementById('statTotalEvents');
  const statRegs = document.getElementById('statTotalRegs');
  const statBudget = document.getElementById('statTotalBudget');

  if (statEvents) statEvents.innerText = events.length;
  if (statRegs) statRegs.innerText = registrations.length;
  
  const totalExp = budget.reduce((acc, curr) => curr.type === 'Expense' ? acc + curr.amount : acc, 0);
  if (statBudget) statBudget.innerText = `$${totalExp}`;

  // Registrations Table
  const regBody = document.getElementById('registrationsTableBody');
  if (regBody) {
    regBody.innerHTML = registrations.map(r => `
      <tr>
        <td><strong>${r.participant_name}</strong></td>
        <td>${r.event_title}</td>
        <td>${r.participant_type}</td>
        <td>${r.email}</td>
        <td><span class="badge ${r.check_in_status === 'Checked In' ? 'badge-accent' : 'badge-orange'}">${r.check_in_status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="toggleCheckIn(${r.id})">${r.check_in_status === 'Checked In' ? 'Undo' : 'Check In'}</button>
        </td>
      </tr>
    `).join('');
  }

  // Resources Table
  const resBody = document.getElementById('resourcesTableBody');
  if (resBody) {
    resBody.innerHTML = resources.map(r => {
      const evt = events.find(e => e.id === r.event_id);
      return `
        <tr>
          <td><strong>${r.resource_name}</strong></td>
          <td>${evt ? evt.title : 'General'}</td>
          <td>${r.quantity}</td>
          <td><span class="badge badge-orange">${r.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  // Volunteers Table
  const volBody = document.getElementById('volunteersTableBody');
  if (volBody) {
    volBody.innerHTML = volunteers.map(v => `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td>${v.role}</td>
        <td>${v.event}</td>
        <td>${v.availability}</td>
      </tr>
    `).join('');
  }

  // Budget Table
  const budBody = document.getElementById('budgetTableBody');
  if (budBody) {
    budBody.innerHTML = budget.map(b => {
      const evt = events.find(e => e.id === b.event_id);
      return `
        <tr>
          <td><strong>${b.description}</strong></td>
          <td>${evt ? evt.title : 'General'}</td>
          <td>${b.category}</td>
          <td><span class="badge ${b.type === 'Expense' ? 'badge-orange' : 'badge-accent'}">${b.type}</span></td>
          <td>$${b.amount}</td>
        </tr>
      `;
    }).join('');
  }
}

// Toggle Check-In Status
function toggleCheckIn(regId) {
  const reg = registrations.find(r => r.id === regId);
  if (reg) {
    reg.check_in_status = (reg.check_in_status === 'Checked In') ? 'Not Checked In' : 'Checked In';
    renderDashboard();
    showToast(`Check-in updated for ${reg.participant_name}`);
  }
}

// Fill Event Select Dropdowns
function populateEventDropdowns() {
  const selects = [
    document.getElementById('volEventSelect'),
    document.getElementById('resEventSelect'),
    document.getElementById('budEventSelect')
  ];

  const optionsHTML = events.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
  selects.forEach(select => {
    if (select) select.innerHTML = optionsHTML;
  });
}

// Export CSV Reports
function exportToCSV(type) {
  let data = [];
  let filename = `${type}_report.csv`;

  if (type === 'events') data = events;
  else if (type === 'registrations') data = registrations;
  else if (type === 'budget') data = budget;

  if (data.length === 0) return showToast("No data to export.");

  const keys = Object.keys(data[0]);
  const csvContent = "data:text/csv;charset=utf-8," 
    + [keys.join(","), ...data.map(row => keys.map(k => `"${row[k]}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`Exported ${type} report successfully!`);
}

// Toast Helper Notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}
