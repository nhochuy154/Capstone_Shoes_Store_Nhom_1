document.addEventListener("DOMContentLoaded", function () {
    // Xử lý chọn giới tính
    const genderOptions = document.querySelectorAll(".gender-option");
    const genderInput = document.getElementById("gender");
    let genderSelected = true; // Đã có giá trị mặc định là Nam

    genderOptions.forEach((option) => {
        option.addEventListener("click", function () {
            genderOptions.forEach((opt) => opt.classList.remove("active"));
            this.classList.add("active");
            genderInput.value = this.dataset.gender;
            genderSelected = true;
        });
    });

    // Xử lý form đăng ký
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const formData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value === "true",
            phone: document.getElementById("phone").value,
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Gửi dữ liệu lên server
        registerUser(formData);
    });

    // Hàm validate form
    function validateForm(data) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate email
        if (!emailRegex.test(data.email)) {
            document.getElementById("email").classList.add("is-invalid");
            isValid = false;
        } else {
            document.getElementById("email").classList.remove("is-invalid");
        }

        // Validate password
        if (data.password.length < 6) {
            document.getElementById("password").classList.add("is-invalid");
            isValid = false;
        } else {
            document.getElementById("password").classList.remove("is-invalid");
        }

        // Validate confirm password
        if (data.password !== confirmPassword) {
            document.getElementById("confirmPassword").classList.add("is-invalid");
            isValid = false;
        } else {
            document.getElementById("confirmPassword").classList.remove("is-invalid");
        }

        // Validate name
        if (data.name.trim() === "") {
            document.getElementById("name").classList.add("is-invalid");
            isValid = false;
        } else {
            document.getElementById("name").classList.remove("is-invalid");
        }

        // Validate phone
        if (!phoneRegex.test(data.phone)) {
            document.getElementById("phone").classList.add("is-invalid");
            isValid = false;
        } else {
            document.getElementById("phone").classList.remove("is-invalid");
        }

        return isValid;
    }

    // Hàm gửi dữ liệu đăng ký
    async function registerUser(data) {
        try {
            const response = await fetch("https://shop.cyberlearn.vn/api/Users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Hiển thị thông báo thành công với Toastify
                Toastify({
                    text: "Đăng ký tài khoản thành công!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                    stopOnFocus: true,
                    onClick: function () {},
                }).showToast();

                // Reset form
                registerForm.reset();
                genderOptions.forEach((opt) => opt.classList.remove("active"));
                genderOptions[0].classList.add("active"); // Active lại giới tính Nam
                genderInput.value = "true"; // Đặt lại giá trị mặc định
            } else {
                // Hiển thị thông báo lỗi với Toastify
                Toastify({
                    text: result.message || "Đăng ký thất bại. Vui lòng thử lại.",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    stopOnFocus: true,
                    onClick: function () {},
                }).showToast();
            }
        } catch (error) {
            console.error("Error:", error);
            // Hiển thị thông báo lỗi với Toastify
            Toastify({
                text: "Có lỗi xảy ra. Vui lòng thử lại sau.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                stopOnFocus: true,
                onClick: function () {},
            }).showToast();
        }
    }
});
