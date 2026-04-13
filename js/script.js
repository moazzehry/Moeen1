// Splash Screen Logic
document.addEventListener("DOMContentLoaded", () => {
  // Simulate loading and splash screen transition
  setTimeout(() => {
    navigateTo('language-selection');
  }, 3000); // 3 seconds splash screen
});

// Navigation Logic
function navigateTo(sectionId, navElement = null) {
  // Hide all sections
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Show the target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Handle Sidebar/Bottom Nav Visibility
  const mainNav = document.getElementById('main-nav');
  const muftiNav = document.getElementById('mufti-nav');

  // Hide nav on splash screen, language, about, and auth pages
  if (['splash-screen', 'language-selection', 'about-page', 'auth-page', 'color-guide'].includes(sectionId)) {
    if (mainNav) mainNav.style.display = 'none';
    if (muftiNav) muftiNav.style.display = 'none';
  } else if (sectionId.startsWith('mufti-')) {
    if (mainNav) mainNav.style.display = 'none';
    if (muftiNav) muftiNav.style.display = 'flex';
  } else {
    // Show normal navigation for Web layout
    if (mainNav) mainNav.style.display = 'flex';
    if (muftiNav) muftiNav.style.display = 'none';
  }

  // Handle Nav Active Highlights
  if (navElement) {
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(item => item.classList.remove('active'));
    navElement.classList.add('active');
  } else if (!sectionId.startsWith('mufti-') && !['splash-screen', 'language-selection', 'about-page', 'auth-page', 'color-guide'].includes(sectionId)) {
    // Determine which nav to highlight based on sectionId 
    const navItems = document.querySelectorAll('#main-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    if (sectionId === 'dashboard' || sectionId === 'rituals-path' || sectionId === 'digital-bag') navItems[0].classList.add('active');
    else if (sectionId === 'fatwa-search') navItems[1].classList.add('active');
    else if (sectionId === 'consultation') navItems[2].classList.add('active');
  }
}

// Appointment Status Button Activation
function activateStatus(clickedBtn) {
  // Find parent container
  const parent = clickedBtn.closest('.status-buttons');
  if (!parent) return;

  // Remove active class from all buttons in this group
  const btns = parent.querySelectorAll('.st-btn');
  btns.forEach(btn => btn.classList.remove('active'));

  // Add active class to clicked button
  clickedBtn.classList.add('active');

  // Change appointment card outline color based on status
  const card = clickedBtn.closest('.appointment-card');
  if (card) {
    card.classList.remove('app-confirmed', 'app-waiting');
    if (clickedBtn.classList.contains('st-green')) {
      card.classList.add('app-confirmed');
      card.style.borderColor = 'var(--color-safe)';
    } else if (clickedBtn.classList.contains('st-yellow')) {
      card.classList.add('app-waiting');
      card.style.borderColor = 'var(--color-warning)';
    } else if (clickedBtn.classList.contains('st-red')) {
      card.style.borderColor = 'var(--color-alert)';
    }
  }
}

// Interactive Map Logic
function showMapInfo(place, isAuto = false) {
  const bubble = document.getElementById('map-info-bubble');
  if (!bubble) return;

  // Add brief scaling animation
  bubble.style.transform = 'scale(0.9)';
  setTimeout(() => bubble.style.transform = 'scale(1)', 150);

  // Move User Marker Visuals smoothly (walking speed)
  const userMarker = document.querySelector('.user-marker');
  if (userMarker) {
    userMarker.className = 'user-marker'; // reset animation class carefully
    userMarker.style.transition = 'top 6s ease-in-out, left 6s ease-in-out';
    userMarker.style.bottom = 'auto';
    userMarker.style.right = 'auto';
    userMarker.style.marginTop = '-20px'; // align center of the 40px pin
    userMarker.style.marginLeft = '-20px';
    userMarker.style.transform = 'none';

    if (place === 'user') {
      userMarker.style.top = '50%';
      userMarker.style.left = '50%';
      // Start orbit after walking to center
      setTimeout(() => {
        if (userMarker.style.top === '50%') {
          userMarker.classList.add('pin-orbit');
          userMarker.style.transition = '';
        }
      }, 6000);
    } else if (place === 'safa') {
      userMarker.style.top = '80%';
      userMarker.style.left = '85%';
    } else if (place === 'marwa') {
      userMarker.style.top = '20%'; 
      userMarker.style.left = '85%';
    } else if (place === 'maqam') {
      userMarker.style.top = '51%';
      userMarker.style.left = '54%';
    }
  }

  if (place === 'safa') {
    bubble.innerHTML = '<strong>جبل الصفا:</strong> نقطة بداية السعي<br><span class="bubble-status" style="color: var(--color-warning);"><i class="fa-solid fa-person-walking"></i> الوجهة القادمة بعد الطواف</span>';

    // Update Dashboard Grid Texts
    document.getElementById('current-location-title').innerHTML = 'المسعى - جبل الصفا';
    document.getElementById('dynamic-do-text').innerHTML = 'استقبل القبلة، وارفع يديك بالدعاء طويلاً بعد قراءة الآية.';
    document.getElementById('dynamic-dont-text').innerHTML = 'التدافع للوصول إلى أعلى الصفا إن كان هناك زحام.';

  } else if (place === 'marwa') {
    bubble.innerHTML = '<strong>جبل المروة:</strong> نقطة نهاية أشواط السعي<br><span class="bubble-status" style="color: var(--text-secondary);"><i class="fa-solid fa-flag-checkered"></i> نهاية النسك هنا</span>';

    // Update Dashboard Grid Texts
    document.getElementById('current-location-title').innerHTML = 'المسعى - جبل المروة';
    document.getElementById('dynamic-do-text').innerHTML = 'الدعاء والذكر كما فعلت على الصفا، وهذا ختام السعي للمعتمر.';
    document.getElementById('dynamic-dont-text').innerHTML = 'البقاء لفترة طويلة تعرقل حركة الساعين الواصلين للمروة.';

  } else if (place === 'maqam') {
    bubble.innerHTML = '<strong>مقام إبراهيم:</strong> ركعتي الطواف<br><span class="bubble-status" style="color: var(--color-info);"><i class="fa-solid fa-hands-praying"></i> يُسن الصلاة خلفه إن تيسر</span>';

    // Update Dashboard Grid Texts
    document.getElementById('current-location-title').innerHTML = 'المطاف - خلف مقام إبراهيم';
    document.getElementById('dynamic-do-text').innerHTML = 'صلاة ركعتي الطواف خلف المقام (إن تيسر) وتلاوة سورتي الكافرون والإخلاص.';
    document.getElementById('dynamic-dont-text').innerHTML = 'الإصرار على الصلاة خلفه مباشرة إذا كان الطواف مزدحماً.';

  } else if (place === 'user') {
    bubble.innerHTML = '<strong>موقعك الحالي:</strong> صحن المطاف<br><span class="bubble-status" style="color: var(--color-safe);"><i class="fa-solid fa-person-walking"></i> مسار صحيح، استمر</span>';

    // Update Dashboard Grid Texts
    document.getElementById('current-location-title').innerHTML = 'الصحن - طواف العمرة';
    document.getElementById('dynamic-do-text').innerHTML = 'استمر في أداء الطواف والدعاء باطمئنان.';
    document.getElementById('dynamic-dont-text').innerHTML = 'التوقف المفاجئ في مسار الطواف لتفادي إعاقة الحركة.';
  }
}

// Digital Bag Logic
function changeDuaLocation(locationId, btnElement) {
  // Update active button
  const container = btnElement.closest('.location-filters');
  if (container) {
    const btns = container.querySelectorAll('.st-btn');
    btns.forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = '';
      btn.style.color = '';
    });
    btnElement.classList.add('active');
    btnElement.style.background = 'var(--color-safe)';
    btnElement.style.color = 'white';
  }

  // Hide all groups
  const groups = document.querySelectorAll('.dua-location-group');
  groups.forEach(group => {
    group.style.display = 'none';
    group.classList.remove('active');
  });

  // Show target group
  const targetGroup = document.getElementById('dua-' + locationId);
  if (targetGroup) {
    targetGroup.style.display = 'block';
    // Trigger small animation
    targetGroup.style.opacity = '0';
    targetGroup.style.transform = 'translateY(10px)';
    setTimeout(() => {
      targetGroup.style.transition = 'all 0.3s ease';
      targetGroup.style.opacity = '1';
      targetGroup.style.transform = 'translateY(0)';
    }, 10);
  }
}

// Auth Tabs Logic
function switchAuthTab(tabName) {
  const pForm = document.getElementById('pilgrim-login');
  const mForm = document.getElementById('mufti-login');
  const pBtn = document.getElementById('pilgrim-tab-btn');
  const mBtn = document.getElementById('mufti-tab-btn');

  // reset visuals
  pBtn.style.background = ''; pBtn.style.color = '';
  mBtn.style.background = ''; mBtn.style.color = '';

  if (tabName === 'pilgrim') {
    pForm.style.display = 'block';
    mForm.style.display = 'none';
    pBtn.style.background = 'var(--color-safe)';
    pBtn.style.color = 'white';
  } else {
    pForm.style.display = 'none';
    mForm.style.display = 'block';
    mBtn.style.background = 'var(--color-expert)';
    mBtn.style.color = 'white';
    // Reset OTP logic if previously visible
    document.getElementById('mufti-otp-section').style.display = 'none';
    document.getElementById('mufti-btn-submit').style.display = 'block';
    document.getElementById('mufti-btn-submit').innerHTML = 'التحقق وإرسال (OTP) <i class="fa-solid fa-fingerprint" style="margin-right: 8px;"></i>';
    document.getElementById('mufti-btn-submit').style.opacity = '1';
  }
}

function simulateMuftiAuth() {
  const btn = document.getElementById('mufti-btn-submit');
  const otpSection = document.getElementById('mufti-otp-section');
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحقق من الصلاحيات...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.style.display = 'none';
    otpSection.style.display = 'block';

    // Auto focus the first OTP input
    const firstOtpInput = otpSection.querySelector('input');
    if (firstOtpInput) firstOtpInput.focus();

    // Show simulated notification
    alert('محاكاة النظام: تم إرسال رسالة نصية برمز التفعيل (OTP) إلى هاتفك المعتمد. يرجى إدخال الرمز لتأكيد الدخول الآمن.');
  }, 1500);
}

// Theme Toggle Logic
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const toggleBtn = document.querySelector('.theme-toggle i');

  if (currentTheme === 'light') {
    body.setAttribute('data-theme', 'dark');
    if (toggleBtn) {
      toggleBtn.classList.remove('fa-moon');
      toggleBtn.classList.add('fa-sun');
    }
  } else {
    body.setAttribute('data-theme', 'light');
    if (toggleBtn) {
      toggleBtn.classList.remove('fa-sun');
      toggleBtn.classList.add('fa-moon');
    }
  }
}

// Status Toggle Logic (Mufti Panel)
const statusBtns = document.querySelectorAll('.status-btn');
statusBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    // Remove active classes
    statusBtns.forEach(b => {
      b.classList.remove('active-green', 'active-yellow', 'active-red');
      b.style.background = 'transparent';
      b.style.color = 'var(--text-secondary)';

      const icon = b.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
    });

    // Add active class based on index
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
    }

    if (index === 0) {
      btn.classList.add('active-green');
      btn.style.background = 'var(--color-safe)';
      btn.style.color = 'white';
    } else if (index === 1) {
      btn.classList.add('active-yellow');
      btn.style.background = 'var(--color-warning)';
      btn.style.color = 'white';
    } else if (index === 2) {
      btn.classList.add('active-red');
      btn.style.background = 'var(--color-alert)';
    }
  });
});

// Real-time & Simulated Location Tracking Logic
const mapLocations = ['user', 'maqam', 'safa', 'marwa'];
let currentMapIndex = 0;
let mapRotationInterval;
let watchId = null;
let outOfRangeAlertShown = false;
let currentRealPlace = 'user'; // Store the last known actual real place

const HARAM_COORDS = {
    maqam: { lat: 21.422530, lng: 39.826350 },
    safa: { lat: 21.421940, lng: 39.826620 },
    marwa: { lat: 21.424560, lng: 39.827290 },
    tawaf: { lat: 21.422487, lng: 39.826206 }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}

function startRealTimeTracking() {
    const title = document.getElementById('current-location-title');
    if (title) title.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تحديد الموقع الفعلي...';

    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                let minDistance = Infinity;
                let closestPlace = 'tawaf';
                
                for (const [place, coords] of Object.entries(HARAM_COORDS)) {
                    const dist = calculateDistance(userLat, userLng, coords.lat, coords.lng);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestPlace = place;
                    }
                }
                
                if (minDistance > 5000) {
                    showMapInfo('user');
                    document.getElementById('current-location-title').innerHTML = 'الصحن - طواف العمرة <br><span style="font-size:1rem; color:var(--color-alert); display:block; margin-top:5px;"><i class="fa-solid fa-triangle-exclamation"></i> أنت خارج الحرم المكي (تم تفعيل الوضع الافتراضي للتدريب)</span>';
                    showOutOfRangeAlert();
                    return;
                }
                
                if (closestPlace === 'tawaf') closestPlace = 'user';
                
                currentRealPlace = closestPlace; // Update stored real place
                
                showMapInfo(closestPlace, true);
                currentMapIndex = mapLocations.indexOf(closestPlace);
                if(currentMapIndex === -1) currentMapIndex = 0;
            },
            (error) => {
                console.warn('Geolocation error:', error);
                startSimulatedTracking();
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
    } else {
        startSimulatedTracking();
    }
}

function showOutOfRangeAlert() {
    if (outOfRangeAlertShown) return;
    outOfRangeAlertShown = true;

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'out-of-range-modal';
    modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); opacity: 0; transition: opacity 0.3s; padding: 20px;';
    
    const modalBox = document.createElement('div');
    modalBox.style.cssText = 'background: var(--surface); padding: 30px; border-radius: 20px; text-align: center; max-width: 90%; width: 400px; box-shadow: 0 10px 30px rgba(231,76,60,0.3); border-top: 5px solid var(--color-alert); transform: translateY(20px); transition: transform 0.3s;';
    
    modalBox.innerHTML = `
        <i class="fa-solid fa-map-location-dot" style="font-size: 4rem; color: var(--color-alert); margin-bottom: 15px;"></i>
        <h2 style="color: var(--color-alert); margin-bottom: 15px; font-family: 'Cairo', sans-serif;">أنت خارج نطاق الحرم!</h2>
        <p style="color: var(--text-primary); font-size: 1.1rem; line-height: 1.6; margin-bottom: 25px; font-family: 'Cairo', sans-serif;">يبدو أنك تقع خارج النطاق الجغرافي للحرم المكي الشريف.<br><br><strong style="color: var(--text-secondary);">تم تحويلك مؤقتاً لبرنامج التدريب الافتراضي للمحاكاة والتجربة.</strong></p>
        <button onclick="document.getElementById('out-of-range-modal').style.opacity='0'; setTimeout(()=>{document.getElementById('out-of-range-modal').remove(); startSimulatedTracking(); },300)" style="background: var(--color-alert); color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-family: 'Cairo', sans-serif; font-weight: bold; width: 100%; box-shadow: 0 4px 10px rgba(231,76,60,0.2);">موافق، ابدأ التدريب</button>
    `;
    
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
    
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalBox.style.transform = 'translateY(0)';
    }, 100);
}

function forceLocateMe() {
    // If the user's out of range logic was triggered
    if (outOfRangeAlertShown) {
        showMapInfo('user');
        // Flash a quick message in console or UI
    } else {
        showMapInfo(currentRealPlace, true);
    }
}

function startSimulatedTracking() {
  clearInterval(mapRotationInterval);
  showMapInfo(mapLocations[currentMapIndex], true);

  mapRotationInterval = setInterval(() => {
    currentMapIndex = (currentMapIndex + 1) % mapLocations.length;
    showMapInfo(mapLocations[currentMapIndex], true);
  }, 15000); 
}

function goToNextLocation() {
  clearInterval(mapRotationInterval);
  if(watchId) { navigator.geolocation.clearWatch(watchId); watchId = null; }
  currentMapIndex = (currentMapIndex + 1) % mapLocations.length;
  showMapInfo(mapLocations[currentMapIndex], false);
}

function goToPreviousLocation() {
  clearInterval(mapRotationInterval);
  if(watchId) { navigator.geolocation.clearWatch(watchId); watchId = null; }
  currentMapIndex = (currentMapIndex - 1 + mapLocations.length) % mapLocations.length;
  showMapInfo(mapLocations[currentMapIndex], false);
}

// Map Zoom Logic
let currentMapZoom = 1;

function zoomMap(step) {
  const zoomLayer = document.getElementById('map-zoom-layer');
  if (!zoomLayer) return;
  
  currentMapZoom += step;
  if (currentMapZoom < 0.6) currentMapZoom = 0.6;
  if (currentMapZoom > 3) currentMapZoom = 3;
  
  zoomLayer.style.transform = `scale(${currentMapZoom})`;
}

// Start tracking when script loads
document.addEventListener('DOMContentLoaded', () => {
  startRealTimeTracking();
});

// Consultation & Chat Logic
let consultationWaitTimeout;
let queueInterval;

function startConsultationWait() {
  // Hide form, show waiting room
  document.getElementById('consultation-form').style.display = 'none';
  const waitingRoom = document.getElementById('waiting-room');
  waitingRoom.style.display = 'flex';
  document.getElementById('chat-interface').style.display = 'none';

  // Reset waiting room state (Red state)
  const title = document.getElementById('waiting-status-title');
  const desc = document.getElementById('waiting-status-desc');
  const cancelBtn = document.getElementById('cancel-wait-btn');
  const queueElement = document.getElementById('queue-number');

  title.innerText = 'حالة الحجز: في الانتظار';
  title.style.color = 'var(--color-alert)';
  desc.innerText = 'أنت الآن في قائمة الانتظار الافتراضية. يرجى البقاء في هذه الصفحة، النظام سيربطك بالمفتي فور توفره.';
  if (queueElement) queueElement.innerText = '03';
  cancelBtn.style.display = 'block';

  let currentQueue = 3;

  // Simulate queue countdown
  queueInterval = setInterval(() => {
    currentQueue--;

    if (currentQueue > 0) {
      if (queueElement) queueElement.innerText = '0' + currentQueue;
    } else {
      clearInterval(queueInterval);

      // Change to Green state
      title.innerText = 'حالة الحجز: المفتي متاح الآن';
      title.style.color = 'var(--color-safe)';
      desc.innerText = 'جاري تحويلك وإعداد نافذة المراسلة المباشرة...';
      if (queueElement) queueElement.innerText = '00';
      cancelBtn.style.display = 'none';

      // After 2 more seconds, open chat interface
      consultationWaitTimeout = setTimeout(() => {
        waitingRoom.style.display = 'none';
        document.getElementById('chat-interface').style.display = 'flex';
      }, 2000);
    }
  }, 2500); // Wait 2.5 seconds between each queue drop
}

function cancelConsultationWait() {
  clearInterval(queueInterval);
  clearTimeout(consultationWaitTimeout);
  const queueElement = document.getElementById('queue-number');
  if (queueElement) queueElement.innerText = '03'; // Reset back to default
  document.getElementById('waiting-room').style.display = 'none';
  document.getElementById('consultation-form').style.display = '';
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const chatMessages = document.getElementById('chat-messages');

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.style.cssText = 'align-self: flex-end; background: var(--color-safe); color: white; padding: 10px 15px; border-radius: 15px; border-top-left-radius: 0; max-width: 80%; box-shadow: 0 2px 5px rgba(0,0,0,0.05);';
  userMsg.innerText = text;
  chatMessages.appendChild(userMsg);

  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Check if user requested to end the chat
  if (text === 'انهاء المحادثه' || text === 'انهاء المحادثة' || text === 'إنهاء المحادثة' || text === 'إنهاء المحادثه') {
    setTimeout(() => {
      document.getElementById('chat-interface').style.display = 'none';
      document.getElementById('consultation-form').style.display = '';

      // Reset the interface to default message for next time
      chatMessages.innerHTML = `
            <div style="align-self: flex-start; background: var(--surface); color: var(--text-primary); padding: 10px 15px; border-radius: 15px; border-top-right-radius: 0; max-width: 80%; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid var(--glass-border);">
                مرحباً بك، تفضل بطرح سؤالك وسيتم الإجابة عليه بناءً على موقعك ومناسكك الحالية.
            </div>
        `;
    }, 1500); // Wait 1.5 seconds then close
    return;
  }

  // Simulate Mufti generic typing & reply
  setTimeout(() => {
    const muftiMsg = document.createElement('div');
    muftiMsg.style.cssText = 'align-self: flex-start; background: var(--surface); color: var(--text-primary); padding: 10px 15px; border-radius: 15px; border-top-right-radius: 0; max-width: 80%; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid var(--glass-border);';
    muftiMsg.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> يكتب الان...';
    chatMessages.appendChild(muftiMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      muftiMsg.innerHTML = 'سوف يتم الإجابة عليك في غضون ثواني';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2500);
  }, 1000);
}

// Copy Referral Link Functionality
function copyReferralLink() {
  const linkValue = document.getElementById('referral-link-input').value;
  const message = `تم اهداء رفيق المناسك الرقمي معين\nتفضل بزيارة الرابط التالي:\n${linkValue}`;

  navigator.clipboard.writeText(message).then(() => {
    alert('تم نسخ الرابط والرسالة بنجاح! شكراً لمساعدتك في نشر الخير للمعتمرين والحجاج.');
  }).catch(err => {
    console.error('فشل في نسخ الرابط: ', err);
  });
}


function moveToNextOTP(current, event) {
  if (event.key === 'Backspace') {
    if (current.previousElementSibling) {
      current.previousElementSibling.focus();
    }
  } else if (current.value.length === current.maxLength) {
    if (current.nextElementSibling) {
      current.nextElementSibling.focus();
    }
  }
}


function openActionMenu() {
  const menu = document.getElementById('mobile-action-menu');
  if (menu) {
    menu.style.display = 'flex';
  }
}

function closeActionMenu(e) {
  
  if (e.target.id === 'mobile-action-menu' || e.target.closest('.action-btn')) {
    const menu = document.getElementById('mobile-action-menu');
    const content = menu.querySelector('.action-menu-content');

   
    content.style.animation = 'slideUp 0.3s ease reverse forwards';
    menu.style.animation = 'fadeIn 0.3s ease reverse forwards';

    setTimeout(() => {
      menu.style.display = 'none';
      content.style.animation = 'slideUp 0.3s ease forwards';
      menu.style.animation = 'fadeIn 0.3s ease forwards';
    }, 300);
  }
}


