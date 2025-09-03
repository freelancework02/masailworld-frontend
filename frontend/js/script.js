  document.addEventListener("DOMContentLoaded", () => {
            const loginForm = document.getElementById("login-form");

            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const username = document.getElementById("login-username").value.trim();
                const password = document.getElementById("login-password").value;

                if (!username || !password) {
                    alert("براہ کرم صارف نام اور پاس ورڈ درج کریں۔");
                    return;
                }

                try {
                    // Adjust backend URL accordingly
                    const response = await fetch("https://masailworld.onrender.com/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        alert("لاگ ان کامیاب ہوا! خوش آمدید، " + data.username);

                        // Redirect to admin.html with username and userid as URL parameters
                        // Encoding to be safe in URL
                        const userIdParam = encodeURIComponent(data.userId || data.id || data.userID || data.userid); // adjust if your backend returns a different key
                        const usernameParam = encodeURIComponent(data.username);

                        window.location.href = `./Pages/Admin.html?userId=${userIdParam}&username=${usernameParam}`;
                    } else {
                        alert(data.error || "صارف نام یا پاس ورڈ غلط ہے۔");
                    }
                } catch (err) {
                    alert("سرور سے رابطہ کرنے میں مسئلہ آیا۔ دوبارہ کوشش کریں۔");
                    console.error("Login error:", err);
                }
            });
        });
