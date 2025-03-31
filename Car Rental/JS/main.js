document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.querySelector(".close");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const signupTitle = document.getElementById("signupTitle");
    const switchToSignup = document.getElementById("switchToSignup");
    const switchToLogin = document.getElementById("switchToLogin");
    const switchToLoginText = document.getElementById("switchToLoginText");

    openModal.onclick = () => modal.style.display = "block";
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; }

    // Switch to Signup Form
    switchToSignup.onclick = (event) => {
        event.preventDefault();
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        signupTitle.style.display = "block";
        switchToLoginText.style.display = "block";
        switchToSignup.parentElement.style.display = "none";
    };

    // Switch to Login Form
    switchToLogin.onclick = (event) => {
        event.preventDefault();
        signupForm.style.display = "none";
        signupTitle.style.display = "none";
        switchToLoginText.style.display = "none";
        loginForm.style.display = "block";
        switchToSignup.parentElement.style.display = "block";
    };
});
document.addEventListener("DOMContentLoaded", function () {
    const phoneNumberInput = document.getElementById("phoneNumber");

    // Ensure only numbers are entered in the phone input
    phoneNumberInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });
});