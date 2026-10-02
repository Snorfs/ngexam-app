const API_BASE_URL = "https://exam-prep-backend-git-staging-bidex327s-projects.vercel.app";

function showMessage(id, message, type = "error") {
  const box = document.getElementById(id);

  if (!box) {
    if (type === "error") {
      alert(message);
    }
    return;
  }

  box.textContent = message;
  box.classList.remove("hidden", "text-red-600", "text-green-600");
  box.classList.add(type === "success" ? "text-green-600" : "text-red-600");
}

function clearMessage(id) {
  const box = document.getElementById(id);

  if (!box) return;

  box.textContent = "";
  box.classList.add("hidden");
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getToken(payload) {
  return (
    payload?.data?.token ||
    payload?.token ||
    payload?.accessToken ||
    null
  );
}

function getUser(payload) {
  return (
    payload?.data?.user ||
    payload?.user ||
    null
  );
}


// SIDEBAR

const menuBtn = document.getElementById("menuBtn");
const sidebarClose =
  document.getElementById("close-btn") ||
  document.getElementById("sidebar-close");
const sidebar = document.getElementById("sidebar");

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.remove("-translate-x-full");
  });
}

if (sidebarClose && sidebar) {
  sidebarClose.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
  });
}


// PASSWORD TOGGLE

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const togglePasswordImage = document.getElementById("togglePasswordImage");

if (password && togglePassword && togglePasswordImage) {
  togglePassword.addEventListener("click", () => {
    const hidden = password.type === "password";

    password.type = hidden ? "text" : "password";

    togglePasswordImage.src = hidden
      ? "/Images/Password.png"
      : "/Images/view.png";

    togglePasswordImage.alt = hidden
      ? "Hide password"
      : "Show password";

    togglePassword.setAttribute(
      "aria-label",
      hidden ? "Hide password" : "Show password"
    );
  });
}


// CONFIRM PASSWORD TOGGLE

const confirmPassword = document.getElementById("confirm-password");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const toggleConfirmPasswordImage =
  document.getElementById("toggleConfirmPasswordImage");

if (
  confirmPassword &&
  toggleConfirmPassword &&
  toggleConfirmPasswordImage
) {
  toggleConfirmPassword.addEventListener("click", () => {
    const hidden = confirmPassword.type === "password";

    confirmPassword.type = hidden ? "text" : "password";

    toggleConfirmPasswordImage.src = hidden
      ? "/Images/Password.png"
      : "/Images/view.png";

    toggleConfirmPasswordImage.alt = hidden
      ? "Hide password"
      : "Show password";

    toggleConfirmPassword.setAttribute(
      "aria-label",
      hidden ? "Hide password" : "Show password"
    );
  });
}


// SIGNUP

const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearMessage("signup-error");

    const fullName = document.getElementById("name")?.value.trim();
    const emailOrPhone = document.getElementById("email")?.value.trim();
    const passwordValue =
      document.getElementById("password")?.value || "";
    const confirmValue =
      document.getElementById("confirm-password")?.value || "";

    const submitButton =
      signupForm.querySelector('button[type="submit"]');

    if (
      !fullName ||
      !emailOrPhone ||
      !passwordValue ||
      !confirmValue
    ) {
      showMessage(
        "signup-error",
        "Please fill in all fields."
      );
      return;
    }

    if (passwordValue !== confirmValue) {
      showMessage(
        "signup-error",
        "Passwords do not match."
      );

      document
        .getElementById("confirm-password")
        ?.focus();

      return;
    }

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName,
            emailOrPhone,
            password: passwordValue
          })
        }
      );

      const result = await readJson(response);

      if (
        !response.ok ||
        result?.success === false
      ) {
        showMessage(
          "signup-error",
          result?.message || "Unable to create account."
        );
        return;
      }

      sessionStorage.setItem(
        "registrationSuccess",
        "Account created successfully. Please log in."
      );

      window.location.href = "/studentlogin.html";

    } catch (error) {
      console.error("Registration error:", error);

      showMessage(
        "signup-error",
        "Could not connect to the server. Please try again."
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML =
          'Sign Up <ion-icon name="arrow-forward-outline"></ion-icon>';
      }
    }
  });
}


// LOGIN

const loginForm = document.getElementById("login-form");

if (loginForm) {
  const registrationMessage =
    sessionStorage.getItem("registrationSuccess");

  if (registrationMessage) {
    showMessage(
      "login-message",
      registrationMessage,
      "success"
    );

    sessionStorage.removeItem("registrationSuccess");
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearMessage("login-error");

    const emailOrPhone =
      document.getElementById("email")?.value.trim();

    const passwordValue =
      document.getElementById("password")?.value || "";

    const submitButton =
      loginForm.querySelector('button[type="submit"]');

    if (!emailOrPhone || !passwordValue) {
      showMessage(
        "login-error",
        "Please enter your email and password."
      );
      return;
    }

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emailOrPhone,
            password: passwordValue
          })
        }
      );

      const result = await readJson(response);

      if (
        !response.ok ||
        result?.success === false
      ) {
        showMessage(
          "login-error",
          result?.message || "Incorrect email or password."
        );
        return;
      }

      const token = getToken(result);
      const user = getUser(result);

      if (!token) {
        showMessage(
          "login-error",
          "Login succeeded but no authentication token was returned."
        );
        return;
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      window.location.href = "/studentdashboard.html";

    } catch (error) {
      console.error("Login error:", error);

      showMessage(
        "login-error",
        "Could not connect to the server. Please try again."
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML =
          'Log in <ion-icon name="arrow-forward-outline"></ion-icon>';
      }
    }
  });
}


// GOOGLE LOGIN

const googleLogin = document.getElementById("google-login");

if (googleLogin) {
  googleLogin.addEventListener("click", () => {
    alert("Google login is not connected yet.");
  });
}


// FORGOT PASSWORD

const forgotPasswordForm =
  document.getElementById("forget-form") ||
  document.getElementById("forget-password-Form");

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      alert(
        "The forgot-password API has not been provided yet."
      );
    }
  );
}