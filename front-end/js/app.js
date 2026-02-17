const loginForm = document.getElementById("loginForm");
const signUpForm = document.getElementById("signupForm");

const toLoginBtn = document.getElementById("toLogin");
const toSignBtn = document.getElementById("toSignup");

toSignBtn.addEventListener("click", () => {
  loginForm.classList.add("is-hidden");
  signUpForm.classList.remove("is-hidden");
});

toLoginBtn.addEventListener("click", () => {
  signUpForm.classList.add("is-hidden");
  loginForm.classList.remove("is-hidden");
});

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(signUpForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert(
        "Registration successful! Please check your email to verify account.",
      );
      toLoginBtn.click();
    } else {
      alert("Opss..... Something went wrong: " + result.message);
    }
  } catch (error) {
    console.log("error: " + error);
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      if (result.token) {
        localStorage.setItem("userToken", result.token);
      }
      alert("Welcome back");
    } else {
      alert("Login false" + (result.message || "Invalid credentials "));
    }
  } catch (error) {
    console.log("Login error" + error);
  }
});
