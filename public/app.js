let currentUser = null;
let loginStep = 'phone';
let selectedTechnicianId = null;
let currentPhoneForLogin = null;
let technicians = [];
let jobs = [];
let unlockedTechnicians = new Set();

document.addEventListener('DOMContentLoaded', () => {
  loadUserFromStorage();
  initializeApp();
});

function initializeApp() {
  if (currentUser) {
    showDashboard();
    loadTechnicians();
    loadJobs();
    loadUnlockedContacts();
  } else {
    showLoginPrompt();
  }
}

function loadUserFromStorage() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    currentUser = JSON.parse(userStr);
  }
}

function showDashboard() {
  document.getElementById('searchSection').style.display = 'block';
  document.getElementById('dashboardGrid').style.display = 'grid';
  document.getElementById('loginPrompt').style.display = 'none';
  document.getElementById('walletInfo').style.display = 'flex';
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'block';
  updateWalletDisplay();
}

function showLoginPrompt() {
  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('dashboardGrid').style.display = 'none';
  document.getElementById('loginPrompt').style.display = 'block';
  document.getElementById('walletInfo').style.display = 'none';
  document.getElementById('loginBtn').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'none';
}

function updateWalletDisplay() {
  if (currentUser) {
    document.getElementById('walletBalance').textContent = `₹${Number(currentUser.walletBalance).toFixed(2)}`;
  }
}

function showLoginModal() {
  const modal = document.getElementById('loginModal');
  modal.classList.add('active');
  resetLoginForm();
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
  resetLoginForm();
}

function resetLoginForm() {
  loginStep = 'phone';
  currentPhoneForLogin = null;
  document.getElementById('phoneInput').value = '';
  document.getElementById('otpInput').value = '';
  document.getElementById('phoneInput').style.display = 'block';
  document.getElementById('otpGroup').style.display = 'none';
  document.getElementById('roleGroup').style.display = 'none';
  document.getElementById('loginActionBtn').textContent = 'Send OTP';
}

async function sendOTP() {
  if (loginStep === 'phone') {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    currentPhoneForLogin = phone;
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      if (response.ok) {
        loginStep = 'otp';
        document.getElementById('phoneInput').style.display = 'none';
        document.getElementById('otpGroup').style.display = 'block';
        document.getElementById('loginActionBtn').textContent = 'Verify OTP';
        alert('OTP sent! Check console for OTP code (development mode)');
      }
    } catch (error) {
      alert('Error sending OTP: ' + error.message);
    }
  } else if (loginStep === 'otp') {
    const otp = document.getElementById('otpInput').value;
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: currentPhoneForLogin, code: otp })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          currentUser = data.user;
          localStorage.setItem('user', JSON.stringify(currentUser));
          closeLoginModal();
          showDashboard();
          loadTechnicians();
          loadJobs();
          loadUnlockedContacts();
        } else {
          loginStep = 'role';
          document.getElementById('otpGroup').style.display = 'none';
          document.getElementById('roleGroup').style.display = 'block';
          document.getElementById('loginActionBtn').textContent = 'Sign Up';
        }
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      alert('Error verifying OTP: ' + error.message);
    }
  } else if (loginStep === 'role') {
    const role = document.querySelector('input[name="role"]:checked').value;
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentPhoneForLogin,
          name: 'User',
          role: role
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        currentUser = data.user;
        localStorage.setItem('user', JSON.stringify(currentUser));
        closeLoginModal();
        showDashboard();
        loadTechnicians();
        loadJobs();
      }
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  showLoginPrompt();
}

async function loadTechnicians() {
  try {
    const response = await fetch('/api/technicians');
    if (response.ok) {
      technicians = await response.json();
      renderTechnicians();
    }
  } catch (error) {
    console.error('Error loading technicians:', error);
  }
}

async function loadJobs() {
  if (!currentUser) return;
  
  try {
    const response = await fetch(`/api/jobs/my-jobs?customerId=${currentUser.id}`);
    if (response.ok) {
      jobs = await response.json();
      renderJobs();
    }
  } catch (error) {
    console.error('Error loading jobs:', error);
  }
}

async function loadUnlockedContacts() {
  if (!currentUser) return;
  
  try {
    const response = await fetch(`/api/chat-unlocks/my-unlocks?customerId=${currentUser.id}`);
    if (response.ok) {
      const unlocked = await response.json();
      unlockedTechnicians = new Set(unlocked.map(u => u.technicianId));
      renderTechnicians();
    }
  } catch (error) {
    console.error('Error loading unlocked contacts:', error);
  }
}

function renderTechnicians() {
  const container = document.getElementById('techList');
  
  if (technicians.length === 0) {
    container.innerHTML = '<div class="muted" style="text-align: center; padding: 2rem 1rem;">No technicians found</div>';
    return;
  }
  
  container.innerHTML = technicians.map(tech => `
    <div class="tech-card" onclick="showTechnicianProfile('${tech.id}')">
      <div class="avatar" aria-hidden="">${getInitials(tech.user.name)}</div>
      <div class="tech-main">
        <b>${tech.user.name}</b>
        <div class="tech-sub">${tech.skills[0] || 'Technician'} • <span class="muted">${tech.experience} yrs</span></div>
        <div class="tech-meta">
          <div class="chip">Base ₹${199 + (tech.skills.length * 50)}</div>
          <div class="chip">${tech.skills[0]}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="rating" title="Rating">${tech.rating}</div>
        <a class="whatsapp-link" href="https://wa.me/91${tech.user.phone}?text=Hi%20${encodeURIComponent(tech.user.name)}" target="_blank" rel="noopener">
          <button class="whatsapp-btn" aria-label="WhatsApp ${tech.user.name}" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" fill="currentColor" style="height:16px;width:16px">
              <path d="M20.5 3.5A11.5 11.5 0 1 0 12 23a11.3 11.3 0 0 0 6.2-1.8l3.4 1-1-3.3A11.3 11.3 0 0 0 23 12 11.5 11.5 0 0 0 20.5 3.5zm-8.5 16.2a9.6 9.6 0 0 1-5.2-1.5l-.4-.3-3.1.9.9-3.1-.3-.4A9.6 9.6 0 1 1 12 19.7z"></path>
              <path d="M17.6 14.2c-.3-.1-1.8-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.9-.3-3.1-1.8-4.1-3.2-.3-.4.3-.4 1.1-1.4.1-.2.1-.4 0-.6-.1-.2-1-2.4-1.3-3.1-.3-.7-.6-.6-.8-.6-.3 0-.5 0-.8 0-.3 0-.7.1-1.1.7-.4.7-1.4 2.3-1.4 4.5 0 2.2 1.4 4.3 1.6 4.6.2.3 2.7 4.3 6.8 5.9 4.1 1.6 4.1 1 4.8.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.7-.4z"></path>
            </svg>
            WhatsApp
          </button>
        </a>
      </div>
    </div>
  `).join('');
}

function renderJobs() {
  const container = document.getElementById('jobList');
  
  if (jobs.length === 0) {
    container.innerHTML = '<div class="muted" style="text-align: center; padding: 2rem 1rem;">No jobs posted yet. Post your first job!</div>';
    return;
  }
  
  container.innerHTML = jobs.map((job, idx) => `
    <div class="job-card">
      <div class="job-top">
        <div style="flex:1">
          <div class="job-title"><b>${job.title}</b></div>
          <div class="job-meta">
            <span class="muted">${job.customer?.name || 'Customer'}</span>
            <span class="muted">•</span>
            <span class="muted">PIN ${job.pinCode || '000000'}</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div class="price-tag">₹${job.budget}</div>
          <button class="bid-btn" data-jobid="${job.id}" onclick="toggleBids(event, '${job.id}')">View Bids</button>
        </div>
      </div>
      <div id="bidders-${job.id}" class="bidders-list" aria-hidden="true" style="display: none;">
        <p class="muted">No bids yet</p>
      </div>
    </div>
  `).join('');
}

function toggleBids(event, jobId) {
  event.stopPropagation();
  const biddersDiv = document.getElementById(`bidders-${jobId}`);
  if (biddersDiv.style.display === 'none') {
    biddersDiv.style.display = 'block';
    biddersDiv.setAttribute('aria-hidden', 'false');
  } else {
    biddersDiv.style.display = 'none';
    biddersDiv.setAttribute('aria-hidden', 'true');
  }
}

async function showTechnicianProfile(techId) {
  selectedTechnicianId = techId;
  const tech = technicians.find(t => t.id === techId);
  if (!tech) return;
  
  const isUnlocked = unlockedTechnicians.has(techId);
  const dailyRate = 199 + (tech.skills.length * 50);
  
  const workPhotos = [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517420879713-6d4ee50991d3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516516407957-5d86903aafb7?w=400&h=400&fit=crop',
  ];
  
  const content = `
    <div class="profile-header">
      <div class="profile-avatar">${getInitials(tech.user.name)}</div>
      <div class="profile-info">
        <h2>${tech.user.name}</h2>
        <p>${tech.skills[0]} Specialist</p>
        <p>📍 ${tech.location}</p>
      </div>
    </div>
    
    <div class="profile-section">
      <h3>Previous Work</h3>
      <div class="photo-slider" id="photoSlider">
        <img id="photoImg" src="${workPhotos[0]}" alt="Work photo">
        <button class="photo-nav prev" onclick="prevPhoto()">‹</button>
        <button class="photo-nav next" onclick="nextPhoto()">›</button>
        <div class="photo-counter"><span id="photoCount">1</span> / ${workPhotos.length}</div>
      </div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Skills</div>
        <div class="stat-value">${tech.skills.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Experience</div>
        <div class="stat-value">${tech.experience} yrs</div>
      </div>
    </div>
    
    <div class="rating-card">
      <div class="rating-display">
        <div class="rating-number">${tech.rating}</div>
        <div>
          <div class="rating-stars">${'★'.repeat(Math.round(Number(tech.rating)))}${'☆'.repeat(5 - Math.round(Number(tech.rating)))}</div>
          <div class="review-count">${tech.totalReviews} customer reviews</div>
        </div>
      </div>
    </div>
    
    <div class="price-card">
      <div class="price-label">Daily Wage / Starting Rate</div>
      <div><span class="price-value">₹${dailyRate}</span><span class="price-unit">per day</span></div>
    </div>
    
    ${tech.bio ? `<p style="margin-bottom: 1.5rem; color: var(--text-muted);">${tech.bio}</p>` : ''}
    
    <div class="profile-actions">
      <a href="https://wa.me/91${tech.user.phone}?text=Hi%20${encodeURIComponent(tech.user.name)}" target="_blank" class="btn btn-primary whatsapp-contact" style="text-decoration: none;">
        WhatsApp
      </a>
      ${!isUnlocked ? `<button class="btn btn-primary" onclick="showUnlockModal('${techId}', '${tech.user.name}')">Unlock (₹10)</button>` : '<div class="btn" style="background-color: var(--text-muted); cursor: default;">✓ Unlocked</div>'}
    </div>
  `;
  
  document.getElementById('profileContent').innerHTML = content;
  window.workPhotos = workPhotos;
  window.currentPhotoIndex = 0;
  document.getElementById('profileModal').classList.add('active');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
}

function prevPhoto() {
  window.currentPhotoIndex = (window.currentPhotoIndex - 1 + window.workPhotos.length) % window.workPhotos.length;
  updatePhotoDisplay();
}

function nextPhoto() {
  window.currentPhotoIndex = (window.currentPhotoIndex + 1) % window.workPhotos.length;
  updatePhotoDisplay();
}

function updatePhotoDisplay() {
  document.getElementById('photoImg').src = window.workPhotos[window.currentPhotoIndex];
  document.getElementById('photoCount').textContent = window.currentPhotoIndex + 1;
}

function filterTechnicians() {
  const location = document.getElementById('locationInput').value.toLowerCase();
  const category = document.getElementById('categorySelect').value.toLowerCase();
  
  const filtered = technicians.filter(tech => {
    const locMatch = !location || tech.location.toLowerCase().includes(location);
    const catMatch = !category || tech.skills.some(s => s.toLowerCase().includes(category));
    return locMatch && catMatch;
  });
  
  const container = document.getElementById('techList');
  container.innerHTML = filtered.map(tech => `
    <div class="tech-card" onclick="showTechnicianProfile('${tech.id}')">
      <div class="avatar" aria-hidden="">${getInitials(tech.user.name)}</div>
      <div class="tech-main">
        <b>${tech.user.name}</b>
        <div class="tech-sub">${tech.skills[0] || 'Technician'} • <span class="muted">${tech.experience} yrs</span></div>
        <div class="tech-meta">
          <div class="chip">Base ₹${199 + (tech.skills.length * 50)}</div>
          <div class="chip">${tech.skills[0]}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="rating" title="Rating">${tech.rating}</div>
        <a class="whatsapp-link" href="https://wa.me/91${tech.user.phone}?text=Hi%20${encodeURIComponent(tech.user.name)}" target="_blank" rel="noopener">
          <button class="whatsapp-btn" aria-label="WhatsApp ${tech.user.name}" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" fill="currentColor" style="height:16px;width:16px">
              <path d="M20.5 3.5A11.5 11.5 0 1 0 12 23a11.3 11.3 0 0 0 6.2-1.8l3.4 1-1-3.3A11.3 11.3 0 0 0 23 12 11.5 11.5 0 0 0 20.5 3.5zm-8.5 16.2a9.6 9.6 0 0 1-5.2-1.5l-.4-.3-3.1.9.9-3.1-.3-.4A9.6 9.6 0 1 1 12 19.7z"></path>
              <path d="M17.6 14.2c-.3-.1-1.8-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.9-.3-3.1-1.8-4.1-3.2-.3-.4.3-.4 1.1-1.4.1-.2.1-.4 0-.6-.1-.2-1-2.4-1.3-3.1-.3-.7-.6-.6-.8-.6-.3 0-.5 0-.8 0-.3 0-.7.1-1.1.7-.4.7-1.4 2.3-1.4 4.5 0 2.2 1.4 4.3 1.6 4.6.2.3 2.7 4.3 6.8 5.9 4.1 1.6 4.1 1 4.8.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.7-.4z"></path>
            </svg>
            WhatsApp
          </button>
        </a>
      </div>
    </div>
  `).join('');
}

function voiceSearch() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById('locationInput').value = text;
    filterTechnicians();
  };
  recognition.start();
}

function showPostJobModal() {
  if (!currentUser) {
    alert('Please login first');
    return;
  }
  
  const balance = Number(currentUser.walletBalance) || 0;
  if (balance <= 0) {
    showRechargeModal();
    return;
  }
  
  document.getElementById('postJobModal').classList.add('active');
}

function closePostJobModal() {
  document.getElementById('postJobModal').classList.remove('active');
}

async function submitJob(event) {
  event.preventDefault();
  
  if (!currentUser) return;
  
  const jobData = {
    customerId: currentUser.id,
    title: document.getElementById('jobTitle').value,
    description: document.getElementById('jobDesc').value,
    category: document.getElementById('jobCategory').value,
    budget: document.getElementById('jobBudget').value,
    location: document.getElementById('jobLocation').value,
  };
  
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    
    if (response.ok) {
      alert('Job posted successfully!');
      closePostJobModal();
      event.target.reset();
      loadJobs();
    }
  } catch (error) {
    alert('Error posting job: ' + error.message);
  }
}

function showRechargeModal() {
  document.getElementById('rechargeModal').classList.add('active');
}

function closeRechargeModal() {
  document.getElementById('rechargeModal').classList.remove('active');
}

async function recharge(amount) {
  if (!currentUser) return;
  
  try {
    const response = await fetch('/api/wallet/recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        amount: amount.toString()
      })
    });
    
    if (response.ok) {
      const userResponse = await fetch(`/api/users/${currentUser.id}`);
      const updatedUser = await userResponse.json();
      currentUser = updatedUser;
      localStorage.setItem('user', JSON.stringify(currentUser));
      updateWalletDisplay();
      closeRechargeModal();
      alert(`Wallet recharged with ₹${amount}`);
      showPostJobModal();
    }
  } catch (error) {
    alert('Error recharging wallet: ' + error.message);
  }
}

function showUnlockModal(techId, techName) {
  selectedTechnicianId = techId;
  document.getElementById('unlockMessage').textContent = `Unlock contact details for ${techName}?`;
  document.getElementById('unlockModal').classList.add('active');
}

function closeUnlockModal() {
  document.getElementById('unlockModal').classList.remove('active');
}

async function confirmUnlock() {
  if (!currentUser || !selectedTechnicianId) return;
  
  try {
    const response = await fetch('/api/chat-unlocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: currentUser.id,
        technicianId: selectedTechnicianId
      })
    });
    
    if (response.ok) {
      unlockedTechnicians.add(selectedTechnicianId);
      
      const userResponse = await fetch(`/api/users/${currentUser.id}`);
      const updatedUser = await userResponse.json();
      currentUser = updatedUser;
      localStorage.setItem('user', JSON.stringify(currentUser));
      updateWalletDisplay();
      
      closeUnlockModal();
      alert('Contact unlocked!');
      showTechnicianProfile(selectedTechnicianId);
    }
  } catch (error) {
    alert('Error unlocking contact: ' + error.message);
  }
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}