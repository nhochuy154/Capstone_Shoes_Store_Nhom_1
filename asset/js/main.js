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
            <a href="./product-detail.html?id=${id}">
              <img src="${image}" alt="${name}" />
            </a>
            <div class="button-group">
              <a href="#" data-bs-toggle="tooltip" aria-label="Add to Wishlist">
                <i class="fa-solid fa-heart"></i>
              </a>
              <a href="#" class="quick-view-btn " data-id="${id}" data-bs-toggle="modal" data-bs-target="#quick_view" aria-label="Quick View">
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
              <a class="add-to-cart" href="./product-detail.html?id=${id}">
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

  // Thêm event listener cho icon con mắt
  document.querySelectorAll(".quick-view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const product = arr.find((p) => p.id == id);
      if (product) {
        document.getElementById("modalProductImage").src = product.image;
        document.getElementById("modalProductName").textContent = product.name;
        document.getElementById("modalProductName").style.color = "black";
      }
    });
  });
}

// Sự kiện trái tim
document.addEventListener("DOMContentLoaded", function () {
  layDanhSachSanPham();

  // Đợi sản phẩm được render xong rồi mới gắn sự kiện
  setTimeout(() => {
    const heartIcons = document.querySelectorAll(".button-group .fa-heart");

    heartIcons.forEach((icon) => {
      icon.parentElement.addEventListener("click", function (e) {
        e.preventDefault();
        icon.classList.toggle("active");
      });
    });
  }, 500);
});
