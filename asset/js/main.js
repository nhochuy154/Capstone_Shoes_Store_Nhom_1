// document.getElementById("add-btn").addEventListener("click", function () {
//   const input = document.getElementById("todo-input");
//   const task = input.value.trim();
//   if (task) {
//     const li = document.createElement("li");
//     li.textContent = task;
//     document.getElementById("todo-list").appendChild(li);
//     input.value = "";
//   }
// });
// document.addEventListener("DOMContentLoaded", function () {
//   // Show newsletter popup after 3 seconds
//   setTimeout(function () {
//     const newsletterModal = new bootstrap.Modal(
//       document.getElementById("newsletterModal")
//     );

//     // Check if user has previously closed the modal
//     if (!localStorage.getItem("dontShowNewsletterPopup")) {
//       newsletterModal.show();
//     }
//   }, 3000);

//   // Handle "Don't show again" checkbox
//   const dontShowAgainCheckbox = document.getElementById("dontShowAgain");
//   if (dontShowAgainCheckbox) {
//     dontShowAgainCheckbox.addEventListener("change", function () {
//       if (this.checked) {
//         localStorage.setItem("dontShowNewsletterPopup", "true");
//       } else {
//         localStorage.removeItem("dontShowNewsletterPopup");
//       }
//     });
//   }

//   // Product quick view functionality
//   const quickViewButtons = document.querySelectorAll(
//     ".product-overlay .btn:first-child"
//   );
//   quickViewButtons.forEach((button) => {
//     button.addEventListener("click", function (e) {
//       e.preventDefault();
//       // Here you would typically show a modal with product details
//       alert("Quick view functionality would open a product detail modal");
//     });
//   });

//   // Add to cart functionality
//   const addToCartButtons = document.querySelectorAll(
//     ".product-overlay .btn:last-child"
//   );
//   addToCartButtons.forEach((button) => {
//     button.addEventListener("click", function (e) {
//       e.preventDefault();

//       // Update cart count
//       const cartCount = document.querySelector(".cart-count");
//       if (cartCount) {
//         let count = parseInt(cartCount.textContent);
//         cartCount.textContent = count + 1;
//       }

//       // Show notification
//       alert("Product added to cart!");
//     });
//   });

//   // Navbar scroll effect
//   window.addEventListener("scroll", function () {
//     const header = document.querySelector(".site-header");
//     if (window.scrollY > 50) {
//       header.classList.add("scrolled");
//     } else {
//       header.classList.remove("scrolled");
//     }
//   });

//   // Initialize dropdowns
//   const dropdownElementList = [].slice.call(
//     document.querySelectorAll(".dropdown-toggle")
//   );
//   dropdownElementList.map(function (dropdownToggleEl) {
//     return new bootstrap.Dropdown(dropdownToggleEl);
//   });
// });

const http = axios.create({
  baseURL: "https://shop.cyberlearn.vn",
  timeout: 30000,
});

document.addEventListener("DOMContentLoaded", function () {
  layDanhSachSanPham();
});

function layDanhSachSanPham() {
  http
    .get("/api/Product")
    .then((res) => {
      console.log("Lấy sản phẩm thành công:", res.data.content);
      renderDanhSachSanPham(res.data.content);
    })
    .catch((error) => {
      console.log("Lỗi khi lấy sản phẩm:", error);
    });
}

function renderDanhSachSanPham(arr) {
  let content = "";
  const top16 = arr.slice(0, 16);
  for (let product of top16) {
    let {
      alias,
      deleted,
      description,
      id,
      image,
      latitude,
      longtitude,
      name,
      price,
    } = product;

    content += `
      <div class="col-md-3 h-100">
        <div class="product-item">
          <div class="product-thumb">
            <a href="#">
              <img src="${image}" alt="${name}" />
            </a>
            <div class="button-group">
              <a href="#" data-bs-toggle="tooltip" aria-label="Add to Wishlist">
                <i class="fa-solid fa-heart"></i>
              </a>
              <a href="#" data-bs-toggle="modal" data-bs-target="#quick_view" aria-label="Quick View">
                <i class="fa fa-eye"></i>
              </a>
            </div>
            <div class="product-label">
              <span>new</span>
            </div>
            <div class="discount-label">
              <span>-10%</span>
            </div>
          </div>
          <div class="product-content">
            <div class="product-caption">
              <h6 class="product-name">
                <a href="product-details.html">${name}</a>
              </h6>
              <div class="price-box">
                <span class="price-old">$${price + price * 0.1}</span>
                <span class="price-regular">$${price}</span>
              </div>
              <a class="add-to-cart" href="cart.html">
                <i class="fa fa-shopping-cart"></i>
              </a>
            </div>
            <div class="ratings">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById("productList").innerHTML = content;
}
