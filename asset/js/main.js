document.getElementById("add-btn").addEventListener("click", function () {
  const input = document.getElementById("todo-input");
  const task = input.value.trim();
  if (task) {
    const li = document.createElement("li");
    li.textContent = task;
    document.getElementById("todo-list").appendChild(li);
    input.value = "";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Show newsletter popup after 3 seconds
  setTimeout(function () {
    const newsletterModal = new bootstrap.Modal(
      document.getElementById("newsletterModal")
    );

    // Check if user has previously closed the modal
    if (!localStorage.getItem("dontShowNewsletterPopup")) {
      newsletterModal.show();
    }
  }, 3000);

  // Handle "Don't show again" checkbox
  const dontShowAgainCheckbox = document.getElementById("dontShowAgain");
  if (dontShowAgainCheckbox) {
    dontShowAgainCheckbox.addEventListener("change", function () {
      if (this.checked) {
        localStorage.setItem("dontShowNewsletterPopup", "true");
      } else {
        localStorage.removeItem("dontShowNewsletterPopup");
      }
    });
  }

  // Product quick view functionality
  const quickViewButtons = document.querySelectorAll(
    ".product-overlay .btn:first-child"
  );
  quickViewButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      // Here you would typically show a modal with product details
      alert("Quick view functionality would open a product detail modal");
    });
  });

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll(
    ".product-overlay .btn:last-child"
  );
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Update cart count
      const cartCount = document.querySelector(".cart-count");
      if (cartCount) {
        let count = parseInt(cartCount.textContent);
        cartCount.textContent = count + 1;
      }

      // Show notification
      alert("Product added to cart!");
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".site-header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Initialize dropdowns
  const dropdownElementList = [].slice.call(
    document.querySelectorAll(".dropdown-toggle")
  );
  dropdownElementList.map(function (dropdownToggleEl) {
    return new bootstrap.Dropdown(dropdownToggleEl);
  });
});
