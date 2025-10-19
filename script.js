// Global variables
let currentSection = 0;
let sections = [];
let currentImageIndex = 0;
let galleryImages = [];
let isPlaying = false;
let messages = [];

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Remove preloader after 2 seconds
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
        initializeSections();
        showSection(0);
      }, 500);
    }
  }, 2000);

  // Initialize components
  extractGuestName();
  initializeMusic();
  initializeGallery();
  initializeMessages();
  initializeNavigation();
  initializeCountdown();

  // Add keyboard navigation
  document.addEventListener("keydown", handleKeyNavigation);

  // Add touch navigation for mobile
  initializeTouchNavigation();
}

// Extract guest name from URL parameter
function extractGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");

  if (guestName) {
    const formattedName = guestName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    document.getElementById("guestName").textContent = formattedName;
  }
}

// Initialize sections
function initializeSections() {
  sections = document.querySelectorAll(".section");
  sections.forEach((section, index) => {
    section.style.display = index === 0 ? "flex" : "none";
  });
}

// Show specific section
function showSection(index) {
  if (index < 0 || index >= sections.length) return;

  // Hide current section
  if (sections[currentSection]) {
    sections[currentSection].style.display = "none";
    sections[currentSection].classList.remove("visible");
  }

  // Show new section
  currentSection = index;
  sections[currentSection].style.display = "flex";

  // Trigger animation after a small delay
  setTimeout(() => {
    sections[currentSection].classList.add("visible");
  }, 50);

  // Update navigation
  updateNavigation();

  // Scroll to top of new section
  window.scrollTo(0, 0);
}

// Update navigation active state
function updateNavigation() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
  navButtons.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentSection);
  });
}

// Initialize navigation
function initializeNavigation() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
  navButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => showSection(index));
  });
}

// Handle keyboard navigation
function handleKeyNavigation(event) {
  // Only allow Escape key for closing gallery
  switch (event.key) {
    case "Escape":
      event.preventDefault();
      closeGallery();
      break;
  }
}

// Initialize touch navigation
function initializeTouchNavigation() {
  // Touch navigation disabled - only navbar navigation allowed
}

// Check if element is scrollable
function isElementScrollable(element) {
  return element.scrollHeight > element.clientHeight;
}

// Open invitation (from splash to next section)
function openInvitation() {
  showSection(1);

  // Start music if user interacted
  const music = document.getElementById("bgMusic");
  if (music) {
    music
      .play()
      .then(() => {
        isPlaying = true;
        updateMusicControl();
      })
      .catch((error) => {
        console.log("Autoplay prevented:", error);
      });
  }
}
const splashSection = document.querySelector("#splash");
const nav = document.querySelector(".bottom-nav");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        nav.style.display = "none"; // hide
      } else {
        nav.style.display = "flex"; // show
      }
    });
  },
  { threshold: 0.6 }
);

observer.observe(splashSection);

// Initialize countdown timer
function initializeCountdown() {
  const weddingDate = new Date("2025-11-29T10:00:00+07:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = days
        .toString()
        .padStart(2, "0");
      document.getElementById("hours").textContent = hours
        .toString()
        .padStart(2, "0");
      document.getElementById("minutes").textContent = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("seconds").textContent = seconds
        .toString()
        .padStart(2, "0");
    } else {
      // Wedding day has arrived
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
    }
  }

  // Update countdown immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Initialize music functionality
function initializeMusic() {
  const musicControl = document.getElementById("musicControl");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");

  if (!bgMusic) return;

  // Load music preference from localStorage
  const musicPreference = localStorage.getItem("musicPlaying");
  if (musicPreference === "true") {
    isPlaying = true;
    bgMusic.play().catch((error) => console.log("Autoplay prevented:", error));
  }

  updateMusicControl();

  musicToggle.addEventListener("click", toggleMusic);

  // Update controls when music ends
  bgMusic.addEventListener("ended", () => {
    isPlaying = false;
    updateMusicControl();
    localStorage.setItem("musicPlaying", "false");
  });
}

function toggleMusic() {
  const bgMusic = document.getElementById("bgMusic");
  if (!bgMusic) return;

  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
  } else {
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
      })
      .catch((error) => {
        console.error("Error playing music:", error);
        showToast("Tidak dapat memutar musik");
        return;
      });
  }

  updateMusicControl();
  localStorage.setItem("musicPlaying", isPlaying.toString());
}

function updateMusicControl() {
  const musicControl = document.getElementById("musicControl");
  if (musicControl) {
    musicControl.classList.toggle("playing", isPlaying);
  }
}

// Open Google Maps
function openMaps() {
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=-6.259788,107.156840";
  window.open(mapsUrl, "_blank", "noopener,noreferrer");
}

// Copy account number to clipboard
function copyAccountNumber() {
  const accountNumber = document.getElementById("accountNumber").textContent;

  // Try modern clipboard API first
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(accountNumber)
      .then(() => {
        showToast("Nomor rekening tersalin");
      })
      .catch(() => {
        fallbackCopy(accountNumber);
      });
  } else {
    fallbackCopy(accountNumber);
  }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    showToast("Nomor rekening tersalin");
  } catch (err) {
    showToast("Gagal menyalin nomor rekening");
  }

  document.body.removeChild(textArea);
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Initialize gallery
function initializeGallery() {
  galleryImages = [
    "./assets/IMG_3094.JPG",
    "./assets/IMG_3096.JPG",
    "./assets/IMG_3207.JPG",
    "./assets/IMG_3212.JPG",
    "./assets/IMG_3217.JPG",
    "./assets/IMG_3222.JPG",
  ];
}

// Open gallery modal
function openGallery(index) {
  currentImageIndex = index;
  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("modalImage");

  if (modal && modalImage) {
    modalImage.src = galleryImages[currentImageIndex];
    modalImage.alt = `Prewedding ${currentImageIndex + 1}`;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Add keyboard event listener for modal
    document.addEventListener("keydown", handleGalleryKeyboard);
  }
}

// Close gallery modal
function closeGallery() {
  const modal = document.getElementById("galleryModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleGalleryKeyboard);
  }
}

// Handle keyboard navigation in gallery
function handleGalleryKeyboard(event) {
  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      prevImage();
      break;
    case "ArrowRight":
      event.preventDefault();
      nextImage();
      break;
    case "Escape":
      event.preventDefault();
      closeGallery();
      break;
  }
}

// Previous image in gallery
function prevImage() {
  currentImageIndex =
    (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  updateModalImage();
}

// Next image in gallery
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  updateModalImage();
}

// Update modal image
function updateModalImage() {
  const modalImage = document.getElementById("modalImage");
  if (modalImage) {
    modalImage.src = galleryImages[currentImageIndex];
    modalImage.alt = `Prewedding ${currentImageIndex + 1}`;
  }
}

// Initialize gallery modal click outside to close
document
  .getElementById("galleryModal")
  ?.addEventListener("click", function (event) {
    if (event.target === this) {
      closeGallery();
    }
  });

// Initialize gallery swipe gestures for mobile
let galleryTouchStartX = 0;
let galleryTouchEndX = 0;

document.getElementById("galleryModal")?.addEventListener(
  "touchstart",
  function (event) {
    galleryTouchStartX = event.changedTouches[0].screenX;
  },
  false
);

document.getElementById("galleryModal")?.addEventListener(
  "touchend",
  function (event) {
    galleryTouchEndX = event.changedTouches[0].screenX;
    handleGallerySwipe();
  },
  false
);

function handleGallerySwipe() {
  const swipeThreshold = 50;
  const diff = galleryTouchStartX - galleryTouchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextImage(); // Swipe left - next image
    } else {
      prevImage(); // Swipe right - previous image
    }
  }
}

// Initialize messages
function initializeMessages() {
  loadMessages();
  setupMessageForm();
}

// Load messages from JSON and localStorage
async function loadMessages() {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwOcWHVnbSfmseHX9Ew3e66rMxabR-gWdwynf0GcSWFg_c-GjrDVc-ILn3ZYGwODe5W/exec";

  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();

    // data = array dari Google Sheet
    // Contoh: [{ name: "Dani", message: "Selamat!", timestamp: "..." }, ...]

    // Simpan ke variabel global messages (supaya displayMessages() tetap bisa jalan)
    messages = data.reverse(); // pesan terbaru tampil paling atas

    displayMessages();
  } catch (error) {
    console.error("Error loading messages:", error);
    messages = [];
    displayMessages();
  }
}

// Display messages in the messages list
function displayMessages() {
  const messagesList = document.getElementById("messagesList");
  if (!messagesList) return;

  messagesList.innerHTML = "";

  if (messages.length === 0) {
    messagesList.innerHTML =
      '<p style="text-align: center; opacity: 0.7;">Belum ada ucapan. Jadilah yang pertama!</p>';
    return;
  }

  messages.forEach((message, index) => {
    const messageElement = document.createElement("div");
    messageElement.className = "message-item";
    messageElement.style.animationDelay = `${index * 0.1}s`;

    messageElement.innerHTML = `
            <div class="message-name">${escapeHtml(message.name)}</div>
            <div class="message-text">${escapeHtml(message.text)}</div>
        `;

    messagesList.appendChild(messageElement);
  });

  // Scroll to bottom to show latest messages
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Setup message form
function setupMessageForm() {
  const messageForm = document.getElementById("messageForm");
  if (!messageForm) return;

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwOcWHVnbSfmseHX9Ew3e66rMxabR-gWdwynf0GcSWFg_c-GjrDVc-ILn3ZYGwODe5W/exec";

  messageForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("messageName");
    const textInput = document.getElementById("messageText");

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    // Validasi input
    if (!name || name.length < 2) {
      showToast("Nama harus diisi minimal 2 karakter");
      nameInput.focus();
      return;
    }

    if (!text || text.length < 5) {
      showToast("Pesan harus diisi minimal 5 karakter");
      textInput.focus();
      return;
    }

    // Kirim ke Google Sheet
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          message: text,
        }),
      });

      // Bersihkan form
      nameInput.value = "";
      textInput.value = "";

      // Reload pesan dari server
      await loadMessagesFromSheet();

      showToast("Ucapan berhasil dikirim");
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      showToast("Terjadi kesalahan saat mengirim pesan");
    }
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

// Intersection Observer for section animations (alternative to manual scroll detection)
if ("IntersectionObserver" in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe all sections when they're available
  setTimeout(() => {
    document.querySelectorAll(".section").forEach((section) => {
      sectionObserver.observe(section);
    });
  }, 100);
}

// Service Worker registration for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Only register service worker in production
    if (
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => console.log("SW registered"))
        .catch((error) => console.log("SW registration failed"));
    }
  });
}

// Prevent right-click on images (optional)
document.addEventListener("contextmenu", function (event) {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});

// Lazy loading for images (additional performance optimization)
if ("loading" in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach((img) => {
    img.src = img.src;
  });
} else {
  // Fallback for browsers that don't support native lazy loading
  const script = document.createElement("script");
  script.src =
    "https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver";
  document.head.appendChild(script);
}

// Error handling for missing audio file
document.getElementById("bgMusic")?.addEventListener("error", function () {
  console.warn("Background music file not found");
  document.getElementById("musicControl").style.display = "none";
});

// Performance optimization: Preload critical images
function preloadImages() {
  const criticalImages = [
    "https://images.pexels.com/photos/1024968/pexels-photo-1024968.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
  ];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Call preload after initial load
setTimeout(preloadImages, 1000);
