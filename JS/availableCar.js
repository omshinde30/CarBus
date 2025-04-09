document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const pickupPoint = params.get("pickupPoint");

  const res = await fetch(`/cars?pickupPoint=${pickupPoint}`);
  const cars = await res.json();

  const container = document.getElementById("carContainer");

  if (cars.length === 0) {
    container.innerHTML = "<p>No available cars for this location.</p>";
    return;
  }

  cars.forEach(car => {
    card.className = "card";
    card.style.width = "20rem";
    card.style.margin = "1rem";

    // card.innerHTML = `
    //   <img src="${car.imageUrl}" class="card-img-top" alt="${car.name}">
    //   <div class="card-body">
    //     <h5 class="card-title">${car.name}</h5>
    //     <p class="card-text">${car.description}</p>
    //     <button class="btn btn-warning book-btn" data-id="${car._id}">Book</button>
    //   </div>
    // `;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
  <img src="${car.imageUrl}" class="card-img-top" alt="${car.name}">
  <div class="card-body">
    <h5 class="card-title">${car.name}</h5>
    <p class="card-text">${car.description}</p>
    <button class="btn btn-warning book-btn" data-id="${car._id}">Book</button>
  </div>
`;
    container.appendChild(card);

  });


  // Handle book buttons
  container.addEventListener("click", async (e) => {
    if (e.target.classList.contains("book-btn")) {
      const carId = e.target.dataset.id;

      const res = await fetch(`/book-car/${carId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        e.target.closest(".card").remove(); // Remove from display
      } else {
        alert(result.message || "Booking failed");
      }
    }
  });
});