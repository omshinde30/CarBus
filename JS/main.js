document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const closeModal = document.querySelector(".close");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const signupTitle = document.getElementById("signupTitle");
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");
  const switchToLoginText = document.getElementById("switchToLoginText");
  const loginBtn = document.getElementById("loginbtn");
  const userDropdown = document.getElementById("userDropdown");
  const loginModal = document.getElementById("modal");

  

  // Open/close modal
  loginBtn.onclick = () => modal.style.display = "block";
  closeModal.onclick = () => modal.style.display = "none";
  window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; }
  // If not logged in
  document.getElementById("userDropdown").classList.add("hidden");
  document.getElementById("loginbtn").textContent = "Login / Signup";

  // Form switch
  switchToSignup.onclick = (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    signupTitle.style.display = "block";
    switchToLoginText.style.display = "block";
    switchToSignup.parentElement.style.display = "none";
  };
  switchToLogin.onclick = (e) => {
    e.preventDefault();
    signupForm.style.display = "none";
    signupTitle.style.display = "none";
    switchToLoginText.style.display = "none";
    loginForm.style.display = "block";
    switchToSignup.parentElement.style.display = "block";
  };
  // const formData = new FormData(e.target);
  // const data = Object.fromEntries(formData.entries()); 
  // ✅ Get initials from full name
  function getInitials(fullName) {
    if (!fullName) return 'User';
    const names = fullName.trim().split(' ');
    return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
  }

  // ✅ Handle login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    const email = loginForm.querySelector('input[name="email"]').value.trim();
    const password = loginForm.querySelector('input[name="password"]').value.trim();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data); 

     

      if (res.ok) {
        const initials = getInitials(data.fullName);
        const loginBtn = document.getElementById("loginbtn");
        loginBtn.textContent = initials;
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong during login.");
    }
    loginBtn.addEventListener("click", () => {
      document.getElementById("userDropdown").classList.toggle("hidden");
    });
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userInitials", getInitials(data.fullName));
    if (isLoggedIn) {
      // ✅ Show dropdown only
      userDropdown.classList.toggle("hidden");
    } else {
      // ✅ Show login modal only
      loginModal.classList.remove("hidden");
    }
  });

  // ✅ Handle signup
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = signupForm.querySelector('input[name="fullName"]').value.trim();
    const email = signupForm.querySelector('input[name="email"]').value.trim();
    const password = signupForm.querySelector('input[name="password"]').value.trim();
    const phone = signupForm.querySelector('input[name="phone"]').value.trim();

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phone })
      });

      const data = await res.json();
      if (res.ok) {
        const initials = getInitials(fullName);
        if (loginBtn) loginBtn.textContent = initials;
        modal.style.display = 'none';
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.error('Signup failed:', err);
      alert("Something went wrong.");
    }
  });

  // ✅ Auto-load initials on refresh
  fetch('/get-user')
    .then(res => res.json())
    .then(data => {
      if (data.initials && loginBtn) {
        loginBtn.textContent = data.initials;
      }
    });
});
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("rideForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const res = await fetch("/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await res.json(); // ✅ read the response ONCE
  
      if (res.ok) {
        alert(result.message);
  
        // Display available cars
        const carSection = document.getElementById("carResults");
        carSection.innerHTML = "";
  
        if (result.cars?.length > 0) {
          result.cars.forEach((car) => {
            const card = document.createElement("div");
            card.classList.add("car-card");
            card.innerHTML = `
              <img src="${car.imageUrl}" alt="${car.name}" />
              <h4>${car.name}</h4>
              <p>Type: ${car.type}</p>
              <p>Location: ${car.location}</p>
            `;
            carSection.appendChild(card);
          });
        } else {
          carSection.innerHTML = "<p>No cars available for this location.</p>";
        }
       
      } else {
        alert(result.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong during booking.");
    }
    const params = new URLSearchParams({
      pickupPoint: data.pickupPoint,
      pickupDate: data.pickupDate
    });
    window.location.href = `/availableCars.html?${params.toString()}`;
  });
  
  
  document.getElementById('viewBookings').addEventListener('click', async (e) => {
    e.preventDefault();
  
    const modal = document.getElementById("bookingModal");
    const section = document.getElementById("myBookingsSection");
  
    if (!modal || !section) return;
  
    try {
      const res = await fetch('/my-bookings');
      const bookings = await res.json();
  
      section.innerHTML = "";
  
      if (bookings.length === 0) {
        section.innerHTML = "<p>You have no bookings yet.</p>";
      } else {
        bookings.forEach(b => {
          section.innerHTML += `
            <div class="booking-card" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
              <p><strong>Pickup:</strong> ${b.pickupPoint} → <strong>Return:</strong> ${b.returnPoint}</p>
              <p><strong>Date:</strong> ${b.pickupDate} → ${b.returnDate}</p>
              <p><strong>Time:</strong> ${b.pickupTime} → ${b.returnTime}</p>
            </div>
          `;
        });
      }
  
      modal.classList.remove("hidden");
  
    } catch (err) {
      console.error("Error loading bookings:", err);
      alert("Could not load bookings.");
    }
  });
  
  
  // Close modal on close button
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("bookingModal").classList.add("hidden");
  });
  
  // Optional: close modal if clicked outside the modal-content
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("bookingModal");
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
  
});
window.addEventListener("DOMContentLoaded", () => {
  const initials = sessionStorage.getItem("userInitials");
  if (sessionStorage.getItem("isLoggedIn") === "true" && initials) {
    document.getElementById("loginbtn").textContent = initials;
    document.getElementById("userDropdown").classList.add("hidden");
  }
});
