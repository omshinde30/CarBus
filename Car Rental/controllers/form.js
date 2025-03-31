document.addEventListener("DOMContentLoaded", function () {
    let today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById("pickupdate").setAttribute("min", today);
    document.getElementById("returndate").setAttribute("min", today);
});
