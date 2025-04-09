document.addEventListener("DOMContentLoaded", function () {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("pickupdate").setAttribute("min", today);
    document.getElementById("returndate").setAttribute("min", today);
});

let pickup = document.getElementById("pickupdate");
let drop = document.getElementById("returndate");
const period = document.querySelector(".period");

function DateDifference() {

    const d1 = pickup.value;
    const d2 = drop.value;

    if (!d1 || !d2) {
        period.innerText = '';
        return;
    }

    const date1 = new Date(d1);
    const date2 = new Date(d2);

    const diffTime = Math.abs(date1 - date2);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    period.innerText = `Period ${diffDays} days`;
}
pickup.addEventListener('input', DateDifference);
drop.addEventListener('input', DateDifference);
